import { getImage } from 'astro:assets';
import rawSetup from '@data/setup.json' with { type: 'json' };
import { getImageMeta, hasImage } from '@utils/image-index.ts';
import { resolveImageKeyCore } from '@utils/social-image/resolve-image-key.ts';
import type { GetImageResult, ImageMetadata } from 'astro';
import { createLogger } from './logger.ts';

interface SetupConfig {
  title?: string;
  author?: { name?: string };
  images?: { opengraph?: string; default?: string };
}
const setup: SetupConfig = rawSetup as unknown as SetupConfig;

export const siteTitle: string = setup.title ?? '';
export const siteAuthorName: string = setup.author?.name ?? '';
export const siteDefaultImageKey: string = (setup.images?.default ?? '').trim();
export const siteOgImageKey: string = (setup.images?.opengraph ?? '').trim();

const log = createLogger({ slug: 'opengraph' });

export type PostLike = {
  id: string;
  collection: string;
  data: { articleimage?: string | null | undefined };
};

export interface OgImageOptions {
  width?: number; // default 1200
  height?: number; // default 630
  quality?: number; // default 90
  format?: 'jpeg' | 'png' | 'webp' | 'avif'; // default 'jpeg'
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'; // default 'cover'
  position?: string; // 'center', 'left top', etc.
}

const isRemoteUrl = (s: string) => /^https?:\/\//i.test(s);

export interface ResolveImageKeyOptions {
  defaultKey?: string; // default from setup.images.opengraph
  assetsDir?: string; // '/src/assets/images'
  contentRoot?: string; // '/src/content'
  warnOnFallback?: boolean; // default true
}

/**
 * Resolve a post image name to either a local project key or a remote URL.
 * Order:
 * 1) Remote URL -> return
 * 2) '/src/...' -> return if indexed
 * 3) '/...' -> map to '/src/...' and return if indexed
 * 4) Beside entry directory
 * 5) Global assets directory
 * 6) Fallback (setup.images.opengraph or provided defaultKey)
 *
 * Never throws; always returns a string. In dev, logs keys tried on miss.
 *
 * @param imageName Name from frontmatter (basename or path)
 * @param entryId Content entry id without extension or with (both supported)
 * @param collection Content collection name
 * @returns '/src/.../file.ext' or a remote URL or the fallback
 * @example
 * const key = resolveImageKey('cover.jpg', '2025/slug', 'blog');
 */
export function resolveImageKey(
  imageName: string | undefined | null,
  entryId: string,
  collection: string,
  {
    defaultKey = (setup.images?.opengraph ?? '').trim(),
    assetsDir = '/src/assets/images',
    contentRoot = '/src/content',
    warnOnFallback = true,
  }: ResolveImageKeyOptions = {},
): string {
  const { resolved, tried, usedFallback } = resolveImageKeyCore(
    imageName,
    entryId,
    collection,
    hasImage,
    { assetsDir, contentRoot, defaultKey },
  );

  if (!resolved && tried.length === 0) {
    if (warnOnFallback)
      log.warn('[resolveImageKey] No imageName and no defaultKey configured.');
    return '';
  }

  if (usedFallback && import.meta.env.DEV) {
    log.warn(
      `[resolveImageKey] Missed all candidates for '${collection}:${entryId}'. Tried:\n` +
        tried
          .map((k) => ` - ${k} ${hasImage(k) ? '(found)' : '(missing)'}`)
          .join('\n') +
        `\n→ Falling back to: ${resolved}`,
    );
  }

  return resolved;
}

/**
 * Generate a sized Open Graph image from a resolved key or remote URL.
 * Local keys use ImageMetadata from the index. Remote URLs require image.remotePatterns.
 *
 * @param keyOrUrl '/src/.../file.ext' or remote URL
 * @param opts Size/format options
 * @returns astro:assets GetImageResult
 * @example
 * const og = await getOpenGraphImageFromKey(key, { width: 1200, height: 630 });
 */
export async function getOpenGraphImageFromKey(
  keyOrUrl: string,
  opts: OgImageOptions = {},
): Promise<GetImageResult> {
  const {
    width = 1200,
    height = 630,
    quality = 90,
    format = 'jpeg',
    fit = 'cover',
    position = 'center',
  } = opts;

  if (!keyOrUrl) {
    throw new Error('[getOpenGraphImageFromKey] Empty key/URL.');
  }

  if (isRemoteUrl(keyOrUrl)) {
    return getImage({
      fit,
      format,
      height,
      position,
      quality,
      src: keyOrUrl,
      width,
    });
  }

  const meta: ImageMetadata | undefined = await getImageMeta(keyOrUrl);
  if (!meta) {
    throw new Error(
      `[getOpenGraphImageFromKey] Image not indexed: ${keyOrUrl}`,
    );
  }

  return getImage({ fit, format, height, position, quality, src: meta, width });
}

/**
 * Convenience: resolve from a PostLike and then generate the image.
 * @param post Post-like object with id, collection, data.articleimage?
 * @param opts Size/format options
 * @returns astro:assets GetImageResult
 * @example
 * const og = await getOpenGraphImage(post);
 */
export async function getOpenGraphImage(
  post: PostLike,
  opts: OgImageOptions = {},
): Promise<GetImageResult> {
  const key = resolveImageKey(
    post?.data?.articleimage,
    post.id,
    post.collection,
  );
  if (import.meta.env.DEV) {
    log.debug(`[opengraph] Resolved OG image for '${post.id}': ${key}`);
  }
  return getOpenGraphImageFromKey(key, opts);
}
