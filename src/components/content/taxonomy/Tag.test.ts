// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('Tag component (props contract)', () => {
  const componentPath = path.join(
    process.cwd(),
    'src/components/content/taxonomy/Tag.astro',
  );

  it('exports a Props interface/type', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    const regex = /export\s+(?:interface|type)\s+\w*Props\b/;
    expect(regex.test(src)).toBe(true);
  });

  it('does not contain inline styles', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(src.includes(' style=')).toBe(false);
  });

  it('binds href and dataLabel (uses href and data-label)', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(src.includes('href={href}') || src.includes('href=')).toBe(true);
    expect(
      src.includes('data-label={dataLabel}') || src.includes('data-label='),
    ).toBe(true);
  });
});
