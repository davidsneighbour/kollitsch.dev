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

  it('supports optional icon configuration', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    const regex = /icon\?\s*:/;
    expect(regex.test(src)).toBe(true);
    expect(src).toContain('badge?: TagBadge');
    expect(src).toContain('badge?.icon');
  });

  it('uses Badge and icon placement instead of component-local chip CSS', async () => {
    const src = await fs.readFile(componentPath, 'utf8');

    expect(src).toContain('import Badge from');
    expect(src).toContain('<Badge');
    expect(src).toContain('data-icon="inline-start"');
    expect(src).toContain('data-icon="inline-end"');
    expect(src).not.toContain('<style>');
  });

  it('binds href and dataLabel (uses href and data-label)', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(src).toContain('href,');
    expect(src).toContain("'data-label': dataLabel");
  });
});
