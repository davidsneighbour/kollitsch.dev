// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  getImageMeta,
  getIndexedImage,
  hasImage,
  listIndexedImages,
} from './image-index.ts';

describe('listIndexedImages', () => {
  it('indexes at least one real project image', async () => {
    expect((await listIndexedImages()).length).toBeGreaterThan(0);
  });

  it('returns entries sorted by key', async () => {
    const keys = (await listIndexedImages()).map((img) => img.key);
    const sorted = [...keys].sort((a, b) => a.localeCompare(b));
    expect(keys).toEqual(sorted);
  });

  it('memoizes the sorted list across calls', async () => {
    expect(await listIndexedImages()).toBe(await listIndexedImages());
  });

  it('every entry carries an Astro ImageMetadata with real dimensions', async () => {
    for (const img of (await listIndexedImages()).slice(0, 5)) {
      expect(img.meta.width).toBeGreaterThan(0);
      expect(img.meta.height).toBeGreaterThan(0);
      expect(img.filename.length).toBeGreaterThan(0);
    }
  });
});

describe('hasImage / getImageMeta / getIndexedImage', () => {
  it('finds a known indexed image by its exact key', async () => {
    const [first] = await listIndexedImages();
    if (!first) throw new Error('expected at least one indexed image');

    expect(hasImage(first.key)).toBe(true);
    expect(await getImageMeta(first.key)).toEqual(first.meta);
    expect(await getIndexedImage(first.key)).toEqual(first);
  });

  it('returns false/undefined for a key that is not indexed', async () => {
    expect(hasImage('/src/assets/images/does-not-exist.png')).toBe(false);
    expect(
      await getImageMeta('/src/assets/images/does-not-exist.png'),
    ).toBeUndefined();
    expect(
      await getIndexedImage('/src/assets/images/does-not-exist.png'),
    ).toBeUndefined();
  });
});
