// src/utils/content.pure.ts

export interface ContentEntryWithDate {
  readonly data: {
    readonly date: Date;
    readonly draft?: boolean;
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
 * Remove draft entries from a content entry list.
 *
 * @param entries - Content entries with an optional draft flag.
 * @returns Entries where draft is not true.
 */
export function filterDraftEntries<TEntry extends ContentEntryWithDate>(
  entries: readonly TEntry[],
): TEntry[] {
  return entries.filter((entry) => entry.data.draft !== true);
}
