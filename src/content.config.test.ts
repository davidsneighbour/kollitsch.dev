// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { blogSchema } from './content.config';

const baseFrontmatter = {
  date: '2025-01-01',
  description: 'A description',
  title: 'A title',
};

describe('blogSchema cover.video', () => {
  it('accepts a valid video cover', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      cover: {
        type: 'video',
        video: { title: 'Video title', youtube: 'aFfW0DCoGBg' },
      },
    });
    expect(result.success).toBe(true);
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
