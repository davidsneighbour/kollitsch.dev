// @vitest-environment node

import path from 'node:path';
import { describe, expect, it } from 'vitest';

import {
  computeOrphans,
  idFromFile,
  isImageStale,
  parseArgs,
  shouldGenerateDefault,
} from './build-og-images.ts';

describe('parseArgs', () => {
  it('defaults to full incremental scan with no flags', () => {
    expect(parseArgs([])).toEqual({ check: false, files: null, force: false });
  });

  it('recognises --force', () => {
    expect(parseArgs(['--force'])).toEqual({
      check: false,
      files: null,
      force: true,
    });
  });

  it('recognises --check', () => {
    expect(parseArgs(['--check'])).toEqual({
      check: true,
      files: null,
      force: false,
    });
  });

  it('collects one or more --file= flags as absolute paths', () => {
    const result = parseArgs([
      '--file=src/content/blog/2026/foo/index.md',
      '--file=src/content/blog/2026/bar/index.mdx',
    ]);
    expect(result.files).toEqual([
      path.resolve(process.cwd(), 'src/content/blog/2026/foo/index.md'),
      path.resolve(process.cwd(), 'src/content/blog/2026/bar/index.mdx'),
    ]);
  });

  it('combines --force with --file', () => {
    const result = parseArgs([
      '--force',
      '--file=src/content/blog/2026/foo/index.md',
    ]);
    expect(result.force).toBe(true);
    expect(result.files).toHaveLength(1);
  });
});

describe('idFromFile', () => {
  const contentRoot = path.resolve(process.cwd(), 'src/content/blog');

  it('strips a trailing /index.md into the year/slug id', () => {
    expect(idFromFile(path.join(contentRoot, '2026/example-post/index.md'))).toBe(
      '2026/example-post',
    );
  });

  it('strips a trailing /index.mdx', () => {
    expect(idFromFile(path.join(contentRoot, '2026/example-post/index.mdx'))).toBe(
      '2026/example-post',
    );
  });

  it('handles a flat file without an /index segment', () => {
    expect(idFromFile(path.join(contentRoot, '2026/example-post.md'))).toBe(
      '2026/example-post',
    );
  });
});

describe('isImageStale', () => {
  it('is stale when forced, regardless of fingerprint match', () => {
    expect(isImageStale(true, true, 'same', 'same')).toBe(true);
  });

  it('is stale when the file does not exist', () => {
    expect(isImageStale(false, false, undefined, 'abc')).toBe(true);
  });

  it('is stale when the stored fingerprint does not match', () => {
    expect(isImageStale(false, true, 'old', 'new')).toBe(true);
  });

  it('is not stale when the file exists and the fingerprint matches', () => {
    expect(isImageStale(false, true, 'abc', 'abc')).toBe(false);
  });
});

describe('shouldGenerateDefault', () => {
  it('always regenerates under --force', () => {
    expect(shouldGenerateDefault({ files: null, force: true }, true, false)).toBe(
      true,
    );
  });

  it('in --file mode, only generates when the file is missing (ignores fingerprint drift)', () => {
    const opts = { files: ['a.md'], force: false };
    expect(shouldGenerateDefault(opts, false, false)).toBe(true);
    expect(shouldGenerateDefault(opts, true, true)).toBe(false);
  });

  it('in a full run, regenerates on missing file or stale fingerprint', () => {
    const opts = { files: null, force: false };
    expect(shouldGenerateDefault(opts, false, false)).toBe(true);
    expect(shouldGenerateDefault(opts, true, true)).toBe(true);
    expect(shouldGenerateDefault(opts, true, false)).toBe(false);
  });
});

describe('computeOrphans', () => {
  it('returns an empty list when every file maps to a current post', () => {
    const valid = new Set([
      'public/images/social/blog/2026/foo.jpg',
      'public/images/social/blog/2026/bar.jpg',
    ]);
    const existing = [
      'public/images/social/blog/2026/foo.jpg',
      'public/images/social/blog/2026/bar.jpg',
    ];
    expect(computeOrphans(valid, existing)).toEqual([]);
  });

  it('flags a renamed post: the old slug becomes orphaned once the new one is valid', () => {
    const valid = new Set(['public/images/social/blog/2026/new-name.jpg']);
    const existing = [
      'public/images/social/blog/2026/old-name.jpg',
      'public/images/social/blog/2026/new-name.jpg',
    ];
    expect(computeOrphans(valid, existing)).toEqual([
      'public/images/social/blog/2026/old-name.jpg',
    ]);
  });

  it('flags a deleted post: its image has no corresponding valid path', () => {
    const valid = new Set<string>([]);
    const existing = ['public/images/social/blog/2026/removed.jpg'];
    expect(computeOrphans(valid, existing)).toEqual([
      'public/images/social/blog/2026/removed.jpg',
    ]);
  });
});
