// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('TagList component (props contract)', () => {
  it('exports a Props interface/type and renders flat Tag components', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'TagList.astro');

    const src = await fs.readFile(componentPath, 'utf8');

    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
    expect(src).toContain('import Tag from "./Tag.astro"');
    expect(src).toContain('showCounts');
    expect(src).toContain('<Tag');
    expect(src).not.toContain('function getFontSize');
  });
});
