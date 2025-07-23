import type { CollectionEntry } from 'astro:content';
import setup from '@data/setup.json' with { type: 'json' };

interface TitleOptions {
  prefix?: string;
  postfix?: string;
}

/**
 * Returns the resolved title of a post, with optional prefix/postfix.
 *
 * @param post - A blog post collection item.
 * @param options - Optional prefix or postfix to wrap around the title.
 * @returns A full title string.
 *
 * @example
 * ```ts
 * const title = resolvePostTitle(post, { prefix: 'KOLLITSCH.dev - ' });
 * ```
 */
export function resolvePostTitle(
  post: CollectionEntry<'blog'> | undefined,
  options: TitleOptions = {},
): string {
  const title = post?.data?.title || setup.title;

  const { prefix = '', postfix = '' } = options;
  return `${prefix}${title}${postfix}`;
}
