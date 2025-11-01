import type { CollectionEntry } from 'astro:content';
import { describe, expect, it } from 'vitest';

import {
  createContentObject,
  createEmptyContentObject,
} from './content-object.ts';
import { getContentObject } from './utilities.ts';

describe('content object utils', () => {
  it('creates an empty content object with defaults', () => {
    const empty = createEmptyContentObject();

    expect(empty).toMatchObject({
      content: null,
      description: null,
      meta: {},
      tags: [],
      title: null,
    });
  });

  it('normalizes manual data and overrides fields', () => {
    const content = createContentObject(
      {
        author: '  Alice  ',
        category: 'guides',
        content: 'Manual content',
        description: 'Manual Description',
        meta: { source: 'manual' },
        tags: ['astro', 'astro'],
        title: 'Manual Title',
      },
      { title: 'Override Title' },
    );

    expect(content.title).toBe('Override Title');
    expect(content.description).toBe('Manual Description');
    expect(content.content).toBe('Manual content');
    expect(content.author).toBe('Alice');
    expect(content.category).toBe('guides');
    expect(content.tags).toEqual(['astro']);
    expect(content.meta.source).toBe('manual');
  });

  it('extracts data from collection entries and merges overrides', () => {
    const entry = {
      body: 'Entry body',
      collection: 'blog',
      data: {
        author: ['Alice', 'Bob'],
        cover: { src: '/cover.jpg' },
        date: new Date('2024-01-01T00:00:00.000Z'),
        description: 'Entry Description',
        lastModified: '2024-01-02T00:00:00.000Z',
        summary: 'Entry summary',
        tags: ['astro', 'typescript'],
        title: 'Entry Title',
      },
      id: 'example-entry',
      slug: 'example-entry',
    } as unknown as CollectionEntry<'blog'>;

    const content = createContentObject(entry, {
      tags: ['astro', 'content'],
      title: 'Manual Override',
    });

    expect(content.collection).toBe('blog');
    expect(content.slug).toBe('example-entry');
    expect(content.title).toBe('Manual Override');
    expect(content.description).toBe('Entry Description');
    expect(content.summary).toBe('Entry summary');
    expect(content.date).toBeInstanceOf(Date);
    expect(content.updated).toBeInstanceOf(Date);
    expect(content.author).toEqual(['Alice', 'Bob']);
    expect(content.cover).toEqual({ src: '/cover.jpg' });
    expect(content.tags).toEqual(['astro', 'typescript', 'content']);
  });

  it('collects frontmatter data and manual content', () => {
    const frontmatter = {
      author: { name: 'Carl' },
      cover: '/image.jpg',
      date: '2024-02-01',
      description: 'Frontmatter Description',
      tags: 'astro, content',
      title: 'Frontmatter Title',
    } satisfies Record<string, unknown>;

    const content = createContentObject({
      content: 'Rendered content',
      frontmatter,
      url: '/docs/example/',
    });

    expect(content.title).toBe('Frontmatter Title');
    expect(content.description).toBe('Frontmatter Description');
    expect(content.content).toBe('Rendered content');
    expect(content.date).toBeInstanceOf(Date);
    expect(content.author).toBe('Carl');
    expect(content.tags).toEqual(['astro', 'content']);
    expect(content.cover).toBe('/image.jpg');
    expect(content.url).toBe('/docs/example/');
  });

  it('builds a content object from Astro props', () => {
    const entry = {
      collection: 'blog',
      data: {
        date: '2024-03-01',
        description: 'Entry Description',
        tags: ['astro'],
        title: 'Entry Title',
      },
      id: 'post',
      slug: 'post',
    } as unknown as CollectionEntry<'blog'>;

    const props = {
      frontmatter: {
        summary: 'Frontmatter summary',
      },
      post: entry,
    } satisfies Record<string, unknown>;

    const content = getContentObject(props, { title: 'Final Title' });

    expect(content.collection).toBe('blog');
    expect(content.title).toBe('Final Title');
    expect(content.summary).toBe('Frontmatter summary');
    expect(content.tags).toEqual(['astro']);
  });
});
