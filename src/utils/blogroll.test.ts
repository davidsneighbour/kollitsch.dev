import { readFile } from 'node:fs/promises';
import { beforeEach, describe, expect, expectTypeOf, it, vi } from 'vitest';

vi.mock('node:fs/promises', () => {
  const mockedReadFile = vi.fn<typeof import('node:fs/promises')['readFile']>();
  return {
    default: { readFile: mockedReadFile },
    readFile: mockedReadFile,
  };
});

import {
  type FeedItem,
  type FeedList,
  formatZodIssues,
  getBlogroll,
  makeFeedItemSchema,
  makeFeedListSchema,
  type SafeFeedListResult,
  safeValidateFeedList,
  validateFeedListOrThrow,
} from '@utils/blogroll';

const readFileMock = vi.mocked(readFile);

beforeEach(() => {
  readFileMock.mockReset();
});

const validFeed: FeedItem = {
  name: 'Example',
  url: 'https://example.com',
};

describe('makeFeedItemSchema', () => {
  it('parses minimal valid items', () => {
    const schema = makeFeedItemSchema();
    const item = schema.parse(validFeed);
    expect(item).toEqual(validFeed);
  });

  it('respects configurable maximum lengths', () => {
    const schema = makeFeedItemSchema({ maxNameLength: 5 });
    expect(() => schema.parse({ ...validFeed, name: 'Too long' })).toThrowError(
      'name must be at most 5 characters',
    );
  });

  it('enforces option typing at compile time', () => {
    // @ts-expect-error - maxNameLength must be a number when provided
    makeFeedItemSchema({ maxNameLength: '12' });
  });
});

describe('makeFeedListSchema', () => {
  it('rejects empty lists when allowEmpty is false', () => {
    const schema = makeFeedListSchema({ allowEmpty: false });
    const result = schema.safeParse([]);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(formatZodIssues(result.error.issues)).toContain(
        'list must not be empty',
      );
    }
  });
});

describe('validateFeedListOrThrow', () => {
  it('returns typed feed lists on success', () => {
    const feeds = validateFeedListOrThrow([validFeed]);
    expect(feeds).toEqual([validFeed]);
    expectTypeOf(feeds).toEqualTypeOf<FeedList>();
  });

  it('throws descriptive errors on invalid payloads', () => {
    const errorPattern = new RegExp(
      '^Validation failed:\\n\\[0\\]\\.name: name is required$',
    );
    expect(() =>
      validateFeedListOrThrow([{ ...validFeed, name: '' }]),
    ).toThrowError(errorPattern);
  });
});

describe('safeValidateFeedList', () => {
  it('collects errors rather than throwing', () => {
    const result: SafeFeedListResult = safeValidateFeedList([
      { name: '', url: 'invalid' },
    ]);
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.errors).toContain('[0].name: name is required');
      expect(result.errors).toContain('[0].url: url must be a valid URL');
    }
  });

  it('returns data on success', () => {
    const result = safeValidateFeedList([validFeed]);
    expect(result).toEqual({ data: [validFeed], ok: true });
  });
});

describe('formatZodIssues', () => {
  it('handles nested paths and root issues', () => {
    const emptyResult = makeFeedListSchema({ allowEmpty: false }).safeParse([]);
    const nestedResult = makeFeedListSchema().safeParse([
      { ...validFeed, name: '' },
    ]);

    expect(emptyResult.success).toBe(false);
    expect(nestedResult.success).toBe(false);

    if (!emptyResult.success && !nestedResult.success) {
      expect(
        formatZodIssues([
          ...emptyResult.error.issues,
          ...nestedResult.error.issues,
        ]),
      ).toEqual(['list must not be empty', '[0].name: name is required']);
    }
  });
});

describe('getBlogroll', () => {
  it('sorts feeds by name while leaving input untouched', async () => {
    const feeds = [
      { name: 'Zeta', url: 'https://z.example.com' },
      { name: 'Alpha', url: 'https://a.example.com' },
    ];
    readFileMock.mockResolvedValueOnce(JSON.stringify(feeds));
    const blogroll = await getBlogroll('feeds.json');

    expect(blogroll).toEqual([
      { name: 'Alpha', url: 'https://a.example.com' },
      { name: 'Zeta', url: 'https://z.example.com' },
    ]);
    expect(feeds[0].name).toBe('Zeta');
    expect(readFileMock).toHaveBeenCalledWith('feeds.json', 'utf8');
  });

  it('wraps JSON parse errors with file path context', async () => {
    readFileMock.mockResolvedValueOnce('{');
    await expect(() => getBlogroll('feeds.json')).rejects.toThrowError(
      'Failed to parse blogroll JSON at feeds.json',
    );
  });

  it('propagates validation errors from the parser', async () => {
    readFileMock.mockResolvedValueOnce(
      JSON.stringify([{ name: '', url: 'invalid' }]),
    );
    await expect(() => getBlogroll('feeds.json')).rejects.toThrowError(
      'Validation failed:',
    );
  });
});
