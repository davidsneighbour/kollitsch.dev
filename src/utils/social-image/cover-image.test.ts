// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  backgroundImageCandidates,
  resolveCoverImageKey,
} from './cover-image.ts';

describe('resolveCoverImageKey', () => {
  it('returns "" when the post has no content identity', () => {
    const resolved = resolveCoverImageKey(
      { collection: '', cover: { src: 'cover.jpg' }, id: '' },
      () => true,
      '/src/assets/images/default.jpg',
      '/src/assets/images/og.jpg',
    );
    expect(resolved).toBe('');
  });

  it('resolves an image cover relative to the content entry', () => {
    const exists = (k: string) => k === '/src/content/blog/2026/slug/cover.jpg';
    const resolved = resolveCoverImageKey(
      {
        collection: 'blog',
        cover: { src: 'cover.jpg', type: 'image' },
        id: '2026/slug',
      },
      exists,
      '/src/assets/images/default.jpg',
      '/src/assets/images/og.jpg',
    );
    expect(resolved).toBe('/src/content/blog/2026/slug/cover.jpg');
  });

  it('ignores a video cover (no image src to resolve)', () => {
    const resolved = resolveCoverImageKey(
      {
        collection: 'blog',
        cover: { type: 'video' },
        id: '2026/slug',
      },
      () => false,
      '/src/assets/images/default.jpg',
      '/src/assets/images/og.jpg',
    );
    expect(resolved).toBe('/src/assets/images/default.jpg');
  });

  it('falls back to the default article image when the cover does not resolve', () => {
    const resolved = resolveCoverImageKey(
      { collection: 'blog', cover: undefined, id: '2026/slug' },
      () => false,
      '/src/assets/images/default.jpg',
      '/src/assets/images/og.jpg',
    );
    expect(resolved).toBe('/src/assets/images/default.jpg');
  });
});

describe('backgroundImageCandidates', () => {
  it('deduplicates and drops empty candidates, preserving order', () => {
    expect(backgroundImageCandidates('/a.jpg', '/a.jpg', '/b.jpg')).toEqual([
      '/a.jpg',
      '/b.jpg',
    ]);
  });

  it('drops empty-string candidates', () => {
    expect(backgroundImageCandidates('', '/a.jpg', '')).toEqual(['/a.jpg']);
  });

  it('returns an empty array when every candidate is empty', () => {
    expect(backgroundImageCandidates('', '', '')).toEqual([]);
  });
});
