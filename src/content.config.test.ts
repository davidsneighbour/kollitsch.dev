// @vitest-environment node

import { describe, expect, it } from 'vitest';
import { blogCollectionSchema, blogSchema, tagSchema } from './content.config';

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
        video: { youtube: 'aFfW0DCoGBg' },
      },
    });
    expect(result.success).toBe(true);
  });

  it('accepts a valid Vimeo video cover', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      cover: {
        type: 'video',
        video: { vimeo: '1094958124' },
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects video covers without a provider id', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      cover: {
        type: 'video',
        video: {},
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
          vimeo: '1094958124',
          youtube: 'aFfW0DCoGBg',
        },
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects the retired cover.video.title key', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      cover: {
        type: 'video',
        video: { title: 'Video title', youtube: 'aFfW0DCoGBg' },
      },
    });
    expect(result.success).toBe(false);
  });

  it('rejects unknown keys on cover.video', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      cover: {
        type: 'video',
        video: { class: 'scale-2', youtube: 'aFfW0DCoGBg' },
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

describe('blogSchema maintenance', () => {
  it('accepts a broken-link review date in YYYY-MM-DD format', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      maintenance: {
        brokenLinksReviewed: '2026-09-14',
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.maintenance?.brokenLinksReviewed).toBe('2026-09-14');
    }
  });

  it('normalises a parsed frontmatter date to YYYY-MM-DD format', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      maintenance: {
        brokenLinksReviewed: new Date('2026-09-14T00:00:00.000Z'),
      },
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.maintenance?.brokenLinksReviewed).toBe('2026-09-14');
    }
  });

  it('rejects a broken-link review date in another format', () => {
    const result = blogSchema.safeParse({
      ...baseFrontmatter,
      maintenance: {
        brokenLinksReviewed: '14-09-2026',
      },
    });

    expect(result.success).toBe(false);
  });
});

// Unknown icon names in content must fail at content validation
// (`astro sync`/`astro check`), not when a page renders (#2050).
describe('content icon names', () => {
  const tag = { id: 'lab-notes', title: 'Lab Notes' };
  const issueMessages = (result: { success: boolean; error?: { issues: { message: string }[] } }) =>
    result.error?.issues.map((issue) => issue.message) ?? [];

  it('accepts registered tag icons as a string or an object', () => {
    expect(tagSchema.safeParse({ ...tag, icon: 'lucide:notebook-pen' }).success).toBe(true);
    expect(
      tagSchema.safeParse({ ...tag, icon: { name: 'simple-icons:github' } }).success,
    ).toBe(true);
  });

  it('rejects an unregistered tag icon with a message that names the registry', () => {
    const result = tagSchema.safeParse({ ...tag, icon: 'lucide:does-not-exist' });
    expect(result.success).toBe(false);
    expect(issueMessages(result).join(' ')).toContain('src/utils/icon-names.ts');
  });

  it('rejects an unregistered tag badge icon', () => {
    const result = tagSchema.safeParse({
      ...tag,
      badge: { icon: { name: 'lucide:does-not-exist' } },
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['badge', 'icon', 'name']);
  });

  it('checks sourcecode icons in the blog collection schema only', () => {
    const post = {
      ...baseFrontmatter,
      sourcecode: {
        repo: { icon: 'simple-icons:gitlab', source: 'https://example.com/repo' },
      },
    };
    // The Node-safe schema keeps free text; the collection schema checks it.
    expect(blogSchema.safeParse(post).success).toBe(true);
    const result = blogCollectionSchema.safeParse(post);
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(['sourcecode', 'repo', 'icon']);

    const registered = {
      ...post,
      sourcecode: { repo: { icon: 'simple-icons:github', source: 'https://example.com/repo' } },
    };
    expect(blogCollectionSchema.safeParse(registered).success).toBe(true);
  });
});
