// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';
import markdownNegotiation, {
  markdownPathFor,
  negotiateContent,
  parseAcceptHeader,
  qualityFor,
} from '../edge-functions/markdown-negotiation.ts';

describe('Markdown content negotiation', () => {
  it('parses q-values with sensible defaults', () => {
    expect(
      parseAcceptHeader('text/html, text/markdown;q=0.5, */*;q=0.1'),
    ).toEqual([
      { mediaRange: 'text/html', order: 0, quality: 1 },
      { mediaRange: 'text/markdown', order: 1, quality: 0.5 },
      { mediaRange: '*/*', order: 2, quality: 0.1 },
    ]);
  });

  it('uses specific media ranges before wildcards', () => {
    const entries = parseAcceptHeader('text/*;q=1, text/markdown;q=0.2');

    expect(qualityFor(entries, 'text/markdown')).toBe(0.2);
    expect(qualityFor(entries, 'text/html')).toBe(1);
  });

  it('keeps browser-like requests on HTML', () => {
    expect(
      negotiateContent(
        'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      ),
    ).toBe('html');
  });

  it('uses Markdown when explicitly named and tied with HTML', () => {
    expect(negotiateContent('text/markdown, text/html')).toBe('markdown');
  });

  it('keeps HTML when it has a higher q-value', () => {
    expect(negotiateContent('text/html, text/markdown;q=0.5')).toBe('html');
  });

  it('rejects supported paths when neither representation is acceptable', () => {
    expect(negotiateContent('application/json')).toBe('not-acceptable');
  });

  it('maps canonical blog URLs to generated Markdown routes', () => {
    expect(markdownPathFor('/blog/2026/example-post/')).toBe(
      '/blog/2026/example-post.md',
    );
    expect(markdownPathFor('/blog/2026/example-post')).toBe(
      '/blog/2026/example-post.md',
    );
    expect(markdownPathFor('/tags/css/')).toBeUndefined();
  });

  it('rewrites Markdown-preferring blog requests to the Markdown asset', async () => {
    const markdown = '# Example\n\nA small Markdown page.\n';
    const next = vi.fn(async () => {
      return new Response(markdown, {
        headers: {
          Link: '</blog/2026/example-post/>; rel="alternate"; type="text/html"',
        },
      });
    });
    const request = new Request('https://kollitsch.dev/blog/2026/example-post/', {
      headers: { Accept: 'text/markdown, text/html' },
    });

    const response = await markdownNegotiation(request, { next });

    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        url: 'https://kollitsch.dev/blog/2026/example-post.md',
      }),
    );
    expect(await response?.text()).toBe(markdown);
    expect(response?.headers.get('Content-Type')).toBe(
      'text/markdown; charset=utf-8',
    );
    expect(response?.headers.get('Vary')).toBe('Accept');
    expect(response?.headers.get('X-Markdown-Tokens')).toBe('9');
  });

  it('continues the normal request chain for HTML-preferring clients', async () => {
    const next = vi.fn();
    const request = new Request('https://kollitsch.dev/blog/2026/example-post/', {
      headers: { Accept: 'text/html, text/markdown;q=0.5' },
    });

    await expect(markdownNegotiation(request, { next })).resolves.toBeUndefined();
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 406 for unsupported media requests on supported blog URLs', async () => {
    const next = vi.fn();
    const request = new Request('https://kollitsch.dev/blog/2026/example-post/', {
      headers: { Accept: 'application/json' },
    });

    const response = await markdownNegotiation(request, { next });

    expect(next).not.toHaveBeenCalled();
    expect(response?.status).toBe(406);
    expect(response?.headers.get('Vary')).toBe('Accept');
  });
});
