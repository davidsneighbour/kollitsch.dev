/**
 * Shared cover-image-key resolution for social images.
 *
 * Single implementation reused by OpenGraphImage.astro (Astro-side,
 * `exists` backed by the Vite image index), feed generation, and
 * build-og-images.ts (CLI, `exists` backed by the filesystem) — avoids the
 * hash/resolution logic drifting between the three, per
 * scratch/og-image-generation.plan.md ("Centralise OG image logic").
 */

import { resolveImageKeyCore } from './resolve-image-key.ts';

type CoverField = { type?: unknown; src?: unknown };

export interface PostImageIdentity {
  id?: string | undefined;
  collection?: string | undefined;
  cover?: CoverField | string | null | undefined;
}

/**
 * Resolve the cover image key used as a social-image background.
 * Returns '' when the post has no usable content identity (id + collection).
 */
export function resolveCoverImageKey(
  image: PostImageIdentity | undefined,
  exists: (key: string) => boolean,
  defaultArticleImageKey: string,
  ogFallbackKey: string,
): string {
  const hasContentIdentity =
    typeof image?.id === 'string' &&
    image.id.length > 0 &&
    typeof image?.collection === 'string' &&
    image.collection.length > 0;

  if (!hasContentIdentity) return '';

  const rawCover = image?.cover;
  const cover: CoverField =
    rawCover && typeof rawCover === 'object' ? (rawCover as CoverField) : {};
  const coverType = typeof cover.type === 'string' ? cover.type : 'image';

  const defaultKeyMaybe =
    (defaultArticleImageKey || ogFallbackKey || '').trim() || undefined;

  const rawSrc =
    typeof rawCover === 'string'
      ? rawCover
      : typeof cover.src === 'string'
        ? cover.src
        : undefined;

  const { resolved } = resolveImageKeyCore(
    coverType !== 'video' ? rawSrc : undefined,
    image?.id ?? '',
    image?.collection ?? '',
    exists,
    defaultKeyMaybe !== undefined ? { defaultKey: defaultKeyMaybe } : {},
  );

  return resolved;
}

/**
 * Build the ordered list of background-image candidates: the post's own
 * cover, then the site default article image, then the site OG fallback —
 * deduplicated, empty values dropped.
 */
export function backgroundImageCandidates(
  resolvedArticleImageKey: string,
  defaultArticleImageKey: string,
  ogFallbackKey: string,
): string[] {
  return [
    resolvedArticleImageKey,
    defaultArticleImageKey,
    ogFallbackKey,
  ].filter((v, i, a): v is string => Boolean(v) && a.indexOf(v) === i);
}
