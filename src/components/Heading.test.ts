// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Heading from './Heading.astro';

test('Heading renders correct level & title', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Heading, {
    props: { title: 'Test Title', level: 4, description: 'desc' },
  });
  expect(html).toContain('<h4');
  expect(html).toContain('Test Title');
});

test('Heading levels clamped to h6 and h1', async () => {
  const container = await AstroContainer.create();
  let html = await container.renderToString(Heading, {
    props: { title: 'Too High', level: 99 },
  });
  expect(html).toContain('<h6');
  html = await container.renderToString(Heading, {
    props: { title: 'Too Low', level: 0 },
  });
  expect(html).toContain('<h1');
});

test('Defaults to h1 when no level is provided', async () => {
  const container = await AstroContainer.create();
  let html = await container.renderToString(Heading, {
    props: { title: 'Default Heading' },
  });
  expect(html).toContain('<h1');
});
