// @vitest-environment node

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';

describe('BreadcrumbSwitcher component', () => {
  let src: string;

  const load = async () => {
    const dir = path.dirname(fileURLToPath(import.meta.url));
    src = await fs.readFile(path.join(dir, 'BreadcrumbSwitcher.astro'), 'utf8');
  };

  it('exports the required Props and BreadcrumbSwitcherItem shapes', async () => {
    await load();
    expect(src).toContain('export interface BreadcrumbSwitcherItem');
    expect(src).toContain('export interface Props');
    expect(src).toContain('items: BreadcrumbSwitcherItem[];');
    expect(src).toContain('currentId: string;');
    expect(src).toContain('ariaLabel: string;');
    expect(src).toContain('isCurrentPage?: boolean;');
  });

  it('splits items into above/below lists around currentId', async () => {
    await load();
    expect(src).toContain(
      'const activeIndex = items.findIndex((item) => item.id === currentId);',
    );
    expect(src).toContain('items.slice(0, activeIndex)');
    expect(src).toContain('items.slice(activeIndex + 1)');
  });

  it('degrades to a plain link with no toggle/panel when there are no siblings', async () => {
    await load();
    expect(src).toContain('const hasSwitcher = items.length > 1;');
    expect(src).toContain('{hasSwitcher && (');
  });

  it('always renders the unchanged link so the breadcrumb works without JS', async () => {
    await load();
    expect(src).toContain('<a\n    href={href}');
    expect(src).toContain("aria-current={isCurrentPage ? 'page' : undefined}");
  });

  it('renders a disclosure toggle with correct ARIA wiring, not menu semantics', async () => {
    await load();
    expect(src).toContain('data-breadcrumb-switcher-toggle');
    expect(src).toContain('aria-expanded="false"');
    expect(src).toContain('aria-controls={panelId}');
    expect(src).not.toContain('role="menu"');
  });

  it('renders sibling items as a real link list with stripped-HTML aria-labels', async () => {
    await load();
    expect(src).toContain('data-breadcrumb-switcher-item');
    expect(src).toContain('aria-label={`Go to ${stripHtmlTags(item.label)}`}');
  });

  it('registers click/keyboard handling on astro:page-load with a body-level dismiss guard', async () => {
    await load();
    expect(src).toContain(
      "document.addEventListener('astro:page-load', initBreadcrumbSwitchers)",
    );
    expect(src).toContain('data-breadcrumb-switcher-dismiss-init');
  });

  it('closes other open switchers before opening one, so only one is open at a time', async () => {
    await load();
    expect(src).toContain("'[data-breadcrumb-switcher].open'");
    expect(src).toContain('if (other !== el) closeSwitcher(other);');
  });

  it('supports Escape, ArrowUp/ArrowDown, Home, and End inside an open switcher', async () => {
    await load();
    expect(src).toContain("e.key === 'Escape'");
    expect(src).toContain("e.key === 'ArrowDown'");
    expect(src).toContain("e.key === 'ArrowUp'");
    expect(src).toContain("e.key === 'Home'");
    expect(src).toContain("e.key === 'End'");
  });

  it('respects prefers-reduced-motion by collapsing the transition and dropping the translate, matching the codebase-wide convention', async () => {
    await load();
    expect(src).toContain('@media (prefers-reduced-motion: reduce)');
    expect(src).toContain('transition-duration: 0.01ms;');
    expect(src).toContain('transform: none;');
  });
});
