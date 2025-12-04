import { experimental_AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import Pagination from './Pagination.astro';

let container: Awaited<ReturnType<typeof experimental_AstroContainer.create>>;

beforeAll(async () => {
  container = await experimental_AstroContainer.create();
});

describe('Pagination', () => {
  it('renders static pagination scaffold with accessibility helpers', async () => {
    const html = await container.renderToString(Pagination);
    const dom = new DOMParser().parseFromString(String(html), 'text/html');

    const nav = dom.querySelector('nav');
    expect(nav?.getAttribute('aria-label')).toBe('Pagination');

    const labels = Array.from(dom.querySelectorAll('a, span'))
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    expect(labels).toEqual(
      [
        'Previous',
        'Next',
        'Showing',
        '1',
        'to',
        '10',
        'of',
        '97',
        'results',
        'Previous',
        '1',
        '2',
        '3',
        '...',
        '8',
        '9',
        '10',
        'Next',
      ].filter(Boolean),
    );

    const srOnlyTexts = Array.from(dom.querySelectorAll('.sr-only'))
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    expect(srOnlyTexts).toEqual(['Previous', 'Next']);

    // TODO:
    // - Update this test when pagination becomes dynamic.
    // - Confirm integration points once release paging is wired up to data.
    // - Verify page/prev/next URLs when real links are introduced.
  });
});
