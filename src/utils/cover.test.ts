// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

/**
 * Tests for resolveCover.
 *
 * These tests mock:
 * - @utils/image-index.ts -> getIndexedImage
 * - @utils/opengraph.ts -> resolveImageKey
 * - markdown-it (constructor) -> mocked renderInline
 *
 * stripMarkup is no longer mocked — it's now exercised via the SUT (in `cover.ts`).
 *
 * Each test calls `vi.resetModules()` and `vi.doMock()` to ensure mocked behavior
 * is applied before the tested module is imported.
 */

const DEFAULT_INDEXED_META = { height: 600, width: 800 };

const makeImageIndexMock = (present: boolean) => {
  return {
    getIndexedImage: (src: string) =>
      present ? { meta: DEFAULT_INDEXED_META } : undefined,
  };
};

const defaultResolveImageKey = (
  key: unknown,
  _id: string,
  _collection: string,
  opts?: { defaultKey?: string; assetsDir?: string },
) => {
  // if no key -> fallback to defaultKey under /src/assets/images
  if (!key) {
    const dk = opts?.defaultKey ?? 'default.jpg';
    return `/src/assets/images/${dk}`;
  }
  const k = String(key);
  if (k.startsWith('http://') || k.startsWith('https://')) return k;
  if (k.startsWith('/src/')) return k;
  // treat as local key
  return `/src/assets/images/${k}`;
};

