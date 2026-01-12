// ──────────────────────────────────────────────────────────────────────────────
// Utilities for tag normalisation, listing, and reading.
// - Non-breaking refactor with richer docs, shared option types, stable sorting,
//   and a dev cache reset helper.
// ──────────────────────────────────────────────────────────────────────────────

import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
// ──────────────────────────────────────────────────────────────────────────────
// Imports (@data → @utils → external)
// ──────────────────────────────────────────────────────────────────────────────
import setup from '@data/setup.json' with { type: 'json' };
import type { BlogPost } from '@utils/content.ts';
import { createLogger, refOf } from '@utils/logger.ts';

const log = createLogger({ slug: 'tags' });

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Context for error/debug messages when normalising tags.
 */
type Ctx = {
  file?: string;
  postTitle?: string;
};

/**
 * Canonical tag identifier and human label.
 */
export type NormalizedTag = { id: string; label: string };

export type TagIcon = {
  name: string;
  color?: string;
};

/**
 * Aggregated information about a tag.
 */
export interface TagInfo {
  count: number;
  posts: BlogPost[];
}

/**
 * Sort order for tag listings.
 * - `count-asc/desc`: for equal counts, sorts by label ascending (stable UX).
 * - `label-asc/desc`
 * - `id-asc/desc`
 * - `weight-asc/desc`: numeric weight, default(0) from schema (positive > zero > negative via desc).
 */
export type TagOrder =
  | 'count-asc'
  | 'count-desc'
  | 'label-asc'
  | 'label-desc'
  | 'id-asc'
  | 'id-desc'
  | 'weight-asc'
  | 'weight-desc';

/**
 * Options for listing tags from the facade.
 */
export type GetTagsOptions = {
  /**
   * Minimum occurrences to include a tag (default: setup.tagThreshold ?? 2).
   */
  threshold?: number;

  /**
   * Sorting of result list (default: 'count-desc').
   */
  order?: TagOrder;

  /**
   * Optional max items to return (after sorting).
   */
  limit?: number;

  /**
   * @deprecated Use `order` instead. Kept for backward compatibility.
   * If both are provided, `order` takes precedence.
   */
  sortBy?: 'count' | 'label';
};

/**
 * Lightweight list item for tags (link-list shape).
 */
export type TagListItem = {
  /** Canonical id (slug-like). */
  id: string;
  /** Display label (linktitle from tags collection; falls back to title). */
  label: string;
  /** Optional icon from the tags collection. */
  icon?: TagIcon;
  /** Number of posts containing this tag. */
  count: number;
  /** URL to the tag overview page (always trailing slash). */
  url: string;
  /** Numeric weight from tags collection (default 0). */
  weight: number;
};

/**
 * Shared listing options across featured helpers.
 * Consumers typically only use `order` and `limit`.
 */
export type TagListOrderOptions = {
  /** Sort order across weight/label/id/count; see TagOrder. */
  order?: TagOrder;
  /** Optional max items to return (after sorting). */
  limit?: number;
  /**
   * When ordering by count (only), allow computing counts
   * from the current blog posts collection.
   * Default: true where relevant, else ignored.
   */
  includeCounts?: boolean;
};

/** Public surface preserved: thin wrapper over the shared base for link-list. */
export type GetFeaturedTagsOptions = TagListOrderOptions & {
  /** NOTE: for link-list shape. Default order used here: 'weight-desc'. */
};

/** Public surface preserved: thin wrapper over the shared base for entries. */
export type GetFeaturedTagEntriesOptions = TagListOrderOptions & {
  /** NOTE: for real CollectionEntry<'tags'> items. Default: 'weight-desc'. */
};

// ──────────────────────────────────────────────────────────────────────────────
/**
 * Rich, typed tag format error with context for diagnostics and testing.
 */
export class TagFormatError extends Error {
  /**
   * Error code taxonomy for programmatic handling.
   * - 'NULLISH': input was null/undefined.
   * - 'HASHTAG': input begins with '#'.
   * - 'INVALID_ID': normalised id failed validation.
   */
  public readonly code: 'NULLISH' | 'HASHTAG' | 'INVALID_ID';

  /** Original raw string (if available). */
  public readonly raw?: string;

