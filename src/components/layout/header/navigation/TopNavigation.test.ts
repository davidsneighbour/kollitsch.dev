// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

const testDir = path.dirname(fileURLToPath(import.meta.url));
const componentPath = path.join(testDir, 'TopNavigation.astro');

async function getSource() {
  return fs.readFile(componentPath, 'utf8');
}

describe('TopNavigation component', () => {
  it('exports a Props interface/type', async () => {
    const src = await getSource();
    const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
    expect(regex.test(src)).toBe(true);
  });

  it('uses container queries for navigation layout', async () => {
    const src = await getSource();
    expect(src).toContain('class="@container mx-auto max-w-7xl"');
    expect(src).toContain('@md:flex-row');
  });

  it('renders nav links via the NavItem component', async () => {
    const src = await getSource();
    expect(src).toContain('import NavItem from "@components/layout/header/navigation/NavItem.astro";');
    expect(src).toContain('<NavItem');
  });

  it('initialises the viewport progress bar hidden and toggles it with sticky state', async () => {
    const src = await getSource();
    expect(src).toContain('progress--viewport-top');
    expect(src).toContain('hidden [--height:4px]');
    expect(src).toContain('viewportProgress?.classList.toggle("hidden", !shouldShowStickyState);');
  });
});
