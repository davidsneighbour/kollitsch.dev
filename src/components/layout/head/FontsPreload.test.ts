// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('FontsPreload component (props contract)', () => {
  it('exports a Props interface/type', async () => {
    // resolve the .astro component path relative to this test file
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'FontsPreload.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    // heuristic: match `export interface XProps` or `export type XProps =`
    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
  });
});
