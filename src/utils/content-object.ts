import type { CollectionEntry } from 'astro:content';

import type { CoverData } from './content.ts';

type PlainRecord = Record<string, unknown>;

/**
 * Supported cover metadata on a {@link ContentObject}.
 *
 * The cover may be sourced from markdown frontmatter, an Astro collection, or a
 * manual override. Strings are treated as URLs/paths, `CoverData` comes from
 * `src/utils/content.ts`, and arbitrary objects allow custom shape without
 * losing information.
 *
 * @example
 * ```ts
 * import type { ContentCover } from '@utils/content-object.ts';
 *
 * const hero: ContentCover = '/images/hero.jpg';
 * ```
 */
export type ContentCover = CoverData | string | PlainRecord | null;

/**
 * Normalised representation of heterogeneous content sources.
 *
 * The shape is intentionally strict – every string is trimmed, dates are
 * converted to `Date` instances, tags are deduplicated, and unknown keys are
 * preserved inside {@link ContentObject.meta}. Optional identifiers are only
 * present when discoverable from a source.
 *
 * @example
 * ```ts
 * import { createContentObject } from '@utils/content-object.ts';
 *
 * const content = createContentObject({
 *   title: 'Release Notes',
 *   tags: 'astro, typescript',
 *   date: '2024-05-01',
 * });
 *
 * console.log(content.tags);
 * // -> ['astro', 'typescript']
 * ```
 */
export interface ContentObject {
  id?: string;
  slug?: string;
  collection?: string;
  title: string | null;
  description: string | null;
  summary: string | null;
  content: string | null;
  excerpt: string | null;
  date: Date | null;
  updated: Date | null;
  author: string | string[] | null;
  tags: string[];
  category: string | null;
  cover: ContentCover;
  url?: string;
  readingTime: string | number | null;
  meta: PlainRecord;
}

/**
 * Supported inputs for {@link createContentObject}.
 *
 * This includes raw Astro collection entries and arbitrary records such as
 * frontmatter objects or manual overrides.
 */
export type ContentSource = CollectionEntry<string> | PlainRecord;

const BASE_CONTENT_VALUES: Omit<ContentObject, 'meta' | 'tags'> = {
  author: null,
  category: null,
  content: null,
  cover: null,
  date: null,
  description: null,
  excerpt: null,
  readingTime: null,
  summary: null,
  title: null,
  updated: null,
};

const STRING_TITLE_KEYS = ['title', 'name', 'label', 'heading'] as const;
const STRING_DESCRIPTION_KEYS = [
  'description',
  'summary',
  'excerpt',
  'subtitle',
  'dek',
] as const;
const STRING_SUMMARY_KEYS = ['summary', 'excerpt', 'abstract'] as const;
const STRING_CONTENT_KEYS = ['content', 'body', 'html', 'markdown'] as const;
const STRING_EXCERPT_KEYS = ['excerpt', 'lede'] as const;
const DATE_KEYS = [
  'date',
  'published',
  'publishedAt',
  'publishDate',
  'created',
  'createdAt',
] as const;
const UPDATED_KEYS = [
  'updated',
  'updatedAt',
  'modified',
  'lastModified',
  'lastmod',
  'editedAt',
] as const;
const AUTHOR_KEYS = ['author', 'authors', 'byline', 'creator'] as const;
const TAG_KEYS = ['tags', 'keywords'] as const;
const CATEGORY_KEYS = ['category', 'section', 'topic'] as const;
const COVER_KEYS = [
  'cover',
  'image',
  'hero',
  'heroImage',
  'coverImage',
] as const;
const URL_KEYS = ['url', 'permalink', 'canonical'] as const;
const READING_TIME_KEYS = [
  'readingTime',
  'reading_time',
  'timeToRead',
  'readingMinutes',
] as const;

type NormalizedContentInput = {
  readonly fields: Partial<ContentObject>;
  readonly meta: PlainRecord;
};

/**
 * Create a new {@link ContentObject} populated with safe defaults.
 *
 * The returned instance owns its own `meta` object and `tags` array so callers
 * can mutate them without affecting subsequent calls.
 *
 * @returns A fresh content object skeleton.
 * @example
 * ```ts
 * import { createEmptyContentObject } from '@utils/content-object.ts';
 *
 * const empty = createEmptyContentObject();
 * empty.title = 'Draft';
 * ```
 */
