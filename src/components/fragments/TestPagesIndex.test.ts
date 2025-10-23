// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('TestPagesIndex component (source checks)', () => {
  const componentPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'TestPagesIndex.astro',
  );

  it('declares a local Entry type and helper functions', async () => {
    const src = await fs.readFile(componentPath, 'utf8');

    expect(/type\s+Entry\s*=/.test(src)).toBe(true);
    expect(/function\s+toRoute\s*\(/.test(src)).toBe(true);
    expect(/function\s+titleCase\s*\(/.test(src)).toBe(true);
    expect(/function\s+toHierarchicalLabel\s*\(/.test(src)).toBe(true);
  });

  it('uses import.meta.glob to load /src/pages/test/**/*.astro', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(
      /import\.meta\.glob\(['"`]\/src\/pages\/test\/\*\*\/\*\.astro['"`]\)/.test(
        src,
      ),
    ).toBe(true);
  });

  it('does not include inline style attributes', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    // simple heuristic to catch inline style usage like: style="..." or style='...' or style=...
    expect(/[\s"'`]style=/.test(src)).toBe(false);
  });
});
