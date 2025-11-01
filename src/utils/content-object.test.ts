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
      title: null,
      description: null,
      content: null,
      tags: [],
      meta: {},
    });
  });

  it('normalizes manual data and overrides fields', () => {
    const content = createContentObject(
      {
        title: 'Manual Title',
        description: 'Manual Description',
        tags: ['astro', 'astro'],
        author: '  Alice  ',
        category: 'guides',
        content: 'Manual content',
        meta: { source: 'manual' },
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
      id: 'example-entry',
      slug: 'example-entry',
      collection: 'blog',
      body: 'Entry body',
      data: {
        title: 'Entry Title',
        description: 'Entry Description',
        summary: 'Entry summary',
        date: new Date('2024-01-01T00:00:00.000Z'),
        lastModified: '2024-01-02T00:00:00.000Z',
        tags: ['astro', 'typescript'],
        author: ['Alice', 'Bob'],
        cover: { src: '/cover.jpg' },
      },
    } as unknown as CollectionEntry<'blog'>;

    const content = createContentObject(entry, {
      title: 'Manual Override',
      tags: ['astro', 'content'],
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
      title: 'Frontmatter Title',
      description: 'Frontmatter Description',
      tags: 'astro, content',
      author: { name: 'Carl' },
      date: '2024-02-01',
      cover: '/image.jpg',
    } satisfies Record<string, unknown>;

    const content = createContentObject({
      frontmatter,
      content: 'Rendered content',
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
      id: 'post',
      slug: 'post',
      collection: 'blog',
      data: {
        title: 'Entry Title',
        description: 'Entry Description',
        date: '2024-03-01',
        tags: ['astro'],
      },
    } as unknown as CollectionEntry<'blog'>;

    const props = {
      post: entry,
      frontmatter: {
        summary: 'Frontmatter summary',
      },
    } satisfies Record<string, unknown>;

    const content = getContentObject(props, { title: 'Final Title' });

    expect(content.collection).toBe('blog');
    expect(content.title).toBe('Final Title');
    expect(content.summary).toBe('Frontmatter summary');
    expect(content.tags).toEqual(['astro']);
  });
});