export function createEmptyContentObject(): ContentObject {
  return {
    ...BASE_CONTENT_VALUES,
    meta: {},
    tags: [],
  };
}

/**
 * Merge heterogeneous sources into a single {@link ContentObject}.
 *
 * Sources are processed in order. Later inputs override earlier values while
 * still contributing to derived data such as tags, authors, and metadata.
 * Unknown keys are preserved inside the `meta` object for later inspection.
 *
 * @param sources - Ordered list of collection entries, frontmatter objects, or
 * overrides. `null` and `undefined` inputs are ignored.
 * @returns A normalised content object ready for rendering or indexing.
 * @example
 * ```ts
 * import { createContentObject } from '@utils/content-object.ts';
 *
 * const content = createContentObject(
 *   { title: 'Hello' },
 *   { summary: 'Hi!' },
 * );
 * console.log(content.summary);
 * // -> 'Hi!'
 * ```
 */
export function createContentObject(
  ...sources: Array<ContentSource | null | undefined>
): ContentObject {
  const result = createEmptyContentObject();

  for (const source of sources) {
    if (source == null) continue;

    if (isCollectionEntry(source)) {
      applyNormalized(result, normalizeEntry(source));
      applyNormalized(result, normalizeRecord(source.data));
      continue;
    }

    if (!isRecord(source)) {
      continue;
    }

    const { frontmatter, data, meta, ...rest } = source;

    if (isRecord(frontmatter)) {
      applyNormalized(result, normalizeRecord(frontmatter));
    }

    if (isRecord(data)) {
      applyNormalized(result, normalizeRecord(data));
    }

    if (Object.keys(rest).length > 0) {
      applyNormalized(result, normalizeRecord(rest));
    }

    if (isRecord(meta)) {
      result.meta = {
        ...result.meta,
        ...meta,
      };
    }
  }

  result.tags = Array.from(
    new Set(result.tags.map(trimString).filter(isNonEmptyString)),
  );

  result.author = normalizeAuthor(result.author);

  return result;
}

function applyNormalized(
  target: ContentObject,
  normalized: NormalizedContentInput,
): void {
  for (const [key, value] of Object.entries(normalized.fields) as Array<
    [keyof ContentObject, ContentObject[keyof ContentObject] | undefined]
  >) {
    if (value === undefined) continue;

    if (key === 'tags' && Array.isArray(value)) {
      target.tags.push(...value.map(trimString).filter(isNonEmptyString));
      continue;
    }

    target[key] = value as ContentObject[typeof key];
  }

  target.meta = {
    ...target.meta,
    ...normalized.meta,
  };
}

function normalizeEntry(
  entry: CollectionEntry<string>,
): NormalizedContentInput {
  const base: Partial<ContentObject> = {
    collection: entry.collection,
    id: entry.id,
    slug: isString((entry as { slug?: unknown }).slug)
      ? (entry as { slug?: string }).slug
      : entry.id,
  };

  if (isString((entry as { body?: unknown }).body)) {
    base.content = (entry as { body: string }).body;
  }

  return {
    fields: base,
    meta: {
      collection: entry.collection,
      id: base.id ?? entry.id,
      slug: base.slug,
    },
  };
}

function normalizeRecord(record: PlainRecord): NormalizedContentInput {
  const fields: Partial<ContentObject> = {};

  const id = pickString(record, ['id']);
  if (id !== undefined) fields.id = id;

  const slug = pickString(record, ['slug']);
  if (slug !== undefined) fields.slug = slug;

  const collection = pickString(record, ['collection']);
  if (collection !== undefined) fields.collection = collection;

  const title = pickString(record, STRING_TITLE_KEYS);
  if (title !== undefined) fields.title = title;

  const description = pickString(record, STRING_DESCRIPTION_KEYS);
  if (description !== undefined) fields.description = description;

  const summary = pickString(record, STRING_SUMMARY_KEYS);
  if (summary !== undefined) fields.summary = summary;

  const content = pickString(record, STRING_CONTENT_KEYS);
  if (content !== undefined) fields.content = content;

  const excerpt = pickString(record, STRING_EXCERPT_KEYS);
  if (excerpt !== undefined) fields.excerpt = excerpt;

  const date = pickDate(record, DATE_KEYS);
  if (date !== undefined) fields.date = date;

  const updated = pickDate(record, UPDATED_KEYS);
  if (updated !== undefined) fields.updated = updated;

  const author = pickAuthor(record, AUTHOR_KEYS);
  if (author !== undefined) fields.author = author;

  const tags = pickStringArray(record, TAG_KEYS);
  if (tags.length > 0) fields.tags = tags;

  const category = pickString(record, CATEGORY_KEYS);
  if (category !== undefined) fields.category = category;

  const cover = pickCover(record, COVER_KEYS);
  if (cover !== undefined) fields.cover = cover;

  const url = pickString(record, URL_KEYS);
  if (url !== undefined) fields.url = url;

  const readingTime = pickReadingTime(record, READING_TIME_KEYS);
  if (readingTime !== undefined) fields.readingTime = readingTime;

  return {
    fields,
    meta: { ...record },
  };
}

