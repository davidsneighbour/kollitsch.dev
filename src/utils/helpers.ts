// a collection of helper functions for various tasks
import { getCollection } from 'astro:content';
import siteinfo from '@data/setup.json'; // loads tagThreshold config

/**
 * A mapping object representing information about a tag.
 */
export interface TagInfo {
  /**
   * Total number of posts with this tag.
   */
  count: number;

  /**
   * Array of posts that contain this tag.
   */
  posts: Awaited<ReturnType<typeof getCollection>>; // filtered posts
}

/**
 * Collects all tags from blog posts and filters out those used less than a given threshold.
 *
 * - Loads all posts from the 'blog' content collection.
 * - Extracts tags from post frontmatter.
 * - Counts occurrences and gathers matching posts per tag.
 * - Removes tags with fewer than the configured threshold (from setup.json).
 *
 * @returns A Promise that resolves to a Map where each key is a tag name and the value is its associated count and posts.
 */
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

  const threshold = siteinfo.tagThreshold ?? 2;

  // remove tags with < threshold posts
  for (const [tag, info] of tagMap.entries()) {
    if (info.count < threshold) {
      tagMap.delete(tag);
    }
  }

  return tagMap;
}

/**
 * Generates a unique ID string for HTML elements.
 *
 * That ID should be ugly and unique. Nobody cares.
 * It's used for dynamic replacement inside components or layouts.
 * The ID is only used within a self-contained context.
 *
 * @param prefix - Optional prefix for the ID (e.g., 'section', 'input'). Defaults to 'dnbuid'.
 * @param length - Length of the random hexadecimal part (must be even). Defaults to 16.
 * @returns A unique, prefix-based ID like 'prefix-a1b2c3d4'
 *
 * @throws Will throw if length is not a positive even number.
 *
 * @example
 * generateUniqueHtmlId('block', 8); // block-8e4a32f1
 */
export function generateUniqueHtmlId(prefix = 'dnbuid', length = 16): string {
  const isEven = length % 2 === 0;
  if (!isEven || length <= 0) {
    throw new Error(
      'generateUniqueHtmlId: Length must be a positive even number.',
    );
  }

  const randomHex = Array.from(
    // browser-safe crypto.getRandomValues, which is available in Astro
    // components, because it supports Web Crypto via polyfill
    crypto.getRandomValues(new Uint8Array(length / 2)),
  )
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  return `${prefix}-${randomHex}`;
}
