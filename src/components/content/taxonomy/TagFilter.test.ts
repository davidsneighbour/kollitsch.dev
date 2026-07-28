// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { describe, expect, it } from 'vitest';

describe('TagFilter component (props & source checks)', () => {
  const componentPath = path.join(
    process.cwd(),
    'src/components/content/taxonomy/TagFilter.astro',
  );

  it('exports a Props interface/type', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    const regex = /export\s+(?:interface|type)\s+\w*Props\b/;
    expect(regex.test(src)).toBe(true);
  });

  it('contains a default filterId value', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(
      src.includes('filterId = "default"') ||
        src.includes("filterId = 'default'") ||
        src.includes('filterId = "default"'),
    ).toBe(true);
  });

  it('supports concise placeholder text and an optional note', async () => {
    const src = await fs.readFile(componentPath, 'utf8');

    expect(src).toContain('placeholder?: string');
    expect(src).toContain("placeholder = 'Search tags...'");
    expect(src).toContain('note?: string');
    expect(src).toContain('{note ?');
  });

  it('does not contain inline styles', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(src.includes(' style=')).toBe(false);
  });

  it('includes fuzzyInOrder helper in source', async () => {
    const src = await fs.readFile(componentPath, 'utf8');
    expect(src.includes('function fuzzyInOrder')).toBe(true);
  });

  it('keeps search-only tags hidden until filtering starts', async () => {
    const src = await fs.readFile(componentPath, 'utf8');

    expect(src).toContain('data-tag-filter-default-hidden');
    expect(src).toContain('defaultVisibleCount');
    expect(src).toContain("query === ''");
    expect(src).toContain('!hiddenByDefault');
  });
});
