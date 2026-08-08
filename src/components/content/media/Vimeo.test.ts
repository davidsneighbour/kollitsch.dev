// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('Vimeo component', () => {
  const componentPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'Vimeo.astro'.replace('.test.ts', ''),
  );

  it('exports a Props interface', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    const regex = /export\s+(?:interface|type)\s+\w*Props\b/;
    expect(regex.test(src)).toBe(true);
  });

  it('enforces numeric id parsing', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(src.includes('return /^\\d+$/.test(value) ? value : null;')).toBe(
      true,
    );
  });

  it('uses privacy-friendly Vimeo player parameters', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(src.includes("srcUrl.searchParams.set('dnt', '1');")).toBe(true);
  });
});
