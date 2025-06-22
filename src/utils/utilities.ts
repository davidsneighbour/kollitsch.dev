import type { CollectionEntry } from 'astro:content';

import fs from 'node:fs';
import path from 'node:path';
import type { ImageMetadata } from 'astro';

import siteinfo from '@data/setup.json';

import MarkdownIt from 'markdown-it';

type ImagePath = string;

export interface CoverImage {
  src: string;
  alt: string;
  title?: string | undefined;
}

const md = new MarkdownIt();

export function stripMarkup(str: string): string {
  return str.replace(/[#_*~`>[\]()\-!]/g, '').replace(/<\/?[^>]+(>|$)/g, '');
}

export function resolveCoverImage(post: CollectionEntry<'blog'>): CoverImage {
  const cover = post.data.cover;
  let src;
  let title;
  let alt;

  // @todo we don't need to handle string covers because the schema already returns an object
  if (typeof cover === 'string') {
    src = cover;
    title = post.data.title;
  } else {
    src = cover?.src;
    title = cover?.title;
  }

  if (!src) {
    src = siteinfo.images.default;
    alt = 'Default header image';
  }

  if (!title && src !== siteinfo.images.default) {
    console.warn(`[PostImage] No title set for image in post "${post.id}".`);
  }

  // alt: markdown/HTML stripped, fallback to title or generic
  alt = stripMarkup(alt ?? title ?? 'Image');

  // @todo generate a default title if none is provided or skip this step
  title = md.renderInline(title ?? '');

  return { src, alt, title };
}

/**
 * Resolve the correct image path for a given entry.
 *
 * @param imageName - The image filename from frontmatter
 * @param entryId - The _id of the entry (e.g., my-post/index.md)
 * @param collection - The name of the content collection (defaults to 'blog')
 * @returns A relative path string to the image if found, or null
 */
export function resolveImagePath(
  imageName: string,
  entryId: string,
  collection = 'blog',
): string | null {
  if (!imageName || typeof imageName !== 'string') return null;

  const localDir = path.join('src/content', collection, entryId);
  const localImagePath = path.join(localDir, imageName);
  const globalImagePath = path.join('src/assets/images', imageName);

  if (fs.existsSync(localImagePath)) {
    return `/${localImagePath.replace(/\\/g, '/')}`;
  }

  if (fs.existsSync(globalImagePath)) {
    return `/src/assets/images/${imageName}`;
  }

  return `${siteinfo.images.default}`;
}

const imageMap = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/**/*.{jpg,png,webp,avif}',
  {
    eager: true,
  },
);

// Statically import all fallback candidates
const fallbackCandidates = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,png,webp,avif}',
  {
    eager: true,
  },
);

const fallbackImage =
  fallbackCandidates[siteinfo.images.default]?.default || null;

/**
 * Resolves an Astro-compatible image metadata object.
 * Falls back to the configured fallback image if the given path is missing.
 *
 * @param path - Absolute path starting with `/src/...`
 * @returns ImageMetadata (from original or fallback)
 */
export function resolveAstroImage(path: ImagePath): ImageMetadata {
  const entry = imageMap[path];
  if (entry?.default) return entry.default;

  console.warn(
    `[resolveAstroImage] Missing image: ${path} → using fallback from ${siteinfo.images.default}`,
  );
  return fallbackImage!;
}
