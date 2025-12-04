import type { Release } from '@utils/releases';
import { experimental_AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import ReleaseCard from './ReleaseCard.astro';

let container: Awaited<ReturnType<typeof experimental_AstroContainer.create>>;

beforeAll(async () => {
  container = await experimental_AstroContainer.create();
});

describe('ReleaseCard', () => {
  it('renders release details and HTML description', async () => {
    const release: Release = {
      descriptionHTML: '<p>Details about the release</p>',
      name: 'Test Release',
      publishedAt: '2024-01-02T00:00:00.000Z',
      tag: 'v1.2.3',
      year: 2024,
    };

    const html = await container.renderToString(ReleaseCard, {
      props: { release },
    });
    const dom = new DOMParser().parseFromString(String(html), 'text/html');

    expect(dom.querySelector('h2')?.textContent).toBe(release.name);
    expect(dom.querySelector('.text-sm')?.textContent).toBe(
      new Date(release.publishedAt).toUTCString(),
    );
    expect(dom.querySelector('p')?.textContent).toBe(
      'Details about the release',
    );
  });
});
