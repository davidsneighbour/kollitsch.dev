import type { CollectionEntry } from 'astro:content';

import fs from 'node:fs';
import path from 'node:path';
import type { ImageMetadata } from 'astro';

import siteinfo from '@data/setup.json';

// @ts-ignore markdown-it has no default export, we no fix upstream issues
import MarkdownIt from 'markdown-it';
import { logDebug } from './helpers';

export function stripMarkup(str: string): string {
  return str.replace(/[#_*~`>[\]()\-!]/g, '').replace(/<\/?[^>]+(>|$)/g, '');
}

export function resolveCover(post: CollectionEntry<'blog'>): CoverObject {
  const md = new MarkdownIt();
  const cover = post.data.cover;

  let src: string | undefined;
  let title: string | undefined;
  let alt: string | undefined;
  let type: 'image' | 'video';

  // @todo we don't need to handle string covers because the schema already returns an object
  if (typeof cover === 'string') {
    src = cover;
    title = post.data.title;
    type = 'image';
  } else {
    src = cover?.src;
    title = cover?.title;
    type = (cover && 'type' in cover ? cover.type : 'image') as
      | 'image'
      | 'video';
  }

  if (!src) {
    src = siteinfo.images.default;
    alt = 'Default header image';
  }

  if (!title && src !== siteinfo.images.default) {
    logDebug(`[PostImage] No title set for image in post "${post.id}".`);
  }

  // alt: markdown/HTML stripped, fallback to title or generic
  alt = stripMarkup(alt ?? title ?? 'Image');

  // @todo generate a default title if none is provided or skip this step
  title = md.renderInline(title ?? '');

  return { src, alt, title, type };
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
 * Resolve an Astro-compatible image metadata object, falling back when missing.
 *
 * * Accepts an absolute image path key (must start with '/src/...') as used in the glob import.
 * * Looks up the `imageMap` generated via `import.meta.glob` for a matching entry.
 * * Returns the `default` export of the found entry as `ImageMetadata`.
 * * If no entry is found, logs a debug message and returns the configured fallback image.
 *
 * @param path - The absolute asset path key to look up (e.g., '/src/content/blog/my-img.jpg').
 * @returns The matching `ImageMetadata` object, or the fallback image metadata.
 */
export function resolveAstroImage(path: ImagePath): ImageMetadata {
  const entry = imageMap[path];
  if (entry?.default) return entry.default;

  logDebug(
    `[resolveAstroImage] Missing image: ${path} → using fallback from ${siteinfo.images.default}`,
  );
  return fallbackImage!;
}
