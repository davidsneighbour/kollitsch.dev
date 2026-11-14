// @vitest-environment node

import { existsSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';

describe('SiteHeader.astro', () => {
  it('exists at the expected path', () => {
    const p = path.resolve(__dirname, './title/SiteTitle.astro');
    expect(existsSync(p)).toBe(true);
  });

  it('overlays the reading progress bar without intercepting pointer events', async () => {
    const p = path.resolve(__dirname, './Header.astro');
    const source = await import('node:fs/promises').then((fs) =>
      fs.readFile(p, 'utf8'),
    );

    expect(source).toContain('progress--viewport-top');
    expect(source).toContain('pointer-events-none');
    expect(source).toContain('absolute inset-x-0 bottom-0');
  });

  it('moves the theme toggle into the nav bar below md', async () => {
    const p = path.resolve(__dirname, './Header.astro');
    const source = await import('node:fs/promises').then((fs) =>
      fs.readFile(p, 'utf8'),
    );

    expect(source).toMatch(/<theme-selector\s+class="nav-theme-toggle/);
    expect(source).toMatch(
      /@media \(max-width: 767px\) \{\s*\.theme-corner \{\s*display: none;/,
    );
    expect(source).toMatch(
      /@media \(min-width: 768px\) \{\s*\.nav-theme-toggle \{\s*display: none;/,
    );
    expect(source).toContain("'.theme-corner .theme-toggle'");
  });
});

describe('mobile menu state', () => {
  it('updates accessible state and icons, restores focus, and closes without a transition event', async () => {
    const { readFile } = await import('node:fs/promises');
    const source = await readFile(
      new URL('./Header.astro', import.meta.url),
      'utf8',
    );
    const start = source.indexOf('    function isWideLayout()');
    const end = source.indexOf('    function initStickyBrandObserver()', start);
    class Element extends EventTarget {
      attributes = new Map<string, string>();
      classes = new Set<string>();
      children = new Map<string, Element>();
      focused = false;
      classList = {
        add: (...values: string[]) =>
          values.forEach((value) => this.classes.add(value)),
        remove: (...values: string[]) =>
          values.forEach((value) => this.classes.delete(value)),
        toggle: (value: string, enabled: boolean) => {
          if (enabled) this.classes.add(value);
          else this.classes.delete(value);
        },
      };
      querySelector(selector: string) {
        return this.children.get(selector);
      }
      setAttribute(name: string, value: string) {
        this.attributes.set(name, value);
      }
      removeAttribute(name: string) {
        this.attributes.delete(name);
      }
      toggleAttribute(name: string, enabled: boolean) {
        if (enabled) this.setAttribute(name, '');
        else this.removeAttribute(name);
      }
      focus() {
        this.focused = true;
      }
    }
    const toggle = new Element();
    const nav = new Element();
    const header = new Element();
    const open = new Element();
    const close = new Element();
    toggle.children.set('.open-icon', open);
    toggle.children.set('.close-icon', close);
    const elements = new Map([
      ['#hamburger-and-close', toggle],
      ['#navigation-and-theme-select', nav],
      ['#site-header', header],
    ]);
    let finish: (() => void) | undefined;
    let timerCleared = false;
    const window = {
      clearTimeout: () => {
        timerCleared = true;
      },
      kdev: { mobileOpen: true },
      matchMedia: () => ({ matches: false }),
      setTimeout: (callback: () => void) => {
        finish = callback;
        return 1;
      },
    };
    const create = new Function(
      'document',
      'window',
      'HTMLElement',
      'getComputedStyle',
      'requestAnimationFrame',
      'cancelAnimationFrame',
      'signal',
      `
      const navSection = document.querySelector('#navigation-and-theme-select');
      let pendingOpenFrame = 0;
      let closeTimer;
      ${source.slice(start, end)}
      return { toggleIcons, dismissMobileMenu };
    `,
    );
    const menu = create(
      { querySelector: (selector: string) => elements.get(selector) },
      window,
      Element,
      () => ({ display: 'inline-flex' }),
      () => 1,
      () => {
        // No animation frame was scheduled by this test.
      },
      new AbortController().signal,
    );
    menu.toggleIcons();
    expect(toggle.attributes.get('aria-expanded')).toBe('true');
    expect(open.classes.has('hidden')).toBe(true);
    expect(open.classes.has('inline-flex')).toBe(false);
    expect(close.classes.has('inline-flex')).toBe(true);
    menu.dismissMobileMenu(true);
    expect(window.kdev.mobileOpen).toBe(false);
    expect(toggle.attributes.get('aria-expanded')).toBe('false');
    expect(toggle.focused).toBe(true);
    expect(nav.attributes.get('aria-hidden')).toBe('true');
    expect(nav.attributes.has('inert')).toBe(true);
    expect(finish).toBeDefined();
    finish?.();
    expect(nav.classes.has('hidden')).toBe(true);
    expect(timerCleared).toBe(true);
  });
});

describe('compact scrolled brand', () => {
  it('keeps the mobile brand small and removes only its decorative house icon', async () => {
    const source = await (await import('node:fs/promises')).readFile(
      new URL('./Header.astro', import.meta.url),
      'utf8',
    );
    expect(source).toContain('navbar-brand-icon');
    expect(source).toMatch(
      /#navbar-brand\s*\{\s*font-size: var\(--text-base\);/,
    );
    // @apply without @reference breaks every page in the dev server (500).
    if (source.includes('@apply')) {
      expect(source).toContain('@reference');
    }
    expect(source).toMatch(/\.navbar-brand-icon\s*\{\s*display: none;/);
    expect(source).toContain(
      '#site-header:not([data-scrolled]) [data-nav-search-region-left]',
    );
  });
});
