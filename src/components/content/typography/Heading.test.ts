// @vitest-environment node

import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { load } from 'cheerio';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { expect, test } from 'vitest';
import Heading from './Heading.astro';

test('Heading renders correct level & title', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Heading, {
    props: { description: 'desc', level: 4 },
    slots: {
      default: 'Test Title',
    },
  });
  expect(html).toContain('<h4');
  expect(html).toContain('Test Title');
  expect(html).toContain('title="desc"');
});

test('Heading levels clamped to h6 and h1', async () => {
  const container = await AstroContainer.create();
  let html = await container.renderToString(Heading, {
    props: { level: 99 },
    slots: {
      default: 'Too High',
    },
  });
  expect(html).toContain('<h6');
  html = await container.renderToString(Heading, {
    props: { level: 0 },
    slots: {
      default: 'Too Low',
    },
  });
  expect(html).toContain('<h1');
});

test('Defaults to h1 when no level is provided', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Heading, {
    slots: {
      default: 'Default Heading',
    },
  });
  expect(html).toContain('<h1');
});

test('Omits title attribute if description is empty', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Heading, {
    slots: {
      default: 'No Description',
    },
  });
  expect(html).toContain('<h1');
  expect(html).not.toContain('title=');
});

test('Omits class attribute if classname is empty', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Heading, {
    slots: {
      default: 'No Class',
    },
  });
  expect(html).toContain('<h1');
  expect(html).not.toContain('class=');
});

test('Wraps title with <a> if link is provided', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Heading, {
    props: { link: '/somewhere' },
    slots: {
      default: 'Linked Title',
    },
  });
  expect(html.replace(/\s+/g, ' ')).toMatch(
    /<h1>\s*<a[^>]*href="\/somewhere"[^>]*>\s*Linked Title\s*<\/a>\s*<\/h1>/,
  );

  //expect(html).toMatch(/<h1><a [^>]*href="\/somewhere"[^>]*>Linked Title<\/a><\/h1>/);
});

// @todo check this and previous test and consolidate
test('Wraps title with <a> if link is provided', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Heading, {
    props: { link: '/somewhere' },
    slots: {
      default: 'Linked Title',
    },
  });

  const $ = load(html);
  const h1 = $('h1');
  const a = h1.find('a');

  expect(h1).toHaveLength(1);
  expect(a).toHaveLength(1);
  expect(a.attr('href')).toBe('/somewhere');
  expect(a.text().trim()).toBe('Linked Title');
});

test('exports a Props interface/type', async () => {
  const testDir = path.dirname(fileURLToPath(import.meta.url));
  const componentPath = path.join(testDir, 'Heading.astro');

  const src = await fs.readFile(componentPath, 'utf8');

  const regex = /export\s+(?:interface|type)\s+[A-Za-z0-9_]*Props\b/;
  expect(regex.test(src)).toBe(true);
});
