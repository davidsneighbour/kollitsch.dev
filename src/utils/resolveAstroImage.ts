import siteinfo from '@data/setup.json';
import type { ImageMetadata } from 'astro';

type ImagePath = string;

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

const fallbackImage = fallbackCandidates[siteinfo.fallback]?.default || null;

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
    `[resolveAstroImage] Missing image: ${path} → using fallback from ${siteinfo.fallback}`,
  );
  return fallbackImage!;
}
