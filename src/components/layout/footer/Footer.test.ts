// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('Footer component (props contract)', () => {
  it('exports a Props interface/type', async () => {
    // resolve the .astro component path relative to this test file
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'Footer.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    // heuristic: match `export interface XProps` or `export type XProps =`
    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
  });
});

describe('Footer component (Static.Quest web ring)', () => {
  it('links to the previous/members/next/random web ring endpoints', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toContain('https://static.quest/previous/?host=kollitsch.dev');
    expect(src).toContain('https://static.quest/members');
    expect(src).toContain('https://static.quest/next/?host=kollitsch.dev');
    expect(src).toContain('https://static.quest/random');
  });

  it('uses IconLink instead of hand-composed Icon + a for the ring nav icons', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'Footer.astro'), 'utf8');

    expect(src).toMatch(
      /<IconLink[^>]+href="https:\/\/static\.quest\/previous/,
    );
    expect(src).toMatch(/<IconLink[^>]+href="https:\/\/static\.quest\/next/);
  });
});
