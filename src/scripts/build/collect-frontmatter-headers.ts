/**
 * Collects Cloudflare `_headers` rules from blog post frontmatter.
 *
 * Reads `src/content/blog/**\/*.{md,mdx}` frontmatter directly via
 * `gray-matter` (rather than `astro:content`, which isn't resolvable from an
 * Astro integration hook - it's a Vite virtual module scoped to the page
 * render pipeline, not to `astro.config.ts` and its imports).
 *
 * A post opts in with a flat header-name/value map:
 *
 * ```yaml
 * headers:
 *   X-Robots-Tag: noindex
 * ```
 *
 * No path is specified because it's implicit - the rule always targets the
 * post's own permalink (`/blog/{year}/{slug}/`).
 */

import fg from 'fast-glob';
import matter from 'gray-matter';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { PathRule } from '../../data/headers.ts';

const BLOG_CONTENT_PATH = join(process.cwd(), 'src/content/blog');

/** Derives the `/blog/{year}/{slug}/` permalink from a content file path. */
function permalinkFor(filePath: string): string | undefined {
  const relative = filePath
    .slice(BLOG_CONTENT_PATH.length)
    .replace(/^[/\\]/, '')
    .replace(/\\/g, '/');
  const [year, slug] = relative.split('/');
  if (!year || !slug) return undefined;
  return `/blog/${year}/${slug}/`;
}

/**
 * Scans blog posts and returns `PathRule` values only for explicit frontmatter
 * headers. Markdown alternate headers are generic rules in `src/data/headers.ts`
 * so the generated `_headers` file stays inside Cloudflare's rule limit.
 */
export async function collectFrontmatterHeaderRules(): Promise<PathRule[]> {
  const files = await fg(`${BLOG_CONTENT_PATH}/**/*.{md,mdx}`);
  const rules: PathRule[] = [];

  for (const file of files) {
    const raw = await readFile(file, 'utf8');
    const { data } = matter(raw);

    if (data['draft'] === true) continue;

    const headers = data['headers'];

    const path = permalinkFor(file);
    if (!path) continue;

    const entries =
      headers && typeof headers === 'object' && !Array.isArray(headers)
        ? Object.entries(headers).filter(
          (entry): entry is [string, string] => typeof entry[1] === 'string',
        )
        : [];

    if (entries.length > 0) {
      rules.push({
        path,
        comment: `Frontmatter headers for ${file.slice(process.cwd().length + 1)}`,
        headers: entries.map(([name, value]) => ({ name, value })),
      });
    }
  }

  return rules;
}
