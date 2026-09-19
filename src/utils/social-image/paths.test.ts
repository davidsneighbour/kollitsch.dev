// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  getBlogSocialImageFsPath,
  getBlogSocialImagePath,
  getDefaultSocialImageFsPath,
  getDefaultSocialImagePath,
  parseBlogPostId,
} from './paths.ts';

describe('parseBlogPostId', () => {
  it('parses a plain year/slug id', () => {
    expect(parseBlogPostId('2026/example-post')).toEqual({
      slug: 'example-post',
      year: '2026',
    });
  });

  it('strips a trailing /index segment', () => {
    expect(parseBlogPostId('2026/example-post/index')).toEqual({
      slug: 'example-post',
      year: '2026',
    });
  });

  it('strips a .md/.mdx extension', () => {
    expect(parseBlogPostId('2026/example-post.md')).toEqual({
      slug: 'example-post',
      year: '2026',
    });
    expect(parseBlogPostId('2026/example-post.mdx')).toEqual({
      slug: 'example-post',
      year: '2026',
    });
  });

  it('strips leading/trailing slashes', () => {
    expect(parseBlogPostId('/2026/example-post/')).toEqual({
      slug: 'example-post',
      year: '2026',
    });
  });

  it('returns undefined for ids without a 4-digit year prefix', () => {
    expect(parseBlogPostId('example-post')).toBeUndefined();
    expect(parseBlogPostId('26/example-post')).toBeUndefined();
  });

  it('returns undefined for ids with extra path segments', () => {
    expect(parseBlogPostId('2026/nested/example-post')).toBeUndefined();
  });
});

describe('getBlogSocialImagePath', () => {
  it('maps a blog id to its deterministic public URL', () => {
    expect(getBlogSocialImagePath('2026/example-post')).toBe(
      '/images/social/blog/2026/example-post.jpg',
    );
  });

  it('returns undefined for an id with no year/slug shape', () => {
    expect(getBlogSocialImagePath('not-a-valid-id')).toBeUndefined();
  });
});

describe('getBlogSocialImageFsPath', () => {
  it('maps a blog id to its deterministic filesystem path', () => {
    expect(getBlogSocialImageFsPath('2026/example-post')).toBe(
      'public/images/social/blog/2026/example-post.jpg',
    );
  });

  it('returns undefined for an id with no year/slug shape', () => {
    expect(getBlogSocialImageFsPath('not-a-valid-id')).toBeUndefined();
  });
});

describe('getDefaultSocialImagePath / getDefaultSocialImageFsPath', () => {
  it('returns the fixed default public URL and filesystem path', () => {
    expect(getDefaultSocialImagePath()).toBe('/images/social/default.jpg');
    expect(getDefaultSocialImageFsPath()).toBe(
      'public/images/social/default.jpg',
    );
  });
});
