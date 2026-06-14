// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('NavItem component', () => {
  let src: string;

  const load = async () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    src = await fs.readFile(path.join(dir, 'NavItem.astro'), 'utf8');
  };

  it('exports required Props with all expected fields', async () => {
    await load();
    expect(src).toContain('export interface Props');
    expect(src).toContain('name: string;');
    expect(src).toContain('link: string;');
    expect(src).toContain('classes?: string;');
    expect(src).toContain('subItems?: NavDataItem[] | undefined;');
  });

  it('renders IconLink for the primary link', async () => {
    await load();
    expect(src).toContain('<IconLink icon={icon} href={link}>');
    expect(src).toContain('{name}');
  });

  it('renders a dropdown toggle button when subItems are present', async () => {
    await load();
    expect(src).toContain('data-nav-dropdown-toggle');
    expect(src).toContain('aria-haspopup="menu"');
    expect(src).toContain('data-nav-dropdown');
  });

  it('uses named Tailwind group for dropdown state management', async () => {
    await load();
    expect(src).toContain('group/navitem');
    expect(src).toContain('group-[.open]/navitem:block');
    expect(src).toContain('md:group-hover/navitem:block');
  });

  it('registers dropdown toggles and dismiss handler on astro:page-load', async () => {
    await load();
    expect(src).toContain(
      "document.addEventListener('astro:page-load', initNavDropdowns)",
    );
    expect(src).toContain('data-nav-dismiss-init');
  });
});
