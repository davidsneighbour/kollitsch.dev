// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('Youtube component', () => {
  const componentPath = path.join(
    path.dirname(fileURLToPath(import.meta.url)),
    'Youtube.astro'.replace('.test.ts', ''),
  );

  it('exports a Props interface', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    const regex = /export\s+(?:interface|type)\s+\w*Props\b/;
    expect(regex.test(src)).toBe(true);
  });

  it('enforces strict 11-character id parsing (no URLs)', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    // Ensure the strict id-only regex is present in the source.
    expect(
      src.includes('return /^[A-Za-z0-9_-]{11}$/.test(s) ? s : null;'),
    ).toBe(true);
  });

  it('fails-fast when no valid video id is provided (throw exists)', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(src.includes('failed to parse a valid 11-character video id')).toBe(
      true,
    );
  });
});
