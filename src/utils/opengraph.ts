import { getImage } from 'astro:assets';
import path from 'node:path';
import rawSetup from '@data/setup.json' with { type: 'json' };
import { getImageMeta, hasImage } from '@utils/image-index.ts';
import type { GetImageResult, ImageMetadata } from 'astro';
import { createLogger } from './logger.ts';

interface SetupConfig {
  images?: { opengraph?: string };
}
const setup: SetupConfig = rawSetup as unknown as SetupConfig;

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

const toPosix = (p: string) => p.replace(/\\/g, '/');
const isRemoteUrl = (s: string) => /^https?:\/\//i.test(s);
const hasExt = (p: string) => /\.[a-z0-9]+$/i.test(p);

/**
 * Build '/src/content/<collection>/<dir-of-entry>'.
 * - '2025/slug' -> '/src/content/<collection>/2025/slug'
 * - '2025/slug/index' -> '/src/content/<collection>/2025/slug'
 * - '2025/slug.md' -> '/src/content/<collection>/2025'
 */
function contentDirFromId(entryId: string, collection: string): string {
  const base = '/src/content/' + collection;
  const rel = entryId.startsWith('/') ? entryId.slice(1) : entryId;
  const dir =
    hasExt(rel) || rel.endsWith('/index') ? path.posix.dirname(rel) : rel;
  return path.posix.join(base, dir === '.' ? '' : dir);
}

/**
 * Turn '/anything' into '/src/anything' when appropriate.
 * Remote URLs are passed through unchanged.
 */
function normalizeToProjectKey(
  p: string,
  { assumeUnderSrc = true } = {},
): string {
  if (isRemoteUrl(p)) return p;
  if (p.startsWith('/src/')) return toPosix(p);
  if (p.startsWith('/')) {
    return assumeUnderSrc
      ? toPosix(path.posix.join('/src', p.replace(/^\/+/, '')))
      : toPosix(p);
  }
  return toPosix(p);
}

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
  let candidate = (imageName ?? '').toString().trim();
  if (!candidate) candidate = defaultKey;
  if (!candidate) {
    if (warnOnFallback)
      log.warn('[resolveImageKey] No imageName and no defaultKey configured.');
    return '';
  }

  const clean = candidate.replace(/^[.][/\\]/, ''); // strip leading './'
  const tried: string[] = [];

  if (isRemoteUrl(candidate)) return candidate;

  if (candidate.startsWith('/src/')) {
    tried.push(candidate);
    if (hasImage(candidate)) return candidate;
  }

  if (candidate.startsWith('/') && !candidate.startsWith('/src/')) {
    const mapped = toPosix(
      path.posix.join('/src', candidate.replace(/^\/+/, '')),
    );
    tried.push(mapped);
    if (hasImage(mapped)) return mapped;
  }

  const entryBase = contentDirFromId(entryId, collection).replace(
    /^\/src\/content/,
    contentRoot,
  );
  const localKey1 = toPosix(path.posix.join(entryBase, candidate));
  const localKey2 = toPosix(path.posix.join(entryBase, clean));
  tried.push(localKey1);
  if (hasImage(localKey1)) return localKey1;
  if (clean !== candidate) {
    tried.push(localKey2);
    if (hasImage(localKey2)) return localKey2;
  }

  const globalKey1 = toPosix(path.posix.join(assetsDir, candidate));
  const globalKey2 = toPosix(path.posix.join(assetsDir, clean));
  tried.push(globalKey1);
  if (hasImage(globalKey1)) return globalKey1;
  if (clean !== candidate) {
    tried.push(globalKey2);
    if (hasImage(globalKey2)) return globalKey2;
  }

  const fallback = normalizeToProjectKey(defaultKey);

  if (import.meta.env.DEV) {
    log.warn(
      `[resolveImageKey] Missed all candidates for '${collection}:${entryId}'. Tried:\n` +
        tried
          .map((k) => ` - ${k} ${hasImage(k) ? '(found)' : '(missing)'}`)
          .join('\n') +
        `\n→ Falling back to: ${fallback}`,
    );
  }

  return fallback;
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

  const meta: ImageMetadata | undefined = getImageMeta(keyOrUrl);
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
