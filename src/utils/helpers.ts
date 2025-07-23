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

/**
 * @deprecated Use `log.debug(...)` or `log.note(...)` from `@utils/helpers` instead.
 *
 * Logs debug messages with timestamp and label per line.
 * Strings are printed directly, other types include their type and value.
 *
 * @example
 * logDebug('Hello', 123, { a: 1 });
 */
export function logDebug(...args: unknown[]) {
  const grey = '\x1b[33m'; // timestamp
  const yellow = '\x1b[35m'; // label
  const dim = '\x1b[2m'; // type info
  const reset = '\x1b[0m';

  const prefix = () =>
    `${grey}${new Date().toTimeString().slice(0, 8)}${reset} ${yellow}[dnb]${reset}`;

  for (const arg of args) {
    if (typeof arg === 'string') {
      console.log(`${prefix()} ${arg}`);
    } else {
      const type = typeof arg;
      const value =
        type === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
      console.log(`${prefix()} ${dim}(${type})${reset} ${value}`);
    }
  }
}

/** Info about a single tag */
export interface TagInfo {
  count: number;
  posts: Awaited<ReturnType<typeof getCollection>>[number][];
}

/**
 * Return a Map of all tags used in the `blog` collection without threshold filtering.
 */
export async function getAllTags(): Promise<Map<string, TagInfo>> {
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

  return tagMap;
}

/**
 * Utility logger with timestamped, color-coded output.
 * Use log.debug(...) and log.note(...) for different log levels.
 */
const colors = {
  labelDebug: '\x1b[35m',
  labelNote: '\x1b[32m',
  reset: '\x1b[0m',
  timestamp: '\x1b[33m',
  type: '\x1b[2m',
};

/**
 * Format timestamp prefix with colored label
 */
function formatPrefix(labelColor: string): string {
  const time = new Date().toTimeString().slice(0, 8);
  return `${colors.timestamp}${time}${colors.reset} ${labelColor}[dnb]${colors.reset}`;
}

/**
 * Shared print routine
 */
function print(labelColor: string, ...args: unknown[]): void {
  const prefix = formatPrefix(labelColor);
  for (const arg of args) {
    if (typeof arg === 'string') {
      console.log(`${prefix} ${arg}`);
    } else {
      const type = typeof arg;
      const value =
        type === 'object' ? JSON.stringify(arg, null, 2) : String(arg);
      console.log(`${prefix} ${colors.type}(${type})${colors.reset} ${value}`);
    }
  }
}

export const log = {
  /**
   * Logs a debug message (timestamped, purple label).
   * @example log.debug('Hello', { a: 1 });
   */
  debug: (...args: unknown[]) => print(colors.labelDebug, ...args),

  /**
   * Logs a note/info message (timestamped, green label).
   * @example log.note('Start finished.', configObject);
   */
  note: (...args: unknown[]) => print(colors.labelNote, ...args),
};

// Create a random string of the specified length
export function generateRandomString(len: number) {
  return Array.from(crypto.getRandomValues(new Uint8Array(len)))
    .map((n) => (n % 36).toString(36))
    .join('');
}
