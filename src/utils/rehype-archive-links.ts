import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import type { Root } from 'hast';
import { fromHtml } from 'hast-util-from-html';
import { toHtml } from 'hast-util-to-html';
import { decorateArchiveLinks } from './archive-links.pure.ts';

const require = createRequire(import.meta.url);

let cachedIconPath: string | undefined;

/**
 * Reads the Internet Archive path data from the installed `simple-icons-astro`
 * package, so the mark always matches the registered
 * `simple-icons:internetarchive` icon.
 */
export function getInternetArchiveIconPath(): string {
  if (cachedIconPath) return cachedIconPath;

  const file = require.resolve('simple-icons-astro/Internetarchive');
  const source = readFileSync(file, 'utf8');
  const match = /<path\s+d="([^"]+)"/.exec(source);

  if (!match?.[1]) {
    throw new Error(
      `Could not read the Internet Archive icon path from "${file}".`,
    );
  }

  cachedIconPath = match[1];
  return cachedIconPath;
}

/**
 * Rehype plugin: marks links to Internet Archive snapshots
 * (`https://web.archive.org/web/<timestamp>/<url>`) with the Internet Archive
 * icon and a tooltip that names the capture date.
 */
export function rehypeArchiveLinks() {
  return (tree: Root): void => {
    decorateArchiveLinks(tree, getInternetArchiveIconPath());
  };
}

/**
 * Applies the same marker to an HTML fragment, for HTML that is rendered
 * outside the Markdown pipeline (for example `cover.title` captions).
 */
export function decorateArchiveLinksInHtml(html: string): string {
  if (!html.includes('web.archive.org')) return html;

  const tree = fromHtml(html, { fragment: true });
  decorateArchiveLinks(tree, getInternetArchiveIconPath());
  return toHtml(tree);
}
