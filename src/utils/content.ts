import type { z } from 'astro:content';
import { blogSchema } from '../content.config.js';

import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import site from '@data/setup.json';
import { log } from '@utils/debug';


import setup from '@data/setup.json';
import siteinfo from '@data/setup.json';

type BlogPost = CollectionEntry<'blog'>;

export type CoverData = BlogPost['data']['cover'];


/**
 * Creates a new properties object by merging provided props with defaults.
 *
 * ```
 * import { mergePropsWithDefaults } from '@utils/content';
 * export interface Props {
 *   tags: Map<string, number>;
 *   minSize?: number;
 *   maxSize?: number;
 * }
 * const props = mergePropsWithDefaults(Astro.props as Props, {
 *   minSize: 0.75, // rem
 *   maxSize: 2.0,  // rem
 * }) as Required<Pick<Props,
 *   'tags' | 'minSize' | 'maxSize'
 * >>;
 * ```
 */
export function mergePropsWithDefaults<T extends object>(
  props: T,
  defaults: Partial<T>,
): T {
  return {
    ...defaults,
    ...props,
  };
}


/**
 * Create a fully valid BlogPost object with defaults,
 * even if the input is missing or malformed.
 *
 * @param input - Partial or unknown input to normalize
 * @returns Valid BlogPost object based on schema
 */
export function createDefaultPost(input: unknown = {}): BlogPost {
  const fallback: Partial<z.input<typeof blogSchema>> = {
    aliases: [],
    cover: undefined,
    date: new Date(),
    description: 'No description available.',
    draft: false,
    featured: false,
    fmContentType: undefined,
    resources: [],
    summary: '',
    tags: [],
    title: 'Untitled Post',
  };

  const safeInput =
    input && typeof input === 'object' && !Array.isArray(input)
      ? { ...fallback, ...input }
      : fallback;

  const parsed = blogSchema.safeParse(safeInput);
  if (parsed.success) {
    return parsed.data;
  }

  console.warn(
    '✖ Blog post input invalid. Using fallback defaults.',
    parsed.error.format(),
  );
  return blogSchema.parse(fallback);
}



export interface BreadcrumbItem {
  label: string;
  href: string;
}

/**
 * Breadcrumb generation based on blog entry filePath.
 *
 * This assumes all breadcrumb paths are inside the `blog` collection.
 * If you later add other content types (e.g. `til`, `projects`),
 * update the `allEntries` collection merge.
 *
 * See full discussion:
 * https://chatgpt.com/share/687f920a-cd4c-8009-a98d-334e90075fc0
 */
export async function getBreadcrumbs(
  filePath: string,
  skipIndex = 0,
): Promise<BreadcrumbItem[]> {
  const homepage = getHomepageUrl().replace(/\/+$/, '');

  // Normalize and strip to relevant path
  const normalizedPath = filePath
    .replace(/\\/g, '/') // Windows compatibility
    .replace(/^.*\/(pages|content)\//, '') // strip up to pages/content
    .replace(/index\.(md|mdx)$/, '') // remove trailing index file
    .replace(/\.(md|mdx)$/, '') // remove .md if not index
    .replace(/\/+/g, '/'); // normalize slashes

  const segments = normalizedPath.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    { href: `${homepage}/`, label: 'Home' },
  ];

  const allEntries = await getCollection('blog');
  let currentPath = '';

  for (let i = skipIndex; i < segments.length; i++) {
    const segment = segments[i];
    currentPath += `/${segment}`;

    // Try to match with an entry title
    const match = allEntries.find((entry) => {
      const entryPath = `/${entry.id}`.replace(/\/+$/, '');
      return entryPath === currentPath;
    });

    const label = match?.data?.title
      ? match.data.title
      : // @ts-expect-error
      segment
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

    breadcrumbs.push({
      href: `${homepage}${currentPath}/`,
      label,
    });
  }

  return breadcrumbs;
}

export function toBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]): {
  itemListElement: {
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }[];
} {
  return {
    itemListElement: breadcrumbs.map((crumb, index) => {
      const isLast = index === breadcrumbs.length - 1;
      return {
        '@type': 'ListItem',
        name: crumb.label,
        position: index + 1,
        ...(isLast ? {} : { item: crumb.href }),
      };
    }),
  };
}

export function getFilteredTagMap(posts: CollectionEntry<'blog'>[]) {
  const ignoreTags = new Set(site.ignoreTags || []);
  log.debug('[ignoredTags] ' + site.ignoreTags);
  const tagThreshold = site.tagThreshold ?? 1;
  const tagMap = new Map<string, number>();

  for (const post of posts) {
    if (Array.isArray(post.data.tags)) {
      for (const tag of post.data.tags) {
        if (!ignoreTags.has(tag)) {
          tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
        }
      }
    }
  }

  for (const [tag, count] of tagMap) {
    if (count < tagThreshold) {
      //log.debug(`[filter] Dropping "${tag}" with count ${count}`);
      tagMap.delete(tag);
    }
  }

  return tagMap;
}


const POST_LIMIT = siteinfo.homepage?.recent_posts ?? 6;