  /** Optional call-site context. */
  public readonly ctx?: Ctx;

  constructor(
    message: string,
    code: TagFormatError['code'],
    raw?: string,
    ctx?: Ctx,
  ) {
    super(message);
    this.name = 'TagFormatError';
    this.code = code;
    if (raw !== undefined) this.raw = raw;
    if (ctx !== undefined) this.ctx = ctx;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Constants (module-local)
// ──────────────────────────────────────────────────────────────────────────────

const ID_REGEX = /^[a-z0-9_-]+$/;

/** Intentional, minimal transliteration for ASCII slugs. */
const ASCII_MAP: Record<string, string> = {
  ß: 'ss',
  à: 'a',
  á: 'a',
  â: 'a',
  ã: 'a',
  ä: 'ae',
  å: 'a',
  æ: 'ae',
  è: 'e',
  é: 'e',
  ê: 'e',
  ë: 'e',
  ì: 'i',
  í: 'i',
  î: 'i',
  ï: 'i',
  ñ: 'n',
  ò: 'o',
  ó: 'o',
  ô: 'o',
  õ: 'o',
  ö: 'oe',
  ø: 'o',
  ù: 'u',
  ú: 'u',
  û: 'u',
  ü: 'ue',
};

// ──────────────────────────────────────────────────────────────────────────────
// Caching layer (lazy, module-scoped)
// ──────────────────────────────────────────────────────────────────────────────

let blogPostsPromise: Promise<BlogPost[]> | null = null;
type TagIndexEntry = Pick<CollectionEntry<'tags'>, 'id' | 'slug' | 'data'> &
  Partial<CollectionEntry<'tags'>>;

let tagIndexPromise: Promise<Map<string, TagIndexEntry>> | null = null;

/** Cache: all blog posts. */
async function getBlogPosts(): Promise<BlogPost[]> {
  if (!blogPostsPromise) {
    blogPostsPromise = getCollection('blog')
      .then((list) => {
        log.debug('[tags] cached blog posts:', { count: list.length });
        return list;
      })
      .catch((e: unknown) => {
        log.error('[tags] failed to load blog posts', e);
        throw e;
      });
  }
  return blogPostsPromise;
}

/** Cache: id/alias/slug(label) → tag entry (from the 'tags' collection). */
async function getTagIndex(): Promise<Map<string, TagIndexEntry>> {
  if (tagIndexPromise) return tagIndexPromise;

  tagIndexPromise = (async () => {
    const map = new Map<string, TagIndexEntry>();

    const addEntry = (entry: TagIndexEntry) => {
      map.set(entry.data.id, entry);
      if (entry.data.aliases) {
        for (const a of entry.data.aliases) map.set(a, entry); // schema already lowercases
      }
      try {
        const fromLinktitle = normaliseTagUnsafe(entry.data.linktitle);
        if (fromLinktitle) map.set(fromLinktitle, entry);
      } catch (err) {
        log.warn(
          '[tags] failed to normalise tag linktitle',
          { id: entry.id, linktitle: entry.data.linktitle },
          err,
        );
      }

      try {
        const fromTitle = normaliseTagUnsafe(entry.data.title);
        if (fromTitle) map.set(fromTitle, entry);
      } catch (err) {
        log.warn(
          '[tags] failed to normalise tag title',
          { id: entry.id, title: entry.data.title },
          err,
        );
      }
    };

    // 1) special tags with custom content
    const all = await getCollection('tags');
    for (const t of all) addEntry(t);

    // 2) derived tags from blog posts (ensure every tag gets an entry)
    const { byTag } = await collectTags();
    for (const [label] of byTag.entries()) {
      try {
        const id = normaliseTagUnsafe(label);
        if (!map.has(id)) {
          addEntry({
            body: '',
            collection: 'tags',
            data: {
              aliases: [],
              featured: false,
              id,
              linktitle: label,
              title: label,
              weight: 0,
            },
            id,
            slug: id,
          });
        }
      } catch (err) {
        log.warn('[tags] failed to normalise derived tag', { label }, err);
      }
    }

    log.debug('[tags] cached tag index:', { entries: map.size });
    return map;
  })().catch((e: unknown) => {
    log.error('[tags] failed to build tag index', e);
    throw e;
  });

  return tagIndexPromise;
}

/**
 * Return all canonical tag ids for static path generation.
 */
export async function getAllTagIds(): Promise<string[]> {
  const idx = await getTagIndex();
  const ids = new Set<string>();

  for (const entry of idx.values()) {
    ids.add(entry.data.id);
  }

  return Array.from(ids).sort();
}

/**
 * Development helper: clear cached collections so the next call re-fetches.
 * Useful for visual test pages, content edits, or storybook-style tooling.
 */
export function resetTagCaches(): void {
  blogPostsPromise = null;
  tagIndexPromise = null;
  log.info('[tags] caches cleared');
}

// ──────────────────────────────────────────────────────────────────────────────
// Normalisation helpers — split pipeline
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Convert to ASCII-ish form and lowercase. Single-use helper for slugging.
 */
function toAsciiLower(input: string): string {
  const ascii = input
    .split('')
    .map((ch) => ASCII_MAP[ch] ?? ch)
    .join('')
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '');
  return ascii.toLowerCase();
}

/**
 * Build a contextual debug message for logs.
 */
function buildDebugMsg(msg: string, ctx?: Ctx, raw?: string): string {
  const where = ctx?.file ? ` in ${ctx.file}` : '';
  const titled = ctx?.postTitle ? ` [${ctx.postTitle}]` : '';
  const rawPart = raw !== undefined ? ` | raw="${raw}"` : '';
  return `${msg}${where}${titled}${rawPart}`;
}

/**
 * Lowest-level slug normaliser.
 * - Returns canonical id (`a-z0-9_-`) or '' if the cleaned result is empty.
 * - Throws TagFormatError on nullish, hashtag usage, or invalid id.
 *
 * @example normaliseTagUnsafe('Tailwind CSS') -> 'tailwind-css'
 */
export function normaliseTagUnsafe(raw: string, ctx?: Ctx): string {
  if (raw == null) {
    throw new TagFormatError(
      buildDebugMsg('Received undefined/null tag', ctx, String(raw)),
      'NULLISH',
      String(raw),
      ctx,
    );
  }

  const s0 = String(raw).trim();
  if (s0 === '') return '';

  if (s0.startsWith('#')) {
    throw new TagFormatError(
      buildDebugMsg(
        'Tag must not start with "#". Write plain text, UI adds "#".',
        ctx,
        raw,
      ),
      'HASHTAG',
      raw,
      ctx,
    );
  }

  const s1 = toAsciiLower(s0);
  const s2 = s1.replace(/[^a-z0-9 _-]+/g, '');
  const s3 = s2.replace(/\s+/g, '-');
  const id = s3.replace(/-+/g, '-').replace(/^[-_]+|[-_]+$/g, '');

  if (id === '') return '';
  if (!ID_REGEX.test(id)) {
    throw new TagFormatError(
      buildDebugMsg(`Invalid tag id after normalisation: "${id}"`, ctx, raw),
      'INVALID_ID',
      raw,
      ctx,
    );
  }
  return id;
}

/**
 * Safe normaliser that:
 * - converts raw → canonical id using `normaliseTagUnsafe`
 * - returns `null` for empty results
 * - resolves aliases using the 'tags' collection
 */
export async function normaliseTag(
  input: string,
  ctx?: Ctx,
): Promise<NormalizedTag | null> {
  const idGuess = normaliseTagUnsafe(input, ctx);
  if (idGuess === '') return null; // empty → ignore

  const index = await getTagIndex();
  const hit = index.get(idGuess);
  if (hit) return { id: hit.data.id, label: hit.data.linktitle };

  return { id: idGuess, label: input.trim() };
}

/**
 * Normalise and de-duplicate a list of tags.
 */
export async function normaliseTags(
  inputs: readonly string[],
  ctx?: Ctx,
): Promise<NormalizedTag[]> {
  const out: NormalizedTag[] = [];
  const seen = new Set<string>();

  for (const raw of inputs) {
    const t = await normaliseTag(raw, ctx);
    if (!t) continue; // skipped empty
    if (!seen.has(t.id)) {
      seen.add(t.id);
      out.push(t);
    }
  }

  return out;
}

// ──────────────────────────────────────────────────────────────────────────────
/**
 * Unified aggregation — single source of truth.
 * Keys by *authored label* (exact frontmatter), preserving authoring fidelity.
 * If you want case-insensitive aggregation, we can add an opt-in later.
 */
// ──────────────────────────────────────────────────────────────────────────────

type AggregateResult = {
  byTag: Map<string, TagInfo>; // key = label as authored
  counts: Map<string, number>; // key = label as authored
};

async function collectTags(): Promise<AggregateResult> {
  const posts = await getBlogPosts();
  const byTag = new Map<string, TagInfo>();
  const counts = new Map<string, number>();

  for (const post of posts) {
    const tags = Array.isArray(post.data.tags) ? post.data.tags : [];
    for (const tag of tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);

      const current = byTag.get(tag) ?? { count: 0, posts: [] };
      current.count += 1;
      current.posts.push(post);
      byTag.set(tag, current);
    }
  }

