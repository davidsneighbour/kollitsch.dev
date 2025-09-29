// Server-only image index for local assets and content images.
// Do not import from browser code or hydrated islands.

import type { ImageMetadata } from 'astro';

/**
 * Guard: ensure this file never lands in the client bundle.
 * Throws during client bundling to surface accidental imports.
 */
if (!import.meta.env.SSR) {
  throw new Error('image-index.ts must not run in the browser bundle.');
}

/**
 * Glob all supported local images.
 * Keys are project-absolute like '/src/assets/images/foo.jpg'.
 * Note: globs must be literal strings so Vite can statically analyze them.
 */
const contentImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/content/**/*.{png,jpg,jpeg,webp,avif,gif}',
  { eager: true },
);

const assetImages = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/images/**/*.{png,jpg,jpeg,webp,avif,gif}',
  { eager: true },
);

/**
 * Project-absolute key -> ImageMetadata
 * The single source of truth for local images.
 */
const index: Record<string, ImageMetadata> = {};
for (const [key, mod] of Object.entries({ ...contentImages, ...assetImages })) {
  index[key] = mod.default;
}

if (import.meta.env.DEV) {
  console.log(`[image-index] Indexed ${Object.keys(index).length} images.`);
}

/**
 * Get ImageMetadata for a project-absolute key.
 * @param key Project-absolute path like '/src/.../file.ext'
 * @returns ImageMetadata or undefined if the key is not indexed
 * @example
 * const meta = getImageMeta('/src/assets/images/logo.png');
 */
export function getImageMeta(key: string): ImageMetadata | undefined {
  return index[key];
}

/**
 * Check presence of a key in the index.
 * @param key Project-absolute path like '/src/.../file.ext'
 * @returns true if the key is indexed
 * @example
 * if (hasImage(k)) { /* ... *\/ }
 */
export function hasImage(key: string): boolean {
  return Object.hasOwn(index, key);
}

/**
 * Readonly view of the full index.
 * Useful for diagnostics; avoid iterating at runtime on large sites.
 */
export const imageIndex: Readonly<Record<string, ImageMetadata>> = index;
