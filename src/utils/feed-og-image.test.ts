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
  it('returns a /og_image/<hash>.jpg URL resolved against the given site', () => {
    const url = getFeedOgImage(makePost('2025/my-post'), site);
    expect(url).toMatch(
      /^https:\/\/kollitsch\.dev\/og_image\/[0-9a-f]{16}\.jpg$/,
    );
  });

  it('is deterministic for the same post and site', () => {
    const post = makePost('2025/my-post', { title: 'Same title' });
    expect(getFeedOgImage(post, site)).toBe(getFeedOgImage(post, site));
  });

  it('produces a different hash when the title changes', () => {
    const a = getFeedOgImage(makePost('2025/my-post', { title: 'A' }), site);
    const b = getFeedOgImage(makePost('2025/my-post', { title: 'B' }), site);
    expect(a).not.toBe(b);
  });

  it('produces a different hash when the publish date changes', () => {
    const a = getFeedOgImage(
      makePost('2025/my-post', { date: new Date('2024-01-01') }),
      site,
    );
    const b = getFeedOgImage(
      makePost('2025/my-post', { date: new Date('2024-06-01') }),
      site,
    );
    expect(a).not.toBe(b);
  });

  it('resolves against the given site origin while keeping the same content hash', () => {
    // The content hash is derived from title/date/image only (see
    // generateContentHash), not from the `site` argument, so a different
    // origin changes the URL's host but not its /og_image/<hash>.jpg path.
    const post = makePost('2025/my-post', { title: 'Same title' });
    const other = new URL('https://staging.kollitsch.dev/');

    const url = getFeedOgImage(post, site);
    const otherUrl = getFeedOgImage(post, other);

    expect(url).not.toBe(otherUrl);
    expect(new URL(url).pathname).toBe(new URL(otherUrl).pathname);
  });
});
