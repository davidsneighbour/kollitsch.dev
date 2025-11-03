import type { CollectionEntry } from 'astro:content';
import { describe, expect, expectTypeOf, it } from 'vitest';

import {
  createContentObject,
  createEmptyContentObject,
} from './content-object.ts';

describe('createEmptyContentObject', () => {
  it('returns independent objects with pristine defaults', () => {
    const first = createEmptyContentObject();
    const second = createEmptyContentObject();

    expect(first).not.toBe(second);
    expect(first.meta).toEqual({});
    expect(second.meta).toEqual({});
    expect(first.meta).not.toBe(second.meta);
    expect(first.tags).toEqual([]);
    expect(second.tags).toEqual([]);
    expect(first.tags).not.toBe(second.tags);
    expect(first.author).toBeNull();
    expect(first.title).toBeNull();
  });
});

describe('createContentObject', () => {
  it('normalizes collection entries, frontmatter, and overrides', () => {
    const entry = {
      body: 'Entry body',
      collection: 'blog',
      data: {
        authors: [
          { fullName: '  Ada Lovelace ' },
          { name: ' Bob Example ' },
          { name: '' },
        ],
        excerpt: '  ...  ',
        heroImage: { src: '/entry-hero.jpg' },
        lastModified: '2024-06-01T00:00:00Z',
        summary: ' Entry summary ',
        tags: [' astro ', { name: 'content ' }],
        title: 'Entry Title',
      },
      id: 'entry-id',
      slug: 'custom-slug',
    } as unknown as CollectionEntry<'blog'>;

    const overrides = {
      cover: null,
      data: { description: '  Data description ' },
      frontmatter: {
        category: '   guides ',
        cover: '  /front.jpg  ',
        permalink: '  /permalink/  ',
        publishedAt: '2024-05-01T00:00:00Z',
      },
      meta: { source: 'override' },
      readingTime: ' 10 minutes ',
      tags: ['astro', 'astro', ' content '],
      title: '  Manual Title  ',
    } satisfies Record<string, unknown>;

    const content = createContentObject(entry, overrides);

    expect(content.collection).toBe('blog');
    expect(content.id).toBe('entry-id');
    expect(content.slug).toBe('custom-slug');
    expect(content.title).toBe('Manual Title');
    expect(content.description).toBe('Data description');
    expect(content.summary).toBe('Entry summary');
    expect(content.excerpt).toBe('...');
    expect(content.content).toBe('Entry body');
    expect(content.category).toBe('guides');
    expect(content.url).toBe('/permalink/');
    expect(content.date?.toISOString()).toBe('2024-05-01T00:00:00.000Z');
    expect(content.updated?.toISOString()).toBe('2024-06-01T00:00:00.000Z');
    expect(content.cover).toBeNull();
    expect(content.tags).toEqual(['astro', 'content']);
    expect(content.tags).not.toBe(overrides.tags);
    expect(content.author).toEqual(['Ada Lovelace', 'Bob Example']);
    expect(content.readingTime).toBe('10 minutes');
    expect(content.meta.collection).toBe('blog');
    expect(content.meta.source).toBe('override');
    expect(content.meta.publishedAt).toBe('2024-05-01T00:00:00Z');
    expect(content.meta).not.toBe(overrides.meta);
  });

  it('normalizes plain records and ignores unsupported inputs', () => {
    const manual = {
      author: '  Grace Hopper  ',
      coverImage: '  /cover.jpg ',
      image: '   ',
      keywords: 'alpha, beta',
      meta: { shouldIgnore: true },
      publishDate: 1714000000000,
      reading_time: 7,
      tags: 42,
      updated: new Date('2024-04-02T00:00:00Z'),
    } satisfies Record<string, unknown>;

    const result = createContentObject(
      manual,
      { byline: { name: '  Inline Name ' } },
      null,
      undefined,
      42 as unknown as CollectionEntry<'misc'>,
    );

    expect(result.author).toBe('Inline Name');
    expect(result.date?.getTime()).toBe(1714000000000);
    expect(result.updated?.toISOString()).toBe('2024-04-02T00:00:00.000Z');
    expect(result.cover).toBe('/cover.jpg');
    expect(result.readingTime).toBe(7);
    expect(result.tags).toEqual(['alpha', 'beta']);
    expect(result.meta.shouldIgnore).toBe(true);
    expect(manual.meta).toEqual({ shouldIgnore: true });
  });

  it('falls back to null when authors cannot be resolved', () => {
    const content = createContentObject({
      authors: ['  ', null] as unknown[],
    });

    expect(content.author).toBeNull();
  });

  it('compacts single author arrays to a string', () => {
    const content = createContentObject({
      authors: ['  Single Author '],
    });

    expect(content.author).toBe('Single Author');
  });

  it('matches expected TypeScript surface area', () => {
    const empty = createEmptyContentObject();
    const merged = createContentObject({ title: 'Example' });

    expectTypeOf(empty).toEqualTypeOf(merged);
    expectTypeOf(merged.tags).toEqualTypeOf<string[]>();
    expectTypeOf(merged.meta).toEqualTypeOf<Record<string, unknown>>();

    // @ts-expect-error - booleans are not valid content sources
    createContentObject(true);
  });
});
