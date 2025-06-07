// a collection of helper functions for various tasks
import { getCollection } from 'astro:content';

export interface TagInfo {
  count: number;
  posts: Awaited<ReturnType<typeof getCollection>>; // filtered posts
}

export async function getValidTags(): Promise<Map<string, TagInfo>> {
  const blogPosts = await getCollection('blog');
  const tagMap = new Map<string, TagInfo>();

  for (const post of blogPosts) {
    const tags = post.data.tags || [];
    for (const tag of tags) {
      const entry = tagMap.get(tag) || { count: 0, posts: [] };
      entry.count += 1;
      entry.posts.push(post);
      tagMap.set(tag, entry);
    }
  }

  // remove tags with < 2 posts
  for (const [tag, info] of tagMap.entries()) {
    if (info.count < 2) {
      tagMap.delete(tag);
    }
  }

  return tagMap;
}

/**
 * Generates a unique ID string for HTML elements.
 *
 * @param prefix - Optional prefix for the ID (e.g., 'section', 'input')
 * @param length - Length of the random hexadecimal part (default: 8)
 * @returns A unique, prefix-based ID like "prefix-a1b2c3d4"
 */
export function generateUniqueHtmlId(prefix = 'dnbuid', length = 16): string {
  const randomHex = Array.from(
    // browser-safe crypto.getRandomValues, which is available in Astro
    // components, because it supports Web Crypto via polyfill
    crypto.getRandomValues(new Uint8Array(length / 2)),
  )
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${prefix}-${randomHex}`;
}
