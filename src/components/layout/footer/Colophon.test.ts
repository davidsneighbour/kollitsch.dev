// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('Colophon component (props contract + patterns)', () => {
  const testDir = path.dirname(fileURLToPath(import.meta.url));
  const componentPath = path.join(testDir, 'Colophon.astro');

  it('exports a Props interface/type', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    const regex = /export\s+(?:interface|type)\s+\w*Props\b/;
    expect(regex.test(src)).toBe(true);
  });

  // @todo add a test that checks that a font-size prop is defined with a number value in vw
  // it('does not contain inline style attributes', async () => {
  //   const src = await fs.readFile(componentPath, 'utf8');
  //   // Heuristic: look for style= followed by any of { ` ' " (covers Astro template style interpolation)
  //   const hasInlineStyle = /style\s*=\s*[{`'\"]/.test(src);
  //   expect(hasInlineStyle).toBe(false);
  // });
});