  return { byTag, counts };
}

// ──────────────────────────────────────────────────────────────────────────────
// Sorting helpers — stable comparators and utilities
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Compare by numeric weight only (higher first for 'desc', lower first for 'asc').
 * Tie-breakers are applied by caller via sortTagList.
 */
export function cmpWeight(a: TagListItem, b: TagListItem): number {
  return a.weight - b.weight; // caller decides direction via argument order
}

/**
 * Compare two TagListItem by label, case/locale-aware.
 */
export function cmpLabel(a: TagListItem, b: TagListItem): number {
  return a.label.localeCompare(b.label, 'en');
}

/**
 * Compare two TagListItem by id, then label as tiebreaker.
 */
export function cmpId(a: TagListItem, b: TagListItem): number {
  if (a.id !== b.id) return a.id.localeCompare(b.id, 'en');
  return cmpLabel(a, b);
}

/**
 * Compare by count (desc), then label (asc) as tiebreaker.
 * For `count-asc`, invert the primary comparison.
 */
export function cmpCountDescLabelAsc(a: TagListItem, b: TagListItem): number {
  if (b.count !== a.count) return b.count - a.count;
  return cmpLabel(a, b);
}

/**
 * Sort a TagListItem[] in-place by a given order.
 * For weight sorts, apply sensible tie-breakers.
 */
