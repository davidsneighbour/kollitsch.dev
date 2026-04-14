// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import NavSearch from './NavSearch.astro';

interface NavItem {
  label: string;
  href: string;
}

interface RenderProps {
  title?: string;
  navItems?: NavItem[];
  navLabel?: string;
  searchPlaceholder?: string;
  openSearchLabel?: string;
  closeSearchLabel?: string;
  searchRegionLabel?: string;
  searchInitiallyOpen?: boolean;
  class?: string;
  innerClass?: string;
  leftClass?: string;
  centerClass?: string;
  rightClass?: string;
}

type SlotMap = Record<string, string>;

let container: Awaited<ReturnType<typeof AstroContainer.create>>;

/**
 * Normalise rendered HTML so string assertions are less brittle.
 *
 * @param html - Raw rendered HTML.
 * @returns Compacted HTML with collapsed whitespace.
 */
function compactHtml(html: string): string {
  return html
    .replace(/\s+/g, ' ')
    .replace(/>\s+/g, '>')
    .replace(/\s+</g, '<')
    .trim();
}

/**
 * Render the NavSearch Astro component to a string.
 *
 * @param props - Component props.
 * @param slots - Named slot content.
 * @returns Normalised HTML output.
 */
async function renderComponent(
  props: RenderProps = {},
  slots: SlotMap = {},
): Promise<string> {
  const html = await container.renderToString(NavSearch, {
    // @ts-expect-error
    props,
    slots,
  });

  return compactHtml(html);
}

beforeAll(async () => {
  container = await AstroContainer.create();
});

describe('NavSearch.astro', () => {
  it('renders the default structure and initial closed state', async () => {
    const html = await renderComponent();

    expect(html).toContain('Placeholder title');
    expect(html).toContain('>Home<');
    expect(html).toContain('>About<');
    expect(html).toContain('>Contact<');

    expect(html).toContain('data-nav-search-region-left');
    expect(html).toContain('data-nav-search-region-center');
    expect(html).toContain('data-nav-search-region-right');

    expect(html).toContain('data-nav-search-toggle');
    expect(html).toContain('aria-expanded="false"');
    expect(html).toContain('aria-label="Open search"');

    expect(html).toContain('data-nav-search-panel');
    expect(html).toContain('role="search"');
    expect(html).toContain('aria-label="Site search"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('hidden');
    expect(html).toContain('--search-outer-width: 0px;');

    expect(html).toContain('data-nav-search-input');
    expect(html).toContain('placeholder="Search..."');
  });

  it('renders custom props and open initial state correctly', async () => {
    const html = await renderComponent({
      centerClass: 'center-class',
      class: 'outer-class',
      closeSearchLabel: 'Close site search',
      innerClass: 'inner-class',
      leftClass: 'left-class',
      navItems: [
        { href: '/blog/', label: 'Blog' },
        { href: '/projects/', label: 'Projects' },
      ],
      navLabel: 'Site navigation',
      openSearchLabel: 'Open site search',
      rightClass: 'right-class',
      searchInitiallyOpen: true,
      searchPlaceholder: 'Search articles...',
      searchRegionLabel: 'Header search',
      title: 'My Brand',
    });

    expect(html).toContain('My Brand');
    expect(html).toContain('>Blog<');
    expect(html).toContain('href="/blog/"');
    expect(html).toContain('>Projects<');
    expect(html).toContain('href="/projects/"');

    expect(html).toContain('aria-label="Site navigation"');
    expect(html).toContain('placeholder="Search articles..."');

    expect(html).toContain('data-nav-search-toggle');
    expect(html).toContain('aria-expanded="true"');
    expect(html).toContain('aria-label="Open site search"');

    expect(html).toContain('role="search"');
    expect(html).toContain('aria-label="Header search"');
    expect(html).toContain('aria-hidden="false"');

    expect(html).toContain('data-nav-search-nav');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('inert');

    expect(html).toContain('outer-class');
    expect(html).toContain('inner-class');
    expect(html).toContain('left-class');
    expect(html).toContain('center-class');
    expect(html).toContain('right-class');
  });

  it('renders named slots for all three regions, search, and both icons', async () => {
    const html = await renderComponent(
      {
        closeSearchLabel: 'Close custom search',
        openSearchLabel: 'Open custom search',
      },
      {
        center: `
          <nav aria-label="Custom nav">
            <ul>
              <li><a href="/one/">One</a></li>
              <li><a href="/two/">Two</a></li>
            </ul>
          </nav>
        `,
        left: `
          <a href="/custom-brand/" class="brand-link">
            Custom Brand
          </a>
        `,
        right: `
          <div class="right-wrapper">
            <button
              type="button"
              data-nav-search-toggle
              aria-expanded="false"
              aria-controls="nav-search-test-panel"
              aria-label="Open custom search"
            >
              <span class="sr-only" data-nav-search-toggle-label>Open custom search</span>
              <span class="inline-flex" aria-hidden="true" data-nav-search-icon-open>
                <span>Open Icon Slot</span>
              </span>
              <span class="hidden" aria-hidden="true" data-nav-search-icon-close>
                <span>Close Icon Slot</span>
              </span>
            </button>
          </div>
        `,
        search: `
          <div class="custom-search-shell">
            <label for="custom-search" class="sr-only">Custom search</label>
            <input
              id="custom-search"
              type="search"
              data-nav-search-input
              placeholder="Custom search placeholder"
            />
          </div>
        `,
        'search-close-icon': `<span>Custom close icon slot</span>`,
        'search-open-icon': `<span>Unused open icon slot in custom right region</span>`,
      },
    );

    expect(html).toContain('Custom Brand');
    expect(html).toContain('href="/custom-brand/"');

    expect(html).toContain('aria-label="Custom nav"');
    expect(html).toContain('>One<');
    expect(html).toContain('>Two<');

    expect(html).toContain('class="right-wrapper"');
    expect(html).toContain('Open Icon Slot');
    expect(html).toContain('Close Icon Slot');

    expect(html).toContain('class="custom-search-shell"');
    expect(html).toContain('placeholder="Custom search placeholder"');
    expect(html).toContain('data-nav-search-input');

    expect(html).not.toContain('Placeholder title');
    expect(html).not.toContain('>Home<');
    expect(html).not.toContain('>About<');
    expect(html).not.toContain('>Contact<');
  });

  it('renders icon slots with the default toggle and default panel close button', async () => {
    const html = await renderComponent(
      {},
      {
        'search-close-icon': `<span class="close-slot-icon">Close Symbol</span>`,
        'search-open-icon': `<span class="open-slot-icon">Search Symbol</span>`,
      },
    );

    expect(html).toContain('Search Symbol');
    expect(html).toContain('Close Symbol');

    expect(html).toContain('data-nav-search-icon-open');
    expect(html).toContain('data-nav-search-icon-close');
  });
});
