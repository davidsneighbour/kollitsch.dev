// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  filterDraftEntries,
  shouldShowDrafts,
  sortEntriesByDateDesc,
  stripHtmlTags,
} from './content.pure';

const makeEntry = (date: string, draft?: boolean) => ({
  data: { date: new Date(date), draft },
});

describe('stripHtmlTags', () => {
  it('removes tags and collapses whitespace', () => {
    expect(stripHtmlTags('<p>Hello <b>world</b></p>')).toBe('Hello world');
  });

  it('returns plain strings unchanged', () => {
    expect(stripHtmlTags('plain text')).toBe('plain text');
  });
});

describe('sortEntriesByDateDesc', () => {
  it('sorts newest first', () => {
    const entries = [
      makeEntry('2024-01-01'),
      makeEntry('2025-06-01'),
      makeEntry('2023-03-15'),
    ];
    const sorted = sortEntriesByDateDesc(entries);
    expect(sorted[0]!.data.date.getFullYear()).toBe(2025);
    expect(sorted[2]!.data.date.getFullYear()).toBe(2023);
  });

  it('does not mutate the original array', () => {
    const entries = [makeEntry('2024-01-01'), makeEntry('2025-06-01')];
    const original = [...entries];
    sortEntriesByDateDesc(entries);
    expect(entries).toEqual(original);
  });
});

describe('shouldShowDrafts', () => {
  it('returns true in test/dev mode (import.meta.env.DEV is true in vitest)', () => {
    expect(shouldShowDrafts()).toBe(true);
  });
});

describe('filterDraftEntries', () => {
  const published = makeEntry('2025-01-01');
  const draft = makeEntry('2025-02-01', true);
  const explicitNonDraft = makeEntry('2025-03-01', false);

  it('includes all entries in dev/test mode (drafts visible)', () => {
    const result = filterDraftEntries([published, draft, explicitNonDraft]);
    expect(result).toHaveLength(3);
  });

  it('does not mutate the input array', () => {
    const entries = [published, draft] as const;
    const result = filterDraftEntries(entries);
    expect(result).not.toBe(entries);
  });

  it('includes entries without a draft field', () => {
    const noField = makeEntry('2025-04-01');
    const result = filterDraftEntries([noField]);
    expect(result).toHaveLength(1);
  });
});
