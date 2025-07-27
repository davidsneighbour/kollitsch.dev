// import types
import type { CollectionEntry } from 'astro:content';

// import libraries
import { z } from 'astro:content';
import fs from 'node:fs';
import path from 'node:path';
// import data
import setup from '@data/setup.json';

// import utilities
import { log } from '@utils/debug';
import MarkdownIt from 'markdown-it';

/**
 * CoverObject interface defines the structure for cover elements in posts.
 * Currently just image source, alternative text, and an optional title.
 *
 * @todo type: undefined should be type: image by default?
 */
interface CoverObject {
  src: string;
  alt: string;
  title?: string | undefined;
  type: 'image' | 'video';
  video?: { artist: string; title: string; youtube: string; };
}

/**
 * ImagePath type definition.
 */
const imagePathSchema = z.string().regex(/^\.?\/.*\.(png|jpe?g|webp|avif)$/);
type ImagePath = z.infer<typeof imagePathSchema>;

/** defines a map of images within the content directory */
const imageMap = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/**/*.{jpg,png,webp,avif}',
  {
    eager: true,
  },
);

/** defines a map of images within the assets directory */
const fallbackCandidates = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{jpg,png,webp,avif}',
  {
    eager: true,
  },
);

/**
 * the default image to use when no other image is found
 */
export const fallbackImage =
  fallbackCandidates[setup.images.default]?.default || null;

/**
 * Returns a CoverObject for the given post.
 *
 * @export
 * @param {CollectionEntry<'blog'>} post
 * @return {*}  {CoverObject}
 */
export function resolveCover(post: CollectionEntry<'blog'>): CoverObject {
  const md = new MarkdownIt();
  const cover = post.data.cover!;

  // log.debug(fallbackImage, fallbackCandidates[setup.images.default]);

  let src: string | undefined;
  let title: string | undefined;
  let alt: string | undefined;
  let type: 'image' | 'video';

  // retrieving cover properties
  src = cover?.src;
  title = cover?.title;
  type = (cover && 'type' in cover ? cover.type : 'image') as 'image' | 'video';

  // before building the return object:
  if (type === 'video' && cover.video) {
    return {
      type,
      src, // still keep image fallback or preview if needed
      alt: stripMarkup(cover.video.title),
      title: undefined,
      video: {
        artist: cover.video.artist,
        title: cover.video.title,
        youtube: cover.video.youtube,
      },
    };
  }

  if (!src) {
    src = setup.images.default;
    alt = 'Default header image';
  }

  const parsed = imagePathSchema.safeParse(src);
  if (!parsed.success) {
    console.error('Invalid image path');
  }

  if (!title && src !== setup.images.default) {
    log.debug(`[PostImage] No 'title' set for image in post "${post.id}".`);
  }

  // alt: markdown/HTML stripped, fallback to title or generic
  alt = stripMarkup(alt ?? title ?? 'Image');

  // @todo generate a default title if none is provided or skip this step
  title = md.renderInline(title ?? '');

  return { alt, src, title, type };
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

  return `${setup.images.default}`;
}

/**
 * Resolve an Astro-compatible image metadata object, falling back when missing.
 *
 * Accepts an absolute image path key (must start with '/src/...') as used in the glob import.
 * Looks up the `imageMap` generated via `import.meta.glob` for a matching entry.
 * Returns the `default` export of the found entry as `ImageMetadata`.
 * If no entry is found, logs a debug message and returns the configured fallback image.
 *
 * @param path - The absolute asset path key to look up (e.g., '/src/content/blog/my-img.jpg').
 * @returns The matching `ImageMetadata` object, or the fallback image metadata.
 */
export function resolveAstroImage(path: ImagePath): ImageMetadata {
  const entry = imageMap[path];
  if (entry?.default) return entry.default;

  log.debug(
    `[resolveAstroImage] Missing image: ${path} → using fallback from ${setup.images.default}`,
  );
  return fallbackImage as ImageMetadata;
}

export function stripMarkup(str: string): string {
  return str.replace(/[#_*~`>[\]()\-!]/g, '').replace(/<\/?[^>]+(>|$)/g, '');
}
