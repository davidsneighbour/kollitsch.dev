// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import ColorGrid from './ColorGrid.astro';

describe('ColorGrid', () => {
  it('renders one labelled swatch for each colour', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(ColorGrid, {
      props: {
        colors: ['#ffbe98', 'rgb(255, 190, 152)', 'hsl(22deg, 100%, 80%)'],
      },
    });
    const $ = load(html);

    expect($('figure')).toHaveLength(3);
    expect(
      $('figcaption')
        .map((_, el) => $(el).text().trim())
        .get(),
    ).toEqual(['#ffbe98', 'rgb(255, 190, 152)', 'hsl(22deg, 100%, 80%)']);
  });
});
