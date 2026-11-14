// @vitest-environment node

import path from 'node:path';
import { describe, expect, it } from 'vitest';

import { parseArgs } from './build-pagefind.ts';

describe('parseArgs', () => {
  const cwd = '/work/site';

  it('defaults to dist in the working directory, without force', () => {
    expect(parseArgs([], cwd)).toEqual({
      force: false,
      help: false,
      siteDir: path.resolve(cwd, 'dist'),
    });
  });

  it('accepts --force, --help, and a relative or absolute --site', () => {
    expect(parseArgs(['--force'], cwd).force).toBe(true);
    expect(parseArgs(['--help'], cwd).help).toBe(true);
    expect(parseArgs(['--site=build/out'], cwd).siteDir).toBe(
      path.resolve(cwd, 'build/out'),
    );
    expect(parseArgs(['--site=/tmp/site'], cwd).siteDir).toBe('/tmp/site');
  });

  it('rejects unknown options and an empty --site', () => {
    expect(() => parseArgs(['--sites=dist'], cwd)).toThrow('Unknown option');
    expect(() => parseArgs(['--site='], cwd)).toThrow('--site needs a directory');
  });
});
