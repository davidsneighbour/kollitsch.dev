// @vitest-environment node

import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildPagefindIndex, hashHtmlFiles, listHtmlFiles } from './pagefind-index.ts';

const silent = { error: () => undefined, info: () => undefined };
const page = (title: string, body: string): string =>
  `<!doctype html><html lang="en"><head><title>${title}</title></head><body><main><h1>${title}</h1><p>${body}</p></main></body></html>`;

let root: string;
let siteDir: string;
let cacheDir: string;

beforeEach(async () => {
  root = await mkdtemp(path.join(tmpdir(), 'pagefind-index-'));
  siteDir = path.join(root, 'dist');
  cacheDir = path.join(root, 'cache');
  await mkdir(path.join(siteDir, 'blog'), { recursive: true });
  await writeFile(path.join(siteDir, 'index.html'), page('Home', 'Welcome to the garden.'));
  await writeFile(path.join(siteDir, 'blog', 'index.html'), page('Blog', 'Notes about Astro.'));
});

afterEach(async () => {
  await rm(root, { force: true, recursive: true });
});

describe('listHtmlFiles and hashHtmlFiles', () => {
  it('lists HTML files sorted and ignores the pagefind output folder', async () => {
    await mkdir(path.join(siteDir, 'pagefind'));
    await writeFile(path.join(siteDir, 'pagefind', 'stray.html'), 'x');
    expect(await listHtmlFiles(siteDir)).toEqual(['blog/index.html', 'index.html']);
  });

  it('changes the hash when page content changes', async () => {
    const before = await hashHtmlFiles(siteDir);
    await writeFile(path.join(siteDir, 'index.html'), page('Home', 'Changed.'));
    expect(await hashHtmlFiles(siteDir)).not.toBe(before);
  });
});

describe('buildPagefindIndex', () => {
  it('indexes, then reuses the cache, and indexes again with force or changed HTML', async () => {
    const first = await buildPagefindIndex({ cacheDir, logger: silent, siteDir });
    expect(first).toMatchObject({ pageCount: 2, status: 'indexed' });
    expect(existsSync(path.join(siteDir, 'pagefind', 'pagefind.js'))).toBe(true);

    // A deleted index is restored from the cache.
    await rm(path.join(siteDir, 'pagefind'), { force: true, recursive: true });
    const second = await buildPagefindIndex({ cacheDir, logger: silent, siteDir });
    expect(second.status).toBe('cached');
    expect(existsSync(path.join(siteDir, 'pagefind', 'pagefind.js'))).toBe(true);

    const forced = await buildPagefindIndex({ cacheDir, force: true, logger: silent, siteDir });
    expect(forced.status).toBe('indexed');

    await rm(path.join(siteDir, 'blog'), { force: true, recursive: true });
    const changed = await buildPagefindIndex({ cacheDir, logger: silent, siteDir });
    expect(changed).toMatchObject({ pageCount: 1, status: 'indexed' });
  }, 60_000);

  it('fails clearly when the site has no HTML files', async () => {
    await expect(
      buildPagefindIndex({ cacheDir, logger: silent, siteDir: path.join(root, 'missing') }),
    ).rejects.toThrow('No HTML files');
  });
});
