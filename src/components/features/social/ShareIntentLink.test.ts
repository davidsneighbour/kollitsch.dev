// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { load } from 'cheerio';
import { expect, it } from 'vitest';
import ShareIntentLink from './ShareIntentLink.astro';

it('renders a normal static share without instance-trigger attributes', async () => {
  const container = await AstroContainer.create();
  const $ = load(
    await container.renderToString(ShareIntentLink, {
      props: {
        share: { url: 'https://example.test/share?text={title}' },
        values: { title: 'A & B' },
      },
      slots: { default: 'Share' },
    }),
  );
  expect($('a').attr('href')).toBe(
    'https://example.test/share?text=A%20%26%20B',
  );
  expect($('a').attr('data-share-intent')).toBeUndefined();
  expect($('a').text().trim()).toBe('Share');
});

it('normalises the configured default for the no-script destination', async () => {
  const container = await AstroContainer.create();
  const $ = load(
    await container.renderToString(ShareIntentLink, {
      props: {
        share: {
          instance: {
            default: 'https://MAS.TO/',
            prompt: 'Choose a server',
            storageKey: 'test_instance',
          },
          url: 'https://{instance}/share?text={title}',
        },
        values: { title: 'Example' },
      },
      slots: { default: 'Share' },
    }),
  );
  expect($('a').attr('href')).toBe('https://mas.to/share?text=Example');
  expect($('a').attr('data-share-intent')).toBe('');
});
