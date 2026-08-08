// @vitest-environment node
import setup from '@data/setup.json' with { type: 'json' };
import { describe, expect, it } from 'vitest';
import { hasImage } from './image-index.ts';
import {
  getOpenGraphImage,
  getOpenGraphImageFromKey,
  resolveImageKey,
  siteAuthorName,
  siteDefaultImageKey,
  siteOgImageKey,
  siteTitle,
} from './opengraph.ts';

describe('site-level constants', () => {
  it('are derived from setup.json', () => {
    expect(siteTitle).toBe(setup.title ?? '');
    expect(siteAuthorName).toBe(setup.author?.name ?? '');
    expect(siteDefaultImageKey).toBe((setup.images?.default ?? '').trim());
    expect(siteOgImageKey).toBe((setup.images?.opengraph ?? '').trim());
  });
});

describe('resolveImageKey', () => {
  it('passes remote URLs through unchanged', () => {
    expect(
      resolveImageKey('https://example.com/pic.jpg', '2025/slug', 'blog'),
    ).toBe('https://example.com/pic.jpg');
  });

  it('returns an already-indexed "/src/..." key as-is', () => {
    const key = '/src/assets/images/patrick-kollitsch.png';
    expect(hasImage(key)).toBe(true);
    expect(resolveImageKey(key, 'any/entry', 'blog')).toBe(key);
  });

  it('maps a leading-slash path outside /src/ onto /src/ and resolves it if indexed', () => {
    expect(
      resolveImageKey(
        '/assets/images/patrick-kollitsch.png',
        'any/entry',
        'blog',
      ),
    ).toBe('/src/assets/images/patrick-kollitsch.png');
  });

  it('resolves a bare filename beside the content entry directory when indexed there', () => {
    // With contentRoot pointed at the assets dir, the entry-relative
    // candidate coincides with a real indexed file.
    const resolved = resolveImageKey('patrick-kollitsch.png', '', '', {
      contentRoot: '/src/assets/images',
      warnOnFallback: false,
    });
    expect(resolved).toBe('/src/assets/images/patrick-kollitsch.png');
  });

  it('falls back to the global assets directory when no entry-relative match exists', () => {
    const resolved = resolveImageKey(
      'patrick-kollitsch.png',
      'nonexistent/entry',
      'blog',
    );
    expect(resolved).toBe('/src/assets/images/patrick-kollitsch.png');
  });

  it('falls back to the configured defaultKey when nothing else matches', () => {
    const resolved = resolveImageKey('totally-missing.png', 'x/y', 'blog', {
      defaultKey: '/src/assets/images/patrick-kollitsch.png',
      warnOnFallback: false,
    });
    expect(resolved).toBe('/src/assets/images/patrick-kollitsch.png');
  });

  it('returns an empty string when there is no imageName and no defaultKey', () => {
    expect(
      resolveImageKey(undefined, 'x/y', 'blog', {
        defaultKey: '',
        warnOnFallback: false,
      }),
    ).toBe('');
  });

  it('falls back to the site-wide opengraph image when no options are given', () => {
    // Uses the real setup.json opengraph default, which is expected to be indexed.
    const resolved = resolveImageKey('totally-missing.png', 'x/y', 'blog');
    expect(resolved).toBe(siteOgImageKey);
    expect(hasImage(resolved)).toBe(true);
  });
});

describe('getOpenGraphImageFromKey', () => {
  it('throws for an empty key', async () => {
    await expect(getOpenGraphImageFromKey('')).rejects.toThrow(
      'Empty key/URL.',
    );
  });

  it('throws for a local key that is not indexed', async () => {
    await expect(
      getOpenGraphImageFromKey('/src/assets/images/does-not-exist.png'),
    ).rejects.toThrow('Image not indexed');
  });

  it('generates an image for a real indexed local key', async () => {
    const key = '/src/assets/images/patrick-kollitsch.png';
    const result = await getOpenGraphImageFromKey(key);
    expect(result.src).toBeTruthy();
    expect(result.attributes['width']).toBe(1200);
    expect(result.attributes['height']).toBe(630);
  });

  it('honors custom width/height/format options', async () => {
    const key = '/src/assets/images/patrick-kollitsch.png';
    const result = await getOpenGraphImageFromKey(key, {
      format: 'png',
      height: 315,
      width: 600,
    });
    expect(result.attributes['width']).toBe(600);
    expect(result.attributes['height']).toBe(315);
  });
});

describe('getOpenGraphImage', () => {
  it('resolves the post cover image and generates an OG image from it', async () => {
    const post = {
      collection: 'blog',
      data: { articleimage: '/src/assets/images/patrick-kollitsch.png' },
      id: 'any/entry',
    };
    const result = await getOpenGraphImage(post);
    expect(result.src).toBeTruthy();
  });

  it('falls back to the site default when the post has no articleimage', async () => {
    const post = { collection: 'blog', data: {}, id: 'any/entry' };
    const result = await getOpenGraphImage(post);
    expect(result.src).toBeTruthy();
  });
});