function pickString(
  record: PlainRecord,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (isString(value)) {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return undefined;
}

function pickDate(
  record: PlainRecord,
  keys: readonly string[],
): Date | undefined {
  for (const key of keys) {
    const value = record[key];
    const parsed = normalizeDate(value);
    if (parsed) return parsed;
  }
  return undefined;
}

function normalizeDate(value: unknown): Date | undefined {
  if (value instanceof Date) {
    return new Date(value);
  }

  if (isString(value) || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return undefined;
}

function pickAuthor(
  record: PlainRecord,
  keys: readonly string[],
): string | string[] | undefined {
  for (const key of keys) {
    const value = record[key];
    if (isString(value)) {
      const trimmed = value.trim();
      if (trimmed.length > 0) return trimmed;
    }

    if (Array.isArray(value)) {
      const authors = value
        .map((item) => {
          if (isString(item)) return item.trim();
          if (isRecord(item)) {
            if (isString(item.name)) return item.name.trim();
            if (isString((item as { fullName?: unknown }).fullName)) {
              return ((item as { fullName?: string }).fullName ?? '').trim();
            }
          }
          return '';
        })
        .filter(isNonEmptyString);

      if (authors.length > 0) return authors;
    }

    if (isRecord(value)) {
      if (isString(value.name)) {
        const trimmed = value.name.trim();
        if (trimmed.length > 0) return trimmed;
      }
      if (isString((value as { fullName?: unknown }).fullName)) {
        const trimmed = (
          (value as { fullName?: string }).fullName ?? ''
        ).trim();
        if (trimmed.length > 0) return trimmed;
      }
    }
  }
  return undefined;
}

function pickStringArray(
  record: PlainRecord,
  keys: readonly string[],
): string[] {
  for (const key of keys) {
    const value = record[key];
    const arr = normalizeStringArray(value);
    if (arr.length > 0) return arr;
  }
  return [];
}

function normalizeStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (isString(item)) return item.trim();
        if (isRecord(item) && isString(item.name)) return item.name.trim();
        return '';
      })
      .filter(isNonEmptyString);
  }

  if (isString(value)) {
    return value.split(',').map(trimString).filter(isNonEmptyString);
  }

  return [];
}

function pickCover(
  record: PlainRecord,
  keys: readonly string[],
): ContentCover | undefined {
  for (const key of keys) {
    if (!Object.hasOwn(record, key)) continue;
    const value = record[key];
    if (value === null) return null;
    if (isString(value)) {
      const trimmed = value.trim();
      if (trimmed.length > 0) return trimmed;
      continue;
    }
    if (isRecord(value)) {
      return value;
    }
  }
  return undefined;
}

function pickReadingTime(
  record: PlainRecord,
  keys: readonly string[],
): string | number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number') {
      if (!Number.isNaN(value)) return value;
    }
    if (isString(value)) {
      const trimmed = value.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return undefined;
}

function isCollectionEntry(value: unknown): value is CollectionEntry<string> {
  return (
    isRecord(value) &&
    isString(value.id) &&
    isString(value.collection) &&
    'data' in value &&
    isRecord((value as { data: unknown }).data)
  );
}

function isRecord(value: unknown): value is PlainRecord {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function trimString(value: string): string {
  return value.trim();
}

function isNonEmptyString(value: string): boolean {
  return value.length > 0;
}

function normalizeAuthor(
  author: ContentObject['author'],
): ContentObject['author'] {
  if (author === null) return null;
  if (Array.isArray(author)) {
    const names = author.map(trimString).filter(isNonEmptyString);
    if (names.length === 0) return null;
    if (names.length === 1) return names[0];
    return names;
  }
  if (isString(author)) {
    const trimmed = author.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
}
