import type { BlogPost } from '@utils/content-object';

interface LlmsItem {
  title: string;
  description: string;
  link: string;
}

interface LlmsFullItem extends LlmsItem {
  pubDate: Date;
  category: string;
  body: string;
}

interface LlmsTxtConfig {
  name: string;
  description: string;
  site: string;
  items: LlmsItem[];
  optional?: LlmsItem[];
}

interface LlmsFullTxtConfig {
  name: string;
  description: string;
  author: string;
  site: string;
  items: LlmsFullItem[];
}

interface LlmsPostConfig {
  post: BlogPost;
  site: string;
  link: string;
}

/**
 * Regular expressions used to remove MDX/JSX import lines and component tags
 * from a rendered content string so the plain-text export is cleaner.
 */
const MDX_PATTERNS = [
  /^import\s+.+from\s+['"].+['"];?\s*$/gm,
  /<[A-Z][a-zA-Z]*[^>]*>[\s\S]*?<\/[A-Z][a-zA-Z]*>/g,
  /<[A-Z][a-zA-Z]*[^>]*\/>/g,
] as const;

/**
 * Strip common MDX/JSX artifacts from a post body.
 *
 * This removes import lines and component tags (including their contents
 * for paired tags and self-closing tags) so the resulting text is plain
 * and suitable for LLM consumption.
 *
 * @param content - The raw post body (may contain MDX/JSX)
 * @returns Cleaned plain-text string
 */
export function stripMdx(content: string): string {
  return MDX_PATTERNS.reduce(
    (text, pattern) => text.replace(pattern, ''),
    content,
  ).trim();
}

/**
 * Format a Date to YYYY-MM-DD. Returns `undefined` for falsy input.
 */
function formatDate(date?: Date | null): string | undefined {
  if (!date) return undefined;
  return date.toISOString().split('T')[0] ?? '';
}

/**
 * Build the final Response object for a plain-text document. Joins the
 * provided sections, collapses excessive blank lines, and returns a
 * `Response` with the correct `Content-Type` header.
 */
function doc(...sections: (string | string[])[]): Response {
  const content = sections
    .flat()
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  return new Response(content + '\n', {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}

/**
 * Create the document header block used by the text exporters.
 */
function header(name: string, description: string): string[] {
  return [`# ${name}`, '', `> ${description}`];
}

/**
 * Render a simple markdown-style link list for the index outputs.
 */
function linkList(title: string, items: LlmsItem[], site: string): string[] {
  return [
    '',
    `## ${title}`,
    ...items.map(
      (item) => `- [${item.title}](${site}${item.link}): ${item.description}`,
    ),
  ];
}

/**
 * Render a small metadata block for a post.
 */
function postMeta(
  site: string,
  link: string,
  pubDate: Date,
  category: string,
): string[] {
  return [
    `URL: ${site}${link}`,
    `Published: ${formatDate(pubDate)}`,
    `Category: ${category}`,
  ];
}

/**
 * Build a compact index-style text document for LLM consumption. Includes
 * a header, a posts list and an optional links section.
 */
export function llmsTxt(config: LlmsTxtConfig): Response {
  const sections = [
    header(config.name, config.description),
    linkList('Posts', config.items, config.site),
  ];

  if (config.optional?.length) {
    sections.push(linkList('Optional', config.optional, config.site));
  }

  return doc(...sections);
}

/**
 * Build a full-content text document which includes author/site info and
 * each post with metadata and the cleaned body.
 */
export function llmsFullTxt(config: LlmsFullTxtConfig): Response {
  const head = [
    ...header(config.name, config.description),
    '',
    `Author: ${config.author}`,
    `Site: ${config.site}`,
    '',
    '---',
  ];

  const posts = config.items.flatMap((item) => [
    '',
    `## ${item.title}`,
    '',
    ...postMeta(config.site, item.link, item.pubDate, item.category),
    '',
    `> ${item.description}`,
    '',
    stripMdx(item.body),
    '',
    '---',
  ]);

  return doc(head, posts);
}

/**
 * Build a single-post text document (title, description, meta, body).
 */
export function llmsPost(config: LlmsPostConfig): Response {
  const { post, site, link } = config;
  const { title, description, pubDate, category } = post.data;

  return doc(
    `# ${title}`,
    '',
    `> ${description}`,
    '',
    ...postMeta(site, link, pubDate, category),
    '',
    stripMdx(post.body ?? ''),
  );
}

/**
 * Convert an array of BlogPost objects to the lightweight LlmsItem shape.
 */
export function postsToLlmsItems(
  posts: BlogPost[],
  formatUrl: (slug: string) => string,
): LlmsItem[] {
  return posts.map((post) => ({
    description: post.data.description,
    link: formatUrl(post.slug),
    title: post.data.title,
  }));
}

/**
 * Convert an array of BlogPost objects to the full LlmsFullItem shape
 * including publication date, category and raw body.
 */
export function postsToLlmsFullItems(
  posts: BlogPost[],
  formatUrl: (slug: string) => string,
): LlmsFullItem[] {
  return posts.map((post) => ({
    ...postsToLlmsItems([post], formatUrl)[0],
    body: post.body ?? '',
    category: post.data.category,
    pubDate: post.data.pubDate,
  }));
}