export function sortTagList(
  items: TagListItem[],
  order: TagOrder,
): TagListItem[] {
  switch (order) {
    case 'label-asc':
      return items.sort((a, b) => cmpLabel(a, b));
    case 'label-desc':
      return items.sort((a, b) => -cmpLabel(a, b));
    case 'id-asc':
      return items.sort((a, b) => cmpId(a, b));
    case 'id-desc':
      return items.sort((a, b) => -cmpId(a, b));
    case 'count-asc':
      return items.sort((a, b) => -cmpCountDescLabelAsc(a, b)); // invert
    case 'count-desc':
      return items.sort((a, b) => cmpCountDescLabelAsc(a, b));
    case 'weight-asc':
      return items.sort((a, b) => {
        const w = cmpWeight(a, b); // lower first
        if (w !== 0) return w;
        return cmpLabel(a, b); // tie-break by label asc
      });
    case 'weight-desc':
      return items.sort((a, b) => {
        const w = cmpWeight(b, a); // higher first
        if (w !== 0) return w;
        // If equal weight, prefer higher-count tags, then label asc
        const c = cmpCountDescLabelAsc(a, b);
        if (c !== 0) return c;
        return cmpLabel(a, b);
      });
    default:
      return items;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// Public facade — high-level helpers for UI/components
// Retrieval stays inside utilities
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Build tag page URL (trailing slash guaranteed).
 * Caller must supply a canonical id (not a label).
 */
export function tagUrl(id: string): string {
  return `/tags/${id}/`;
}

/**
 * List tags ready for rendering.
 * - Respects `threshold`.
 * - Sorting via `order` (see TagOrder).
 * - Includes URL for direct linking.
 *
 * @example
 * const tags = await getTags({ order: 'count-desc', threshold: 2 });
 */
export async function getTags(
  options?: GetTagsOptions,
): Promise<TagListItem[]> {
  const threshold = options?.threshold ?? setup.tagThreshold ?? 2;
  const order: TagOrder =
    options?.order ??
    (options?.sortBy === 'label'
      ? 'label-asc'
      : options?.sortBy === 'count'
        ? 'count-desc'
        : 'count-desc');
  const limit = options?.limit;

  const { byTag } = await collectTags();
  const items: TagListItem[] = [];
  const idx = await getTagIndex();

  for (const [label, info] of byTag.entries()) {
    if (info.count < threshold) continue;

    let id = '';
    let finalLabel = label;
    let weight = 0;
    let icon: TagIcon | undefined;

    try {
      const key = normaliseTagUnsafe(label);
      const hit = idx.get(key);
      if (hit) {
        id = hit.data.id;
        finalLabel = hit.data.linktitle;
        weight = (hit.data as { weight?: number }).weight ?? 0;
        icon = (hit.data as { icon?: TagIcon }).icon;
      } else {
        id = key;
        weight = 0;
      }
    } catch (e: unknown) {
      log.warn(
        '[tags] getTags normalisation issue, falling back to slug(label)',
        { label },
        e,
      );
      id = normaliseTagUnsafe(label);
      weight = 0;
    }

    items.push({
      count: info.count,
      id,
      icon,
      label: finalLabel,
      url: tagUrl(id),
      weight,
    });
  }

  sortTagList(items, order);

  return typeof limit === 'number' && Number.isFinite(limit)
    ? items.slice(0, Math.max(0, Math.trunc(limit)))
    : items;
}

/**
 * Read a single tag and its posts using a flexible input (id or free-form).
 * - Normalises input to canonical id (resolving aliases).
 * - Returns canonical label, URL, and matching posts.
 */
export async function getTag(
  input: string,
  ctx?: Ctx,
): Promise<{
  id: string;
  label: string;
  url: string;
  posts: BlogPost[];
}> {
  const normalized = await normaliseTag(input, ctx);
  if (!normalized) {
    throw new TagFormatError(
      buildDebugMsg('Empty tag after normalisation', ctx, input),
      'INVALID_ID',
      input,
      ctx,
    );
  }

  const canonicalId = normalized.id;
  const canonicalLabel = normalized.label;

  const posts = await getBlogPosts();
  const matched: BlogPost[] = [];

  for (const post of posts) {
    const tags = Array.isArray(post.data.tags) ? post.data.tags : [];
    let hasMatch = false;
    for (const rawTag of tags) {
      if (hasMatch) break;
      try {
        const t = await normaliseTag(rawTag);
        if (t && t.id === canonicalId) {
          matched.push(post);
          hasMatch = true;
        }
      } catch (e: unknown) {
        // Keep going; a malformed tag in a post should not stop the listing.
        log.warn(
          '[tags] getTag: skipping malformed tag in post',
          { post: refOf(post), rawTag },
          e,
        );
      }
    }
  }

  return {
    id: canonicalId,
    label: canonicalLabel,
    posts: matched,
    url: tagUrl(canonicalId),
  };
}

/**
 * Return all featured tags from the 'tags' collection.
 * - De-duplicates aliases by canonical id.
 * - Optionally merges post counts via getTags().
 * - Supports ordering and limiting.
 */
export async function getFeaturedTags(
  options?: GetFeaturedTagsOptions,
): Promise<TagListItem[]> {
  const includeCounts = options?.includeCounts ?? true;
  const order = options?.order ?? 'weight-desc'; // default to weight-first
  const limit = options?.limit;

  const idx = await getTagIndex();
  const seen = new Set<string>();
  const items: TagListItem[] = [];

  let countById: Map<string, number> | null = null;
  if (includeCounts) {
    try {
      const all = await getTags({ order: 'count-desc', threshold: 1 });
      countById = new Map(all.map((t) => [t.id, t.count]));
    } catch (e: unknown) {
      log.warn(
        '[tags] getFeaturedTags: failed to compute counts, defaulting to 0',
        e,
      );
      countById = null;
    }
  }

  for (const entry of idx.values()) {
    if (!entry.data.featured) continue;
    const id = entry.data.id;
    if (seen.has(id)) continue;
    seen.add(id);

    const label = entry.data.linktitle;
    const weight = (entry.data as { weight?: number }).weight ?? 0;
    const icon = (entry.data as { icon?: TagIcon }).icon;
    const count = countById?.get(id) ?? 0;

    items.push({ count, id, icon, label, url: tagUrl(id), weight });
  }

  sortTagList(items, order);

  return typeof limit === 'number' && Number.isFinite(limit)
    ? items.slice(0, Math.max(0, Math.trunc(limit)))
    : items;
}

/**
 * Return featured tags as real `CollectionEntry<'tags'>` objects.
 * - Deduplicates aliases by canonical id.
 * - Supports ordering by weight/count/label/id.
 * - If `order` is count-based and `includeCounts` is true (default), we compute counts.
 *
 * Use this when you want to feed entries into components that expect content entries,
 * e.g. `<TagCard post={entry} />`.
 */
export async function getFeaturedTagEntries(
  options?: GetFeaturedTagEntriesOptions,
): Promise<CollectionEntry<'tags'>[]> {
  const order: TagOrder = options?.order ?? 'weight-desc';
  const limit = options?.limit;
  const includeCounts = options?.includeCounts ?? true;

  // 1) Collect unique featured entries by canonical id.
  const all = await getCollection('tags');
  const seen = new Set<string>();
  const entries: CollectionEntry<'tags'>[] = [];
  for (const entry of all) {
    if (!entry.data.featured) continue;
    const id = entry.data.id;
    if (seen.has(id)) continue;
    seen.add(id);
    entries.push(entry);
  }

  // 2) Optional counts for count-* orders.
  let countById: Map<string, number> | null = null;
  if ((order === 'count-asc' || order === 'count-desc') && includeCounts) {
    try {
      const allTagsForCounts = await getTags({
        order: 'count-desc',
        threshold: 1,
      });
      countById = new Map(allTagsForCounts.map((t) => [t.id, t.count]));
    } catch (e: unknown) {
      log.warn(
        '[tags] getFeaturedTagEntries: failed to compute counts for ordering; defaulting to 0',
        e,
      );
      countById = null;
    }
  }

  // 3) Project once to TagListItem for sorting (cheaper + stable).
  const items: TagListItem[] = entries.map((entry) => ({
    count: countById?.get(entry.data.id) ?? 0,
    id: entry.data.id,
    label: entry.data.linktitle,
    url: tagUrl(entry.data.id),
    weight: (entry.data as { weight?: number }).weight ?? 0,
  }));

  // 4) Sort by requested order (centralised comparators).
  sortTagList(items, order);

  // 5) Map back to the original entries; build a tiny index.
  const byId = new Map<string, CollectionEntry<'tags'>>();
  for (const e of entries) byId.set(e.data.id, e);

  const sortedEntries: CollectionEntry<'tags'>[] = [];
  for (const it of items) {
    const e = byId.get(it.id);
    if (e) sortedEntries.push(e);
  }

  return typeof limit === 'number' && Number.isFinite(limit)
    ? sortedEntries.slice(0, Math.max(0, Math.trunc(limit)))
    : sortedEntries;
}

/**
 * Group featured tag entries by their numeric weight.
 * Buckets:
 * - positive: weight > 0
 * - zero:     weight === 0  (default bucket via schema)
 * - negative: weight < 0
 *
 * Useful for "hero / regular / low-priority" layouts on overview pages.
 */
export function groupTagsByWeight(entries: CollectionEntry<'tags'>[]) {
  return {
    negative: entries.filter((t) => t.data.weight < 0),
    positive: entries.filter((t) => t.data.weight > 0),
    zero: entries.filter((t) => t.data.weight === 0),
  };
}

// Validation helper (retained)
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Validate frontmatter tags are written without leading '#'.
 */
export function assertNoHashtagsInFrontmatter(
  tags: readonly string[] | undefined,
): void {
  for (const t of tags ?? []) {
    if (t.trim().startsWith('#')) {
      throw new TagFormatError(
        `Frontmatter tag "${t}" must not start with "#". Write "tailwind css", rendering will add "#".`,
        'HASHTAG',
        t,
      );
    }
  }
}
