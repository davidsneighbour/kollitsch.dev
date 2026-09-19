// @vitest-environment node
import type { CollectionEntry } from 'astro:content';
import { createDefaultPost } from '@utils/content.ts';
import { describe, expect, it } from 'vitest';
import { getFeedOgImage } from './feed-og-image.ts';

const site = new URL('https://kollitsch.dev/');

function makePost(
  id: string,
  overrides: Partial<CollectionEntry<'blog'>['data']> = {},
): CollectionEntry<'blog'> {
  return {
    collection: 'blog',
    data: createDefaultPost(overrides),
    id,
  } as unknown as CollectionEntry<'blog'>;
}

describe('getFeedOgImage', () => {
  it('resolves the generated post image when it exists on disk', () => {
    // 2026/ai-in-contributions is generated as part of this session's
    // `build:ogimages --force` run (see scratch/og-image-generation.plan.md).
    const url = getFeedOgImage(makePost('2026/ai-in-contributions'), site);
    expect(url).toBe(
      'https://kollitsch.dev/images/social/blog/2026/ai-in-contributions.jpg',
    );
  });

  it('falls back to the default social image when no post image exists', () => {
    const url = getFeedOgImage(makePost('2099/does-not-exist'), site);
    expect(url).toBe('https://kollitsch.dev/images/social/default.jpg');
  });

  it('is deterministic for the same post and site', () => {
    const post = makePost('2026/ai-in-contributions');
    expect(getFeedOgImage(post, site)).toBe(getFeedOgImage(post, site));
  });

  it('resolves against the given site origin while keeping the same path', () => {
    const post = makePost('2026/ai-in-contributions');
    const other = new URL('https://staging.kollitsch.dev/');

    const url = getFeedOgImage(post, site);
    const otherUrl = getFeedOgImage(post, other);

    expect(url).not.toBe(otherUrl);
    expect(new URL(url).pathname).toBe(new URL(otherUrl).pathname);
  });
});
