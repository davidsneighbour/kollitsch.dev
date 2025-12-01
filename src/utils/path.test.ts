// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { formatUrl } from './path';

describe('formatUrl', () => {
  it('adds leading and trailing slashes by default', () => {
    expect(formatUrl('blog/post')).toBe('/blog/post/');
  });

  it("returns '/' for empty or slash-only paths", () => {
    expect(formatUrl('')).toBe('/');
    expect(formatUrl('/')).toBe('/');
  });

  it('returns empty string when path is null', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(formatUrl(null as any)).toBe('');
  });

  it('respects options to remove/add leading/trailing slashes', () => {
    expect(formatUrl('about', { trailingSlash: false })).toBe('/about');
    expect(formatUrl('about', { leadingSlash: false })).toBe('about/');
    expect(
      formatUrl('about', { leadingSlash: false, trailingSlash: false }),
    ).toBe('about');
  });
});
