// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  downlevelH2,
  filterByMinorGroup,
  filterByYear,
  findByTag,
  getMinorGroup,
  getMinorGroups,
  getMinorGroupTag,
  getReleasesPerPage,
  getYears,
  isMinorGroupTag,
  isSemverTag,
  normalizeRelease,
  paginate,
  type Release,
} from './releases.ts';

describe('isSemverTag', () => {
  it('matches vX.Y.Z tags', () => {
    expect(isSemverTag('v1.2.3')).toBe(true);
  });

  it('rejects non-semver strings', () => {
    expect(isSemverTag('v1.2')).toBe(false);
    expect(isSemverTag('1.2.3')).toBe(false);
    expect(isSemverTag('vX.Y.Z')).toBe(false);
  });
});

describe('isMinorGroupTag', () => {
  it('matches vX.Y tags', () => {
    expect(isMinorGroupTag('v1.2')).toBe(true);
  });

  it('rejects full semver or malformed tags', () => {
    expect(isMinorGroupTag('v1.2.3')).toBe(false);
    expect(isMinorGroupTag('v1')).toBe(false);
  });
});

describe('getMinorGroup / getMinorGroupTag', () => {
  it('derives the major.minor group from a full semver tag', () => {
    expect(getMinorGroup('v2.5.1')).toEqual({
      major: 2,
      minor: 5,
      tag: 'v2.5',
    });
    expect(getMinorGroupTag('v2.5.1')).toBe('v2.5');
  });

  it('returns null for a non-semver tag', () => {
    expect(getMinorGroup('not-a-tag')).toBeNull();
    expect(getMinorGroupTag('not-a-tag')).toBeNull();
  });
});

describe('downlevelH2', () => {
  it('rewrites h2 tags to h3, case-insensitively', () => {
    expect(downlevelH2('<H2>Title</H2><p>body</p>')).toBe(
      '<h3>Title</h3><p>body</p>',
    );
  });

  it('leaves content without h2 tags unchanged', () => {
    expect(downlevelH2('<p>no headings</p>')).toBe('<p>no headings</p>');
  });
});

describe('normalizeRelease', () => {
  it('normalizes a valid raw release', () => {
    const release = normalizeRelease({
      descriptionHTML: '<h2>Notes</h2>',
      name: 'v1.2.3',
      publishedAt: '2024-05-01T00:00:00Z',
      tagName: 'v1.2.3',
    });
    expect(release).toEqual({
      descriptionHTML: '<h3>Notes</h3>',
      name: 'v1.2.3',
      publishedAt: '2024-05-01T00:00:00.000Z',
      tag: 'v1.2.3',
      year: 2024,
    });
  });

  it('falls back to name when tagName is missing', () => {
    const release = normalizeRelease({
      descriptionHTML: '',
      name: 'v3.0.0',
      publishedAt: '2024-01-01T00:00:00Z',
    });
    expect(release?.tag).toBe('v3.0.0');
  });

  it('returns null when the tag is not valid semver', () => {
    expect(
      normalizeRelease({
        descriptionHTML: '',
        name: 'not-semver',
        publishedAt: '2024-01-01T00:00:00Z',
        tagName: 'not-semver',
      }),
    ).toBeNull();
  });

  it('returns null when publishedAt is missing or invalid', () => {
    expect(
      normalizeRelease({
        descriptionHTML: '',
        name: 'v1.0.0',
        publishedAt: 'not-a-date',
        tagName: 'v1.0.0',
      }),
    ).toBeNull();
  });
});

const release = (overrides: Partial<Release> = {}): Release => ({
  descriptionHTML: '',
  name: 'v1.0.0',
  publishedAt: '2024-01-01T00:00:00.000Z',
  tag: 'v1.0.0',
  year: 2024,
  ...overrides,
});

describe('getYears', () => {
  it('returns distinct years sorted descending', () => {
    const releases = [
      release({ year: 2022 }),
      release({ year: 2024 }),
      release({ year: 2023 }),
      release({ year: 2024 }),
    ];
    expect(getYears(releases)).toEqual([2024, 2023, 2022]);
  });
});

describe('filterByYear', () => {
  it('keeps only releases matching the given year', () => {
    const releases = [release({ year: 2023 }), release({ year: 2024 })];
    expect(filterByYear(releases, 2024)).toEqual([release({ year: 2024 })]);
  });
});

describe('findByTag', () => {
  it('finds a release by exact tag', () => {
    const releases = [release({ tag: 'v1.0.0' }), release({ tag: 'v2.0.0' })];
    expect(findByTag(releases, 'v2.0.0')?.tag).toBe('v2.0.0');
  });

  it('returns null when no release matches', () => {
    const releases = [release({ tag: 'v1.0.0' })];
    expect(findByTag(releases, 'v9.9.9')).toBeNull();
  });
});

describe('getMinorGroups', () => {
  it('returns unique minor-group tags in first-seen order', () => {
    const releases = [
      release({ tag: 'v1.2.0' }),
      release({ tag: 'v1.2.1' }),
      release({ tag: 'v1.3.0' }),
    ];
    expect(getMinorGroups(releases)).toEqual(['v1.2', 'v1.3']);
  });
});

describe('filterByMinorGroup', () => {
  it('returns releases within a valid minor group', () => {
    const releases = [
      release({ tag: 'v1.2.0' }),
      release({ tag: 'v1.2.1' }),
      release({ tag: 'v1.3.0' }),
    ];
    expect(filterByMinorGroup(releases, 'v1.2').map((r) => r.tag)).toEqual([
      'v1.2.0',
      'v1.2.1',
    ]);
  });

  it('returns an empty array for an invalid group string', () => {
    const releases = [release({ tag: 'v1.2.0' })];
    expect(filterByMinorGroup(releases, 'not-a-group')).toEqual([]);
  });
});

describe('paginate', () => {
  it('slices items for the requested page', () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const slice = paginate(items, 2, 10);
    expect(slice.items).toEqual(items.slice(10, 20));
    expect(slice).toMatchObject({
      page: 2,
      perPage: 10,
      totalItems: 25,
      totalPages: 3,
    });
  });

  it('clamps a page below 1 up to page 1', () => {
    expect(paginate([1, 2, 3], 0, 10).page).toBe(1);
  });

  it('clamps a page beyond the last page down to totalPages', () => {
    expect(paginate([1, 2, 3], 99, 10).page).toBe(1);
  });

  it('always reports at least 1 total page, even for an empty list', () => {
    const slice = paginate([], 1, 10);
    expect(slice.totalPages).toBe(1);
    expect(slice.items).toEqual([]);
  });
});

describe('getReleasesPerPage', () => {
  it('returns a positive integer configured in setup.json, or the default', () => {
    const n = getReleasesPerPage(42);
    expect(Number.isInteger(n)).toBe(true);
    expect(n).toBeGreaterThanOrEqual(1);
  });

  it('falls back to the provided default when called with no config guarantees', () => {
    expect(getReleasesPerPage()).toBeGreaterThanOrEqual(1);
  });
});
