// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { blogSchema } from './content.config';

const baseFrontmatter = {
  date: '2025-01-01',
  description: 'A description',
  title: 'A title',
};

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
