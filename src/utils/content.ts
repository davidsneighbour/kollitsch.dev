import type { CollectionEntry, z } from 'astro:content';

import { getCollection } from 'astro:content';
import setup from '@data/setup.json' with { type: 'json' };
import siteinfo from '@data/setup.json' with { type: 'json' };
import { blogSchema } from '../content.config.ts';
import { createLogger } from './logger.ts';

export type BlogPost = CollectionEntry<'blog'>;

export type CoverData = BlogPost['data']['cover'];

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

const log = createLogger({ slug: 'content' });

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

export function createDefaultPost(input: unknown = {}): BlogPost['data'] {
  const fallback: Partial<z.input<typeof blogSchema>> = {
    aliases: [],
    contentFormat: 'md',
    cover: undefined,
    date: new Date('1970-01-01T00:00:00.000Z'),
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

  log.warn(
    '✖ Blog post input invalid. Using fallback defaults.',
    parsed.error.format(),
  );

  return blogSchema.parse(fallback);
}

export interface PostFrontmatterLike {
  readonly title?: string;
  readonly linktitle?: string;
  readonly description?: string;
  readonly draft?: boolean;
  readonly cover?: CoverData | string | null;
  readonly date?: Date | string;
  readonly lastModified?: Date | string;
}

export interface OpenGraphImagePayload {
  /** Title rendered onto OG images and used as an alt fallback. */
  title: string;
  /** Content entry id (e.g., '2024/slug') used for cover resolution. */
  id?: string;
  /** Content collection name (e.g., 'blog') used for cover resolution. */
  collection?: string;
  /** Cover information used to derive background imagery. */
  cover?: CoverData | string | null;
  /** Publication date for the associated content. */
  date?: Date | string;
  /** Last modified date for the associated content. */
  lastModified?: Date | string;
}

export interface OpenGraphPayload {
  /** Final, display-ready page title. */
  title: string;
  /** Short, clamped description of the page or entry. */
  description: string;
  /** Canonical URL for the page. */
  url: string;
  /** Optional OG image context; omitted when insufficient data. */
  image?: OpenGraphImagePayload;
}

export interface OpenGraphResolution {
  title: string;
  description: string;
  isDraft: boolean;
  payload: OpenGraphPayload;
}

export type OpenGraphSource =
  | (Partial<Pick<CollectionEntry<'blog'>, 'collection' | 'id'>> & {
      data?: Partial<BlogPost['data']> | PostFrontmatterLike;
    })
  | undefined;

export interface OpenGraphBuildOptions {
  canonicalUrl: string;
  frontmatter?: Record<string, unknown>;
  siteDescription?: string;
  siteTitle?: string;
  titlePostfix?: string;
}

/**
 * Clamp a string to the range [min,max] at a word boundary.
 */
export function clampDescription(input: string, min = 150, max = 170): string {
  const text = input.trim().replace(/\s+/g, ' ');
  if (text.length <= max && text.length >= min) return text;
  if (text.length < min) return text; // avoid padding with fluff
  // cut at last space before max to keep words intact
  const cut = text.slice(0, max + 1);
  const idx = cut.lastIndexOf(' ');
  return (idx > 0 ? cut.slice(0, idx) : cut).trim();
}

function firstNonEmptyString(values: readonly unknown[]): string {
  for (const value of values) {
    if (isNonEmptyString(value)) return value;
  }
  return '';
}

function normalizeFrontmatterLike(
  frontmatter?: Record<string, unknown>,
): PostFrontmatterLike {
  if (!frontmatter) return {};

  const pickDate = (value: unknown) =>
    value instanceof Date || typeof value === 'string' ? value : undefined;

  const coverValue = frontmatter.cover;
  const cover =
    typeof coverValue === 'string' ||
    (coverValue && typeof coverValue === 'object') ||
    coverValue === null
      ? (coverValue as PostFrontmatterLike['cover'])
      : undefined;

  return {
    cover,
    date: pickDate(frontmatter.date),
    description: isNonEmptyString(frontmatter.description)
      ? frontmatter.description
      : undefined,
    draft:
      typeof frontmatter.draft === 'boolean' ? frontmatter.draft : undefined,
    lastModified: pickDate(frontmatter.lastModified),
    linktitle: isNonEmptyString(frontmatter.linktitle)
      ? frontmatter.linktitle
      : undefined,
    title: isNonEmptyString(frontmatter.title) ? frontmatter.title : undefined,
  };
}

export function resolveOpenGraphPayload(
  post: OpenGraphSource,
  {
    canonicalUrl,
    frontmatter,
    siteDescription = '',
    siteTitle = '',
    titlePostfix = '',
  }: OpenGraphBuildOptions,
): OpenGraphResolution {
  const fm = normalizeFrontmatterLike(frontmatter);
  const data = post?.data as PostFrontmatterLike | undefined;

  const rawTitle = firstNonEmptyString([
    data?.linktitle,
    data?.title,
    fm.linktitle,
    fm.title,
    siteTitle,
  ]);
  const title = resolvePostTitle(rawTitle, { postfix: titlePostfix });

  const rawDescription =
    firstNonEmptyString([data?.description, fm.description]) || siteDescription;
  const description = clampDescription(rawDescription);

  const imageContext: OpenGraphImagePayload = {
    collection: post?.collection,
    cover: data?.cover ?? fm.cover,
    date: data?.date ?? fm.date,
    id: post?.id,
    lastModified: data?.lastModified ?? fm.lastModified,
    title,
  };

  const hasImageContext =
    typeof imageContext.id === 'string' ||
    typeof imageContext.collection === 'string' ||
    imageContext.cover !== undefined ||
    imageContext.date !== undefined ||
    imageContext.lastModified !== undefined;

  const payload: OpenGraphPayload = {
    description,
    title,
    url: canonicalUrl,
    ...(hasImageContext ? { image: imageContext } : {}),
  };

  return {
    description,
    isDraft: Boolean(data?.draft ?? fm.draft),
    payload,
    title,
  };
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

const toTitleCase = (segment: string) =>
  segment
    .split('-')
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(' ');

const pickFrontmatterString = (
  data: unknown,
  keys: readonly string[],
): string | null => {
  if (typeof data !== 'object' || data === null) return null;
  const rec = data as Record<string, unknown>;
  for (const key of keys) {
    const v = rec[key];
    if (typeof v === 'string') {
      const t = v.trim();
      if (t) return t;
    }
  }
  return null;
};

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
    .replace(/\\/g, '/')
    .replace(/^.*\/(pages|content)\//, '')
    .replace(/index\.(md|mdx)$/, '')
    .replace(/\.(md|mdx)$/, '')
    .replace(/\/+/g, '/');

  const segments = normalizedPath.split('/').filter(Boolean);

  const breadcrumbs: BreadcrumbItem[] = [
    { href: `${homepage}/`, label: 'Home' },
  ];
  const allEntries = await getCollection('blog');

  let currentPath = '';
  for (let i = skipIndex; i < segments.length; i++) {
    const segment = segments[i]!;
    currentPath += `/${segment}`;
    const href = `${homepage}${currentPath}/`;
    const isLast = i === segments.length - 1;

    let label: string;

    if (isLast) {
      const match = allEntries.find((entry) => {
        const entryPath = `/blog/${entry.id}`.replace(/\/+$/, '');
        return entryPath === currentPath;
      });

      const fmLabel = pickFrontmatterString(match?.data, [
        'linktitle',
        'title',
      ]);

      label = fmLabel ?? toTitleCase(segment);
    } else {
      label = toTitleCase(segment);
    }

    breadcrumbs.push({ href, label });
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
  const allPosts = getPostsSortedByDraft(await getCollection('blog'));

  const postsOfYear = allPosts.filter(
    (post) => new Date(post.data.date).getFullYear().toString() === year,
  );

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

type DateAwareCollections = 'blog';

/**
 * Retrieves the latest post from a date-aware collection.
 *
 * @param collectionName - A valid date-aware collection key (defaults to 'blog')
 * @returns The latest entry or `undefined` if none found
 */
export async function getLatestPost<T extends DateAwareCollections = 'blog'>(
  collectionName?: T,
): Promise<CollectionEntry<T> | undefined> {
  const collection = await getCollection(collectionName ?? ('blog' as T));
  const sorted = collection
    .filter((entry) => entry.data.date)
    .sort(
      (a, b) =>
        new Date(b.data.date).getTime() - new Date(a.data.date).getTime(),
    );
  return sorted[0];
}

/**
 * Format a Date object using custom format tokens.
 *
 * @example
 * console.log(formatDate(new Date(), 'MMMM D, YYYY HH:mm:ss Z'));
 * // -> "August 31, 2025 18:42:05 +07:00"
 *
 * @example
 * try {
 *   const s = formatDate(new Date(), 'MMMM D, YYYY HH:mm:ss Z', { locale: 'en-US' });
 *   console.log(s);
 * } catch (err) {
 *   console.error((err as Error).message);
 * }
 *
 * Supported tokens:
 *  YYYY - Full year (2024)
 *  YY   - Two-digit year (24)
 *  MMMM - Full month name (September)
 *  MMM  - Abbreviated month name (Sep)
 *  MM   - Two-digit month number (09)
 *  M    - Month number (9)
 *  DD   - Two-digit day of the month (07)
 *  D    - Day of the month (7)
 *  HH   - Two-digit hour (24-hour, 00-23)
 *  H    - Hour (24-hour, 0-23)
 *  hh   - Two-digit hour (12-hour, 01-12)
 *  h    - Hour (12-hour, 1-12)
 *  mm   - Two-digit minute (00-59)
 *  m    - Minute (0-59)
 *  ss   - Two-digit second (00-59)
 *  s    - Second (0-59)
 *  SSS  - Milliseconds (000-999)
 *  A    - AM/PM
 *  a    - am/pm
 *  Z    - Timezone offset (+HH:mm)
 *  ZZ   - Timezone offset (+HHmm)
 *
 * @param date - Date to format
 * @param format - Optional format string (default: "MMMM D, YYYY")
 * @param options - { locale?: string } Locale for month names, default 'en-US'
 * @returns Formatted date string
 * @throws TypeError when date is invalid or format is not a non-empty string
 */
export function formatDate(
  date: Date,
  format: string = 'MMMM D, YYYY',
  options: { locale?: string } = {},
): string {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    throw new TypeError('formatDate: "date" must be a valid Date.');
  }
  if (typeof format !== 'string' || format.length === 0) {
    throw new TypeError('formatDate: "format" must be a non-empty string.');
  }

  const { locale = 'en-US' } = options;

  const pad = (n: number, len = 2) => String(n).padStart(len, '0');

  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;

  const tzOffset = date.getTimezoneOffset(); // minutes from UTC, positive for zones behind UTC
  const tzSign = tzOffset > 0 ? '-' : '+';
  const tzHours = pad(Math.floor(Math.abs(tzOffset) / 60));
  const tzMinutes = pad(Math.abs(tzOffset) % 60);

  const tokenMap = new Map<string, string>([
    ['YYYY', String(date.getFullYear())],
    ['YY', String(date.getFullYear()).slice(-2)],
    ['MMMM', date.toLocaleString(locale, { month: 'long' })],
    ['MMM', date.toLocaleString(locale, { month: 'short' })],
    ['MM', pad(date.getMonth() + 1)],
    ['M', String(date.getMonth() + 1)],
    ['DD', pad(date.getDate())],
    ['D', String(date.getDate())],
    ['HH', pad(hours24)],
    ['H', String(hours24)],
    ['hh', pad(hours12)],
    ['h', String(hours12)],
    ['mm', pad(date.getMinutes())],
    ['m', String(date.getMinutes())],
    ['ss', pad(date.getSeconds())],
    ['s', String(date.getSeconds())],
    ['SSS', pad(date.getMilliseconds(), 3)],
    ['A', hours24 < 12 ? 'AM' : 'PM'],
    ['a', hours24 < 12 ? 'am' : 'pm'],
    ['Z', `${tzSign}${tzHours}:${tzMinutes}`],
    ['ZZ', `${tzSign}${tzHours}${tzMinutes}`],
  ]);

  // Build a single alternation regex of tokens (longest first to prefer e.g. 'MMMM' over 'MM')
  const tokens = Array.from(tokenMap.keys()).sort(
    (a, b) => b.length - a.length,
  );
  const pattern = new RegExp(tokens.join('|'), 'g');

  // Replace using a function so we never re-scan replaced output and avoid token collisions.
  return format.replace(pattern, (match) => tokenMap.get(match) ?? match);
}

export function getPageDateNote(
  posts: CollectionEntry<'blog'>[],
): string | null {
  if (posts.length === 0) return null;
  const first = new Date(posts.at(-1)!.data.date);
  const last = new Date(posts.at(0)!.data.date);
  return posts.length > 1
    ? `The posts on this page were published between ${formatDate(last, 'MMMM D, YYYY')} and ${formatDate(first, 'MMMM D, YYYY')}.`
    : `This post was published on ${formatDate(first, 'MMMM D, YYYY')}.`;
}
