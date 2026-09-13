// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { blogSchema } from './content.config';

const baseFrontmatter = {
  date: '2025-01-01',
  description: 'A description',
  fmContentType: 'article',
  title: 'A title',
};

describe('blogSchema fmContentType', () => {
  it('requires article frontmatter', () => {
    const { fmContentType: _fmContentType, ...withoutContentType } =
      baseFrontmatter;

    expect(blogSchema.safeParse(baseFrontmatter).success).toBe(true);
    expect(blogSchema.safeParse(withoutContentType).success).toBe(false);
    expect(
      blogSchema.safeParse({ ...baseFrontmatter, fmContentType: 'note' })
        .success,
    ).toBe(false);
  });
});

describe('blogSchema cover.video', () => {
  it('accepts a valid YouTube video cover', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      cover: {
        type: 'video',
        video: { title: 'Video title', youtube: 'aFfW0DCoGBg' },
      },
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid Vimeo video cover', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      cover: {
        type: 'video',
        video: { title: 'Video title', vimeo: '1094958124' },
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects video covers without a provider id', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      cover: {
        type: 'video',
        video: { title: 'Video title' },
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects video covers with multiple provider ids', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      cover: {
        type: 'video',
        video: {
          title: 'Video title',
          vimeo: '1094958124',
          youtube: 'aFfW0DCoGBg',
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown keys on cover.video', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      cover: {
        type: 'video',
        video: { class: 'scale-2', title: 'Video title', youtube: 'aFfW0DCoGBg' },
      },
    });
    expect(result.success).toBe(false);
  });
});

describe('blogSchema aliases', () => {
  it('normalises a string alias to an array', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      aliases: 'old-post',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.aliases).toEqual(['old-post']);
    }
  });

  it('accepts an array of aliases', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      aliases: ['old-post', '/legacy/old-post'],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.aliases).toEqual(['old-post', '/legacy/old-post']);
    }
  });
});

describe('blogSchema origin', () => {
  const mastodonOrigin = {
    type: 'mastodon',
    id: '111111111111111111',
    uri: 'https://mas.to/users/davidsneighbour/statuses/111111111111111111',
    url: 'https://mas.to/@davidsneighbour/111111111111111111',
    account: '@davidsneighbour@mas.to',
    published: '2026-09-12T10:42:00.000Z',
    imported: '2026-09-12T11:00:00.000Z',
  };

  it('is optional', () => {
    const result = blogSchema.safeParse(baseFrontmatter);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.origin).toBeUndefined();
    }
  });

  it('accepts a complete Mastodon origin', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      origin: mastodonOrigin,
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.origin?.type).toBe('mastodon');
      expect(result.data.origin?.published).toEqual(
        new Date(mastodonOrigin.published),
      );
    }
  });

  it('rejects an origin missing required fields', () => {
    const { url: _url, ...withoutUrl } = mastodonOrigin;
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      origin: withoutUrl,
    });
    expect(result.success).toBe(false);
  });

  it('rejects an unknown origin type', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      origin: { ...mastodonOrigin, type: 'bluesky' },
    });
    expect(result.success).toBe(false);
  });
});