describe('resolveCover', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    // suppress noisy console output emitted by the SUT (e.g. debug/error paths)
    vi.spyOn(console, 'error').mockImplementation(() => void 0);
    vi.spyOn(console, 'debug').mockImplementation(() => void 0);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('falls back when no cover (uses defaultKey and indexed meta)', async () => {
    // image indexed present
    vi.doMock('@utils/image-index.ts', () => makeImageIndexMock(true));
    vi.doMock('@utils/opengraph.ts', () => ({
      resolveImageKey: defaultResolveImageKey,
    }));
    // default MarkdownIt behavior ok — return as ESM default export
    vi.doMock('markdown-it', () => ({
      default: function MockMD() {
        return { renderInline: (s: string) => `<p>${s}</p>` };
      },
    }));

    const { resolveCover } = await import('./cover.ts');

    const ctx = { collection: 'blog', id: 'blog/post-1' } as const;
    const res = resolveCover(undefined, ctx, {
      debug: false,
      defaultKey: 'fallback.jpg',
    });

    expect(res.type).toBe('image');
    if (res.type === 'image') {
      expect(res.src).toBe('/src/assets/images/fallback.jpg');
      expect(res.alt).toBe('Image'); // default fallbackAlt
      expect(res.meta).toEqual(DEFAULT_INDEXED_META);
    }
  });

  it('string cover resolves remote url and has no meta', async () => {
    vi.doMock('@utils/image-index.ts', () => makeImageIndexMock(false));
    vi.doMock('@utils/opengraph.ts', () => ({
      resolveImageKey: defaultResolveImageKey,
    }));
    vi.doMock('markdown-it', () => ({
      default: function MockMD() {
        return { renderInline: (s: string) => `<p>${s}</p>` };
      },
    }));

    const { resolveCover } = await import('./cover.ts');

    const ctx = { collection: 'blog', id: 'blog/post-2' } as const;
    const remote = 'https://cdn.example.com/cover.jpg';
    const res = resolveCover(remote, ctx, {});

    expect(res.type).toBe('image');
    if (res.type === 'image') {
      expect(res.src).toBe(remote);
      expect(res.meta).toBeUndefined();
    }
  });

  it('video cover returns video object with alt derived from title', async () => {
    vi.doMock('@utils/image-index.ts', () => makeImageIndexMock(false));
    vi.doMock('@utils/opengraph.ts', () => ({
      resolveImageKey: defaultResolveImageKey,
    }));
    vi.doMock('markdown-it', () => ({
      default: function MockMD() {
        return { renderInline: (s: string) => `<p>${s}</p>` };
      },
    }));

    const { resolveCover } = await import('./cover.ts');

    const ctx = { collection: 'blog', id: 'blog/post-3' } as const;
    const cover = {
      type: 'video',
      video: { artist: 'Artist', title: 'My Video', youtube: 'abcd123' },
    } as const;

    const res = resolveCover(cover, ctx, {});
    expect(res.type).toBe('video');
    if (res.type === 'video') {
      expect(res.video.title).toBe('My Video');
      expect(res.video.youtube).toBe('abcd123');
      expect(res.alt).toBe('My Video');
    }
  });

  it('image cover with title uses rendered HTML from MarkdownIt', async () => {
    // Mock MarkdownIt to return a formatted inline title
    vi.doMock('@utils/image-index.ts', () => makeImageIndexMock(true));
    vi.doMock('@utils/opengraph.ts', () => ({
      resolveImageKey: defaultResolveImageKey,
    }));
    vi.doMock('markdown-it', () => ({
      default: function MockMD() {
        return { renderInline: (s: string) => `<strong>${s}</strong>` };
      },
    }));

    const { resolveCover } = await import('./cover.ts');

    const ctx = { collection: 'blog', id: 'blog/post-4' } as const;
    const cover = {
      src: 'hero.jpg',
      title: 'Hello World',
      type: 'image',
    } as const;

    const res = resolveCover(cover, ctx, {});
    expect(res.type).toBe('image');
    if (res.type === 'image') {
      expect(res.title).toBe('<strong>Hello World</strong>');
      expect(res.src).toBe('/src/assets/images/hero.jpg');
    }
  });

  it('when MarkdownIt.renderInline throws, title falls back to raw string', async () => {
    // Mock MarkdownIt to throw
    vi.doMock('@utils/image-index.ts', () => makeImageIndexMock(true));
    vi.doMock('@utils/opengraph.ts', () => ({
      resolveImageKey: defaultResolveImageKey,
    }));
    vi.doMock('markdown-it', () => ({
      default: function MockMD() {
        return {
          renderInline: (_s: string) => {
            throw new Error('boom');
          },
        };
      },
    }));

    const { resolveCover } = await import('./cover.ts');

    const ctx = { collection: 'blog', id: 'blog/post-5' } as const;
    const cover = {
      src: 'hero2.jpg',
      title: 'Title <em>with</em> tags',
      type: 'image',
    } as const;

    const res = resolveCover(cover, ctx, { debug: true });
    expect(res.type).toBe('image');
    if (res.type === 'image') {
      // on render failure, code returns the original title string (not HTML)
      expect(res.title).toBe('Title <em>with</em> tags');
    }
  });

  it('image cover alt overrides title', async () => {
    vi.doMock('@utils/image-index.ts', () => makeImageIndexMock(true));
    vi.doMock('@utils/opengraph.ts', () => ({
      resolveImageKey: defaultResolveImageKey,
    }));
    vi.doMock('markdown-it', () => ({
      default: function MockMD() {
        return { renderInline: (s: string) => `<em>${s}</em>` };
      },
    }));

    const { resolveCover } = await import('./cover.ts');

    const ctx = { collection: 'blog', id: 'blog/post-6' } as const;
    const cover = {
      alt: 'Explicit alt',
      src: 'hero3.jpg',
      title: 'Some title',
      type: 'image',
    } as const;

    const res = resolveCover(cover, ctx, {});
    expect(res.type).toBe('image');
    if (res.type === 'image') {
      expect(res.alt).toBe('Explicit alt');
      expect(res.title).toBe('<em>Some title</em>');
    }
  });

  it('fallbackAlt markup is stripped by internal stripMarkup', async () => {
    // This verifies stripMarkup (now internal to cover.ts) — not mocked.
    // Mock only image-index/opengraph/markdown-it as usual.
    vi.doMock('@utils/image-index.ts', () => makeImageIndexMock(false));
    vi.doMock('@utils/opengraph.ts', () => ({
      resolveImageKey: defaultResolveImageKey,
    }));
    vi.doMock('markdown-it', () => ({
      default: function MockMD() {
        return { renderInline: (s: string) => `<p>${s}</p>` };
      },
    }));

    const { resolveCover } = await import('./cover.ts');

    const ctx = { collection: 'blog', id: 'blog/post-7' } as const;
    const res = resolveCover(undefined, ctx, { fallbackAlt: '<em>Fancy</em>' });

    expect(res.type).toBe('image');
    if (res.type === 'image') {
      // stripMarkup should remove HTML tags from the fallbackAlt
      expect(res.alt).toBe('Fancy');
    }
  });
});