/**
 * Load and return the featured post and recent posts for homepage display.
 *
 * - `featuredPost` is guaranteed to be a single post (never undefined)
 * - `recentPosts` is always an array (can be empty if only one post exists)
 */
export async function getHomepagePosts(): Promise<{
  featuredPost: CollectionEntry<'blog'>;
  recentPosts: CollectionEntry<'blog'>[];
}> {
  const allPosts = await getCollection('blog', ({ data }) => !data.draft);

  if (allPosts.length === 0) {
    throw new Error('[getHomepagePosts] No published blog posts available.');
  }

  const sorted = allPosts.sort(
    (a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
  );

  // Extract featured post first (if any)
  const maybeFeatured = sorted.find((post) => post.data.featured === true);
  const fallback = sorted[0];

  // Guarantee a featuredPost by assigning fallback explicitly
  // @ts-ignore - we KNOW this will result in a single valid post (because the content exists)
  const featuredPost: CollectionEntry<'blog'> = maybeFeatured ?? fallback;

  // Filter out the featured post from recent list
  const recentPosts: CollectionEntry<'blog'>[] = sorted
    .filter((post) => post.id !== featuredPost.id)
    .slice(0, POST_LIMIT);

  return {
    featuredPost,
    recentPosts,
  };
}

/**
 * Options for getHomepageUrl.
 * In development, site is optional.
 * In production, site should be provided, but this is enforced at runtime.
 */
interface GetHomepageUrlOptions {
  site?: URL | string; // Accepts URL or string, optional for flexibility
}

/**
 * Returns the homepage URL depending on the current environment.
 * - Returns "/" in development
 * - Returns Astro.site when passed as context
 * - Falls back to siteinfo.base or siteinfo.url in production
 */
export function getHomepageUrl(options?: GetHomepageUrlOptions): string {
  if (import.meta.env.DEV) return '/';

  const site = options?.site ?? siteinfo.url;
  if (!site) {
    throw new Error(
      'getHomepageUrl: Missing site context. Pass { site: Astro.site } or define siteinfo.url.',
    );
  }

  return (site instanceof URL ? site : new URL(site)).toString();
}



export const getPostsSortedByDraft = (allPosts: CollectionEntry<'blog'>[]) => {
  return allPosts
    .filter((post) => {
      if (import.meta.env.PROD) {
        return !post.data.draft;
      }
      return setup.overrides.showDraftsInDev ? true : !post.data.draft;
    })
    .sort((post1, post2) => {
      if (isDateBefore(post1.data.date, post2.data.date)) {
        return 1;
      } else {
        return -1;
      }
    });
};

// sorting by date in descending order
export const isDateBefore = (date1: Date, date2: Date) =>
  date1.getTime() < date2.getTime();

// sorting by date in ascending order
export const isDateAfter = (date1: Date, date2: Date) =>
  date1.getTime() > date2.getTime();



export interface PaginatedPosts {
  posts: CollectionEntry<'blog'>[];
  totalPages: number;
}

/**
 * Returns sorted, paginated blog posts for a given year.
 *
 * @param year - The 4-digit year string (e.g. "2025")
 * @param page - Page number, 1-based
 * @param pageSize - Items per page
 */
export async function paginateBlogPostsByYear(
  year: string,
  page: number,
  pageSize: number,
): Promise<PaginatedPosts> {
  const allPosts = await getCollection('blog');

  const postsOfYear = allPosts
    .filter((post) => new Date(post.data.date).getFullYear().toString() === year)
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

  const totalPages = Math.ceil(postsOfYear.length / pageSize);
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  return {
    posts: postsOfYear.slice(start, end),
    totalPages,
  };
}

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
  title: string,
  options: TitleOptions = {},
): string {
  title = title || setup.title;

  const { prefix = '', postfix = '' } = options;
  return `${prefix}${title}${postfix}`;
}


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

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Returns a `vscode://file/` link to a given file path inside your project.
 * @param relativePath - Path relative to the project root, e.g. 'src/components/meta/PublishData.astro'
 * @returns VS Code deep link to open the file.
 */
export function getVSCodeLink(relativePath: string): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);
  const projectRoot = resolve(currentDir, '../../'); // Adjust this if file moves
  const fullPath = projectRoot + relativePath;
  return `vscode://file/${fullPath}`;
}

/**
 * Returns a `vscode://file/` URL to a given file path inside your project.
 *
 * @param relativePath - Path relative to the project root, e.g. 'src/components/meta/PublishData.astro'
 * @returns VS Code deep link to open the file.
 */
export function getVSCodeURL(relativePath: string): string {
  const currentFile = fileURLToPath(import.meta.url);
  const currentDir = dirname(currentFile);
  const projectRoot = resolve(currentDir, '../../'); // Adjust this if file moves
  const fullPath = projectRoot + relativePath;
  return `vscode://file/${fullPath}`;
}

export function getVSCodeUrlById(id: string, type: 'blog' = 'blog'): string {
  const vscodeURL = getVSCodeURL(
    '/src/content/' + type + '/' + id + '/index.md',
  );
  return vscodeURL;
}
