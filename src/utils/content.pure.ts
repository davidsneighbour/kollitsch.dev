// src/utils/content.pure.ts

export interface ContentEntryWithDate {
  readonly data: {
    readonly date: Date;
    readonly draft?: boolean | undefined;
  };
}

export const stripHtmlTags = (value: string): string =>
  value
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Sort content entries by date, newest first.
 *
 * @param entries - Content entries with a date field.
 * @returns A new sorted array.
 */
export function sortEntriesByDateDesc<TEntry extends ContentEntryWithDate>(
  entries: readonly TEntry[],
): TEntry[] {
  return [...entries].sort((left, right) => {
    return right.data.date.getTime() - left.data.date.getTime();
  });
}

/**
 * Returns true when draft posts should be visible.
 *
 * `npx astro dev`   → DEV=true  → drafts shown everywhere
 * `npx astro build` → DEV=false → drafts hidden everywhere
 *
 * This is the single source of truth for draft visibility.
 * All collection queries that need to respect drafts MUST go through
 * filterDraftEntries() rather than inlining `!data.draft`.
 */
export function shouldShowDrafts(): boolean {
  return import.meta.env.DEV === true;
}

/**
 * Filter draft entries based on the current environment.
 *
 * In dev mode (shouldShowDrafts() === true) all entries are returned unchanged.
 * In production (shouldShowDrafts() === false) entries with draft: true are removed.
 *
 * The constraint uses `boolean | undefined` explicitly so the function
 * is compatible with exactOptionalPropertyTypes: Zod infers draft as
 * `boolean | undefined` on CollectionEntry, not the narrower `?: boolean`.
 *
 * @param entries - Content entries with an optional draft flag.
 * @returns Entries appropriate for the current environment.
 */
export function filterDraftEntries<
  TEntry extends { data: { draft?: boolean | undefined } },
>(entries: readonly TEntry[]): TEntry[] {
  if (shouldShowDrafts()) return [...entries];
  return entries.filter((entry) => entry.data.draft !== true);
}
