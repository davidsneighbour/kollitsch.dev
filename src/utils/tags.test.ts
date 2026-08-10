// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('tag helpers (source contract)', () => {
  it('keeps tag cloud visibility metadata available to overview callers', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'tags.ts'), 'utf8');

    expect(src).toContain('hideInTagCloud: boolean');
    expect(src).toContain('hideInTagCloud = hit.data.hideInTagCloud ?? false');
    expect(src).toContain('hideInTagCloud,');
  });

  it('does not use tag cloud visibility metadata as route suppression', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'tags.ts'), 'utf8');

    expect(src).not.toContain('if (hit?.data.hideInTagCloud');
    expect(src).not.toContain('if (entry.data.hideInTagCloud === true)');
  });

  it('normalises tag identifiers to lowercase kebab-case only', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const src = await fs.readFile(path.join(testDir, 'tags.ts'), 'utf8');

    expect(src).toContain('const ID_REGEX = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;');
    expect(src).toContain("const s3 = s2.replace(/[\\s_]+/g, '-');");
  });
});
