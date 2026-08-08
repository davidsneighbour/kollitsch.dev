// @vitest-environment node
import { describe, expect, it } from 'vitest';
import {
  getImageMeta,
  getIndexedImage,
  hasImage,
  listIndexedImages,
} from './image-index.ts';

describe('listIndexedImages', () => {
  it('indexes at least one real project image', () => {
    expect(listIndexedImages().length).toBeGreaterThan(0);
  });

  it('returns entries sorted by key', () => {
    const keys = listIndexedImages().map((img) => img.key);
    const sorted = [...keys].sort((a, b) => a.localeCompare(b));
    expect(keys).toEqual(sorted);
  });

  it('memoizes the sorted list across calls', () => {
    expect(listIndexedImages()).toBe(listIndexedImages());
  });

  it('every entry carries an Astro ImageMetadata with real dimensions', () => {
    for (const img of listIndexedImages().slice(0, 5)) {
      expect(img.meta.width).toBeGreaterThan(0);
      expect(img.meta.height).toBeGreaterThan(0);
      expect(img.filename.length).toBeGreaterThan(0);
    }
  });
});

describe('hasImage / getImageMeta / getIndexedImage', () => {
  it('finds a known indexed image by its exact key', () => {
    const [first] = listIndexedImages();
    if (!first) throw new Error('expected at least one indexed image');

    expect(hasImage(first.key)).toBe(true);
    expect(getImageMeta(first.key)).toEqual(first.meta);
    expect(getIndexedImage(first.key)).toEqual(first);
  });

  it('returns false/undefined for a key that is not indexed', () => {
    expect(hasImage('/src/assets/images/does-not-exist.png')).toBe(false);
    expect(
      getImageMeta('/src/assets/images/does-not-exist.png'),
    ).toBeUndefined();
    expect(
      getIndexedImage('/src/assets/images/does-not-exist.png'),
    ).toBeUndefined();
  });
});
