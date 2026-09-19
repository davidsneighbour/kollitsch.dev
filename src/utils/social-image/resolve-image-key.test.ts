// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { resolveImageKeyCore } from './resolve-image-key.ts';

describe('resolveImageKeyCore', () => {
  it('passes remote URLs through unchanged', () => {
    const result = resolveImageKeyCore(
      'https://example.com/pic.jpg',
      '2025/slug',
      'blog',
      () => false,
    );
    expect(result).toEqual({
      resolved: 'https://example.com/pic.jpg',
      tried: [],
      usedFallback: false,
    });
  });

  it('returns an already-indexed "/src/..." key as-is', () => {
    const key = '/src/assets/images/patrick-kollitsch.png';
    const exists = (k: string) => k === key;
    const result = resolveImageKeyCore(key, 'any/entry', 'blog', exists);
    expect(result.resolved).toBe(key);
    expect(result.usedFallback).toBe(false);
  });

  it('maps a leading-slash path outside /src/ onto /src/ and resolves it if it exists', () => {
    const exists = (k: string) => k === '/src/assets/images/pic.png';
    const result = resolveImageKeyCore(
      '/assets/images/pic.png',
      'any/entry',
      'blog',
      exists,
    );
    expect(result.resolved).toBe('/src/assets/images/pic.png');
  });

  it('resolves a candidate beside the content entry directory', () => {
    const exists = (k: string) => k === '/src/content/blog/2025/slug/cover.jpg';
    const result = resolveImageKeyCore(
      'cover.jpg',
      '2025/slug',
      'blog',
      exists,
    );
    expect(result.resolved).toBe('/src/content/blog/2025/slug/cover.jpg');
    expect(result.usedFallback).toBe(false);
  });

  it('falls back to the global assets directory when no entry-relative match exists', () => {
    const exists = (k: string) => k === '/src/assets/images/cover.jpg';
    const result = resolveImageKeyCore(
      'cover.jpg',
      'nonexistent/entry',
      'blog',
      exists,
    );
    expect(result.resolved).toBe('/src/assets/images/cover.jpg');
  });

  it('falls back to defaultKey when nothing else matches', () => {
    const result = resolveImageKeyCore(
      'totally-missing.png',
      'x/y',
      'blog',
      () => false,
      { defaultKey: '/src/assets/images/default.png' },
    );
    expect(result.resolved).toBe('/src/assets/images/default.png');
    expect(result.usedFallback).toBe(true);
    expect(result.tried.length).toBeGreaterThan(0);
  });

  it('returns an empty result when there is no imageName and no defaultKey', () => {
    const result = resolveImageKeyCore(undefined, 'x/y', 'blog', () => false);
    expect(result).toEqual({ resolved: '', tried: [], usedFallback: false });
  });
});
