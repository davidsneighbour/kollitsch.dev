import type { CollectionEntry } from 'astro:content';

import type { CoverData } from './content.ts';

export type ContentCover = CoverData | string | Record<string, unknown> | null;

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
  url: string | null;
  readingTime: string | number | null;
  meta: Record<string, unknown>;
  [key: string]: unknown;
}

export type ContentSource = CollectionEntry<string> | Record<string, unknown>;

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

interface NormalizedContentInput {
  fields: Partial<ContentObject>;
  meta: Record<string, unknown>;
}

const BASE_CONTENT_OBJECT: ContentObject = {
  author: null,
  category: null,
  collection: undefined,
  content: null,
  cover: null,
  date: null,
  description: null,
  excerpt: null,
  id: undefined,
  meta: {},
  readingTime: null,
  slug: undefined,
  summary: null,
  tags: [],
  title: null,
  updated: null,
  url: null,
};

export function createEmptyContentObject(): ContentObject {
  return {
    ...BASE_CONTENT_OBJECT,
    meta: { ...BASE_CONTENT_OBJECT.meta },
    tags: [...BASE_CONTENT_OBJECT.tags],
  };
}

export function createContentObject(
  ...sources: Array<ContentSource | null | undefined>
): ContentObject {
  const result = createEmptyContentObject();

  for (const source of sources) {
    if (!source) continue;

    if (isCollectionEntry(source)) {
      applyNormalized(result, normalizeEntry(source));
      if (isRecord(source.data)) {
        applyNormalized(result, normalizeRecord(source.data));
      }
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
    new Set(
      result.tags.map((tag) => tag.trim()).filter((tag) => tag.length > 0),
    ),
  );

  if (Array.isArray(result.author)) {
    const authors = result.author
      .map((name) => (typeof name === 'string' ? name.trim() : ''))
      .filter((name) => name.length > 0);

    if (authors.length === 0) {
      result.author = null;
    } else if (authors.length === 1) {
      result.author = authors[0];
    } else {
      result.author = authors;
    }
  } else if (typeof result.author === 'string') {
    const trimmed = result.author.trim();
    result.author = trimmed.length > 0 ? trimmed : null;
  }

  return result;
}

function applyNormalized(
  target: ContentObject,
  normalized: NormalizedContentInput,
): void {
  for (const [key, value] of Object.entries(normalized.fields)) {
    if (value === undefined) continue;

    const typedKey = key as keyof ContentObject;

    if (typedKey === 'tags') {
      if (Array.isArray(value)) {
        target.tags.push(
          ...value
            .map((tag) => (typeof tag === 'string' ? tag : String(tag)))
            .filter((tag) => tag.length > 0),
        );
      }
      continue;
    }

    if (typedKey === 'meta') {
      if (isRecord(value)) {
        target.meta = {
          ...target.meta,
          ...value,
        };
      }
      continue;
    }

    (target as Record<string, unknown>)[typedKey as string] = value as unknown;
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
    slug:
      'slug' in entry && typeof entry.slug === 'string' ? entry.slug : entry.id,
  };

  if (typeof (entry as { body?: unknown }).body === 'string') {
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

function normalizeRecord(
  record: Record<string, unknown>,
): NormalizedContentInput {
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
  record: Record<string, unknown>,
  keys: readonly string[],
): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0) {
        return trimmed;
      }
    }
  }
  return undefined;
}

function pickDate(
  record: Record<string, unknown>,
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

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return undefined;
}

function pickAuthor(
  record: Record<string, unknown>,
  keys: readonly string[],
): string | string[] | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0) return trimmed;
    }

    if (Array.isArray(value)) {
      const authors = value
        .map((item) => {
          if (typeof item === 'string') return item.trim();
          if (isRecord(item)) {
            if (typeof item.name === 'string') return item.name.trim();
            if (typeof item.fullName === 'string') return item.fullName.trim();
          }
          return '';
        })
        .filter((name) => name.length > 0);

      if (authors.length > 0) return authors;
    }

    if (isRecord(value)) {
      if (typeof value.name === 'string') {
        const trimmed = value.name.trim();
        if (trimmed.length > 0) return trimmed;
      }
      if (typeof value.fullName === 'string') {
        const trimmed = value.fullName.trim();
        if (trimmed.length > 0) return trimmed;
      }
    }
  }
  return undefined;
}

function pickStringArray(
  record: Record<string, unknown>,
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
        if (typeof item === 'string') return item.trim();
        if (isRecord(item) && typeof item.name === 'string')
          return item.name.trim();
        return '';
      })
      .filter((item) => item.length > 0);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  return [];
}

function pickCover(
  record: Record<string, unknown>,
  keys: readonly string[],
): ContentCover | undefined {
  for (const key of keys) {
    if (!(key in record)) continue;
    const value = record[key];
    if (value === null) return null;
    if (typeof value === 'string') {
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
  record: Record<string, unknown>,
  keys: readonly string[],
): string | number | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number') {
      if (!Number.isNaN(value)) return value;
    }
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed.length > 0) return trimmed;
    }
  }
  return undefined;
}

function isCollectionEntry(value: unknown): value is CollectionEntry<string> {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.collection === 'string' &&
    'data' in value &&
    isRecord((value as { data: unknown }).data)
  );
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
