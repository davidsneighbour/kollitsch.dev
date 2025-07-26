import type { CollectionEntry } from 'astro:content';

type BlogPost = CollectionEntry<'blog'>;

export type CoverData = BlogPost['data']['cover'];
