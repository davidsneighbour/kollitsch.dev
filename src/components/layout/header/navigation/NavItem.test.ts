// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('NavItem component', () => {
  it('exports required Props and renders IconLink', async () => {
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'NavItem.astro');
    const src = await fs.readFile(componentPath, 'utf8');

    expect(src).toContain('export interface Props');
    expect(src).toContain('name: string;');
    expect(src).toContain('link: string;');
    expect(src).toContain('classes?: string;');
    expect(src).toContain('<IconLink icon={icon} href={link}>');
    expect(src).toContain('{name}');
  });
});
