import setup from '@data/setup.json' with { type: 'json' };
import { getIndexedImage } from '@utils/image-index.ts';
import { resolveImageKey } from '@utils/opengraph.ts';
import type { ImageMetadata } from 'astro';
import MarkdownIt from 'markdown-it';
import { createLogger } from './logger.ts';
import {
  sanitizeYouTubePlayerParams,
  type YouTubePlayerParams,
} from './youtube.ts';

const log = createLogger({ slug: 'cover' });
const defaultVideoParams = sanitizeYouTubePlayerParams(setup?.video?.params);

export type CollectionName = 'blog' | 'tags';

export interface ResolveCoverContext {
  id: string; // Unique entry id (e.g., 'blog/my-post') used for resolving relative assets
  collection: CollectionName; // Content collection the entry belongs to
}

export interface ResolveCoverOptions {
  /** Absolute path to the images source folder for local key detection (only used for 'tags' legacy lookups) */
  assetsDir?: string;
  /** Fallback key to use when no cover is provided or resolution fails */
  defaultKey?: string;
  /** Optional alt fallback if none can be derived from the cover object */
  fallbackAlt?: string;
  /** When true, log useful debug information during development */
  debug?: boolean;
  /** Warn instead of silently falling back when local image key cannot be resolved */
  warnOnFallback?: boolean;
}

export interface CoverVideo {
  title: string;
  youtube: string;
  artist?: string;
  params?: YouTubePlayerParams;
}

/** Front-matter 'cover' for blog/tags (image variant) */
export interface FMCoverImage {
  type?: 'image';
  src?: string;
  title?: string;
  alt?: string;
}

/** Front-matter 'cover' for blog/tags (video variant) */
export interface FMCoverVideo {
  type: 'video';
  video?: CoverVideo;
  /** Optional human title; not used for figure title by default */
  title?: string;
}

/** Union of front-matter cover variants */
export type FMCover = FMCoverImage | FMCoverVideo;

/** Resolved cover object (image) */
export interface ResolvedCoverImage {
  type: 'image';
  src: string; // local key (/src/assets/...) or remote URL
  alt: string;
  title?: string; // inline-rendered HTML
  meta?: ImageMetadata;
}

/** Resolved cover object (video) */
export interface ResolvedCoverVideo {
  type: 'video';
  alt: string; // derived from video title
  video: CoverVideo;
}

export type CoverObject = ResolvedCoverImage | ResolvedCoverVideo;

/**
 * Strip simple HTML tags from a string.
 * Keeps inner text and trims whitespace.
 * Intentionally small and dependency-free — used for front-matter alt/title sanitization.
 *
 * @param input - string possibly containing HTML markup
 * @returns plain text with tags removed
 *
 * @example
 * ```ts
 * stripMarkup('<em>Fancy</em>') // -> 'Fancy'
 * ```
 */
function stripMarkup(input: string): string {
  return String(input)
    .replace(/<[^>]*>/g, '')
    .trim();
}

/**
 * Resolve a page cover from a 'cover' property.
 *
 * Accepts:
 * - a string (treated as local image key or remote URL), or
 * - a structured front-matter cover object (image/video).
 *
 * Returns a discriminated union ready for rendering.
 *
 * @param cover - string | FMCover | undefined | null
 * @param ctx - ResolveCoverContext (id + collection)
 * @param opts - ResolveCoverOptions
 * @returns CoverObject (ResolvedCoverImage | ResolvedCoverVideo)
 *
 * @example
 * ```ts
 * import { resolveCover } from '@utils/cover';
 *
 * const cover = resolveCover(post.frontmatter.cover, { id: 'blog/1', collection: 'blog' });
 * if (cover.type === 'image') {
 *   // render image
 * } else {
 *   // render video
 * }
 * ```
 */
export function resolveCover(
  cover: string | FMCover | undefined | null,
  ctx: ResolveCoverContext,
  opts: ResolveCoverOptions = {},
): CoverObject {
  const md = new MarkdownIt();
  const {
    defaultKey,
    assetsDir = '/src/assets/images',
    fallbackAlt = 'Image',
    debug = false,
    warnOnFallback = false,
  } = opts;

  const sanitizedFallbackAlt = stripMarkup(fallbackAlt);

  // Helper: inline render title (safe fallback on parser errors)
  const renderTitleInline = (title?: string): string | undefined => {
    if (!title || title.trim().length === 0) return undefined;
    try {
      return md.renderInline(title);
    } catch (error) {
      if (debug) {
        log.error('[resolveCover] Failed to render title inline:', error);
      }
      return title;
    }
  };

  // Helper: finalize an image response with optional title/meta
  const buildImageResult = (
    src: string,
    alt: string,
    title?: string,
  ): ResolvedCoverImage => {
    const imageEntry = src.startsWith('/src/')
      ? getIndexedImage(src)
      : undefined;
    const meta = imageEntry?.meta;

    if (src.startsWith('/src/') && !imageEntry && debug) {
      log.debug(`[resolveCover] Not indexed: ${src} (entry: ${ctx.id})`);
    }

    const result: ResolvedCoverImage = {
      alt,
      src,
      type: 'image',
      ...(title ? { title } : {}),
      ...(meta ? { meta } : {}),
    };
    return result;
  };

  // 1) No cover -> fall back
  if (!cover) {
    const src = resolveImageKey(undefined, ctx.id, ctx.collection, {
      assetsDir,
      ...(defaultKey !== undefined ? { defaultKey } : {}),
      warnOnFallback,
    });
    return buildImageResult(src, sanitizedFallbackAlt);
  }

  // 2) String cover -> resolve as image key/URL
  if (typeof cover === 'string') {
    const src = resolveImageKey(cover, ctx.id, ctx.collection, {
      assetsDir,
      ...(defaultKey !== undefined ? { defaultKey } : {}),
      warnOnFallback,
    });
    return buildImageResult(src, sanitizedFallbackAlt);
  }

  // 3) Object cover -> handle video first
  if (cover.type === 'video' && (cover as FMCoverVideo).video) {
    const v = (cover as FMCoverVideo).video!;
    const alt = stripMarkup(v.title || fallbackAlt);
    const overrideParams = sanitizeYouTubePlayerParams(v.params);
    const mergedParams = {
      ...defaultVideoParams,
      ...overrideParams,
    } satisfies YouTubePlayerParams;
    const hasParams = Object.keys(mergedParams).length > 0;
    const result: ResolvedCoverVideo = {
      alt,
      type: 'video',
      video: {
        title: v.title,
        youtube: v.youtube,
        ...(v.artist ? { artist: v.artist } : {}),
        ...(hasParams ? { params: mergedParams } : {}),
      },
    };
    return result;
  }

  // 4) Object cover -> image path
  const cimg = cover as FMCoverImage;
  const keyOrUrl = resolveImageKey(cimg.src, ctx.id, ctx.collection, {
    assetsDir,
    ...(defaultKey !== undefined ? { defaultKey } : {}),
    warnOnFallback,
  });

  const alt = stripMarkup(cimg.alt ?? cimg.title ?? fallbackAlt);
  const renderedTitle = renderTitleInline(cimg.title);

  return buildImageResult(keyOrUrl, alt, renderedTitle);
}
