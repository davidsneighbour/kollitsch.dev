// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { load } from 'cheerio';
import { describe, expect, it } from 'vitest';
import FeedReader from './FeedReader.astro';

describe('FeedReader', () => {
  it('renders defaults for label, description, and feed cards', async () => {
    const container = await AstroContainer.create();
    const html = await container.renderToString(FeedReader);
    const $ = load(html);

    const heading = $('h3');
    expect(heading.text().trim()).toBe('Follower Feeds');

    const description = $('#follower-feeds-description');
    expect(description.text().trim()).toBe(
      "Read an eclectic selection of Patrick's reading",
    );
    expect(heading.attr('aria-describedby')).toBe('follower-feeds-description');

    const cards = $('a');
    expect(cards).toHaveLength(2);

    const webCard = $('a').filter((_, el) =>
      $(el).text().includes('Web, Tech & Development'),
    );
    expect(webCard).toHaveLength(1);
    expect(webCard.attr('href')).toBe(
      'https://kollitsch.dev/dnb-webdev.rss.xml',
    );
    expect(webCard.attr('target')).toBe('_blank');
    expect(webCard.attr('rel')).toBe('noopener noreferrer');
    expect(webCard.find('img').attr('alt')).toBe(
      'Web, Tech and Development feed',
    );

    const thisCard = $('a').filter((_, el) =>
      $(el).text().includes('This & That'),
    );
    expect(thisCard).toHaveLength(1);
    expect(thisCard.attr('href')).toBe(
      'https://kollitsch.dev/dnb-entertainment.rss.xml',
    );
    expect(thisCard.attr('target')).toBe('_blank');
    expect(thisCard.attr('rel')).toBe('noopener noreferrer');
    expect(thisCard.find('img').attr('alt')).toBe('This & That feed');
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
    expect($('#follower-feeds-description').text().trim()).toBe(
      'Custom description for feeds',
    );

    const links = $('a')
      .map((_, el) => $(el).attr('href'))
      .get();

    expect(links).toEqual([
      'https://example.com/web',
      'https://example.com/this',
    ]);
  });
});
