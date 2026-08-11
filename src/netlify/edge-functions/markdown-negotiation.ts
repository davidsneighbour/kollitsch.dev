type Context = {
  next: (request?: Request) => Promise<Response>;
};

type NegotiatedContent = 'html' | 'markdown' | 'not-acceptable';

type AcceptEntry = {
  mediaRange: string;
  order: number;
  quality: number;
};

const MARKDOWN_TYPE = 'text/markdown';
const HTML_TYPE = 'text/html';
const VARY_ACCEPT = 'Accept';

function parseQuality(parameters: string[]): number {
  const qualityParameter = parameters.find((parameter) =>
    parameter.trim().toLowerCase().startsWith('q='),
  );

  if (!qualityParameter) return 1;

  const quality = Number.parseFloat(qualityParameter.split('=')[1] ?? '');

  if (Number.isNaN(quality)) return 0;

  return Math.min(Math.max(quality, 0), 1);
}

export function parseAcceptHeader(accept: string | null): AcceptEntry[] {
  if (!accept) return [{ mediaRange: '*/*', order: 0, quality: 1 }];

  return accept
    .split(',')
    .map((part, order) => {
      const [mediaRange, ...parameters] = part
        .split(';')
        .map((value) => value.trim());

      return {
        mediaRange: (mediaRange ?? '').toLowerCase(),
        order,
        quality: parseQuality(parameters),
      };
    })
    .filter((entry) => entry.mediaRange.includes('/'));
}

function specificity(mediaRange: string, target: string): number | undefined {
  if (mediaRange === target) return 2;

  const [rangeType, rangeSubtype] = mediaRange.split('/');
  const [targetType] = target.split('/');

  if (rangeType === targetType && rangeSubtype === '*') return 1;
  if (rangeType === '*' && rangeSubtype === '*') return 0;

  return undefined;
}

export function qualityFor(
  entries: AcceptEntry[],
  target: typeof HTML_TYPE | typeof MARKDOWN_TYPE,
): number {
  const matches = entries
    .map((entry) => ({
      ...entry,
      specificity: specificity(entry.mediaRange, target),
    }))
    .filter(
      (entry): entry is AcceptEntry & { specificity: number } =>
        entry.specificity !== undefined,
    )
    .sort(
      (first, second) =>
        second.specificity - first.specificity ||
        second.quality - first.quality ||
        first.order - second.order,
    );

  return matches[0]?.quality ?? 0;
}

export function negotiateContent(accept: string | null): NegotiatedContent {
  const entries = parseAcceptHeader(accept);
  const htmlQuality = qualityFor(entries, HTML_TYPE);
  const markdownQuality = qualityFor(entries, MARKDOWN_TYPE);
  const namesMarkdown = entries.some(
    (entry) => entry.mediaRange === MARKDOWN_TYPE && entry.quality > 0,
  );

  if (htmlQuality <= 0 && markdownQuality <= 0) {
    return 'not-acceptable';
  }

  if (namesMarkdown && markdownQuality >= htmlQuality) {
    return 'markdown';
  }

  return 'html';
}

export function markdownPathFor(pathname: string): string | undefined {
  if (pathname === '/') return '/llms.txt';

  const match = pathname.match(/^\/blog\/(\d{4})\/([^/.]+)\/?$/);

  if (!match) return undefined;

  const [, year, slug] = match;

  return `/blog/${year}/${slug}.md`;
}

function estimateMarkdownTokens(markdown: string): number {
  return Math.max(1, Math.ceil(markdown.length / 4));
}

function setMarkdownResponseHeaders(headers: Headers, markdown?: string): Headers {
  const nextHeaders = new Headers(headers);
  const vary = nextHeaders.get('Vary');
  const varyParts =
    vary
      ?.split(',')
      .map((part) => part.trim())
      .filter(Boolean) ?? [];

  if (
    !varyParts.some(
      (part) => part.toLowerCase() === VARY_ACCEPT.toLowerCase(),
    )
  ) {
    varyParts.push(VARY_ACCEPT);
  }

  nextHeaders.set('Content-Type', 'text/markdown; charset=utf-8');
  nextHeaders.set('Vary', varyParts.join(', '));

  if (markdown) {
    nextHeaders.set(
      'X-Markdown-Tokens',
      estimateMarkdownTokens(markdown).toString(),
    );
  }

  return nextHeaders;
}

function notAcceptable(): Response {
  return new Response('Not Acceptable\n', {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      Vary: 'Accept',
    },
    status: 406,
  });
}

export default async function markdownNegotiation(
  request: Request,
  context: Context,
): Promise<Response | undefined> {
  const url = new URL(request.url);
  const markdownPath = markdownPathFor(url.pathname);

  if (!markdownPath) return undefined;

  const negotiated = negotiateContent(request.headers.get('Accept'));

  if (negotiated === 'not-acceptable') return notAcceptable();
  if (negotiated === 'html') return undefined;

  const markdownUrl = new URL(markdownPath, request.url);
  const response = await context.next(new Request(markdownUrl, request));

  const markdown = await response.text();
  const headers = setMarkdownResponseHeaders(response.headers, markdown);

  return new Response(markdown, {
    headers,
    status: response.status,
    statusText: response.statusText,
  });
}

export const config = {
  method: ['GET'],
  path: ['/', '/blog/*'],
};
