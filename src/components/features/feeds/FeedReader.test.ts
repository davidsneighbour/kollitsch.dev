// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import FeedReader from './FeedReader.astro';

// TODO: Future refactors
// - [ ] Revisit layout structure for feed tiles
// - [ ] Review image asset handling and loading strategy

describe('FeedReader', () => {
  it('renders defaults for label, description, and feed tiles', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(FeedReader);
    const $ = load(html);

    const heading = $('h3');
    expect(heading.text().trim()).toBe('Feed Reader');
    expect(heading.attr('title')).toBe(
      "Read an eclectic selection of Patrick's reading",
    );

    const webTile = $("a[aria-label='Open the Web, Tech & Development feed']");
    expect(webTile).toHaveLength(1);
    expect(webTile.attr('href')).toBe(
      'https://feedly.com/f/0HetQ6aL9keke3b0TDbK3Lon',
    );
    expect(webTile.attr('target')).toBe('_newfeed');
    expect(webTile.find('img').attr('alt')).toBe(
      'Web, Tech and Development feed',
    );

    const thisTile = $("a[aria-label='Open the This & That feed']");
    expect(thisTile).toHaveLength(1);
    expect(thisTile.attr('href')).toBe(
      'https://feedly.com/f/x5VFmEUFdCxV64dLi62eJ4xV',
    );
    expect(thisTile.attr('target')).toBe('_newfeed');
    expect(thisTile.find('img').attr('alt')).toBe('This & That feed');
  });

  it('accepts custom copy and URLs', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(FeedReader, {
      props: {
        description: 'Custom description for feeds',
        label: 'Custom Label',
        linkThisAndThat: 'https://example.com/this',
        linkWebTech: 'https://example.com/web',
      },
    });
    const $ = load(html);

    const heading = $('h3');
    expect(heading.text().trim()).toBe('Custom Label');
    expect(heading.attr('title')).toBe('Custom description for feeds');

    expect(
      $("a[aria-label='Open the Web, Tech & Development feed']").attr('href'),
    ).toBe('https://example.com/web');
    expect($("a[aria-label='Open the This & That feed']").attr('href')).toBe(
      'https://example.com/this',
    );
  });
});
