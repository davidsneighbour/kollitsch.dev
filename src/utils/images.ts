import type { CollectionEntry } from 'astro:content';
import rawSetup from '@data/setup.json' with { type: 'json' };
import { getImageMeta, hasImage } from '@utils/image-index';
import { resolveImageKey } from '@utils/opengraph';
import type { ImageMetadata } from 'astro';
import MarkdownIt from 'markdown-it';

interface SetupConfig {
  images?: { opengraph?: string };
}
const setup: SetupConfig = rawSetup as unknown as SetupConfig;

type FMVideo = { title: string; youtube: string; artist?: string };
type FMCover = {
  type?: 'image' | 'video';
  src?: string;
  title?: string;
  alt?: string;
  video?: FMVideo;
};

type CoverBase = { alt: string };
export type CoverVideo = CoverBase & {
  type: 'video';
  video: { artist?: string; title: string; youtube: string };
};
export type CoverImage = CoverBase & {
  type: 'image';
  src: string; // keyOrUrl
  title?: string; // rendered inline markdown
  meta?: ImageMetadata; // present only for local keys
};
export type CoverObject = CoverImage | CoverVideo;

/**
 * Strip basic markdown/HTML for alt text.
 * @param str Arbitrary text
 * @returns Sanitized plain string
 */
export function stripMarkup(str: string): string {
  return str.replace(/[#_*~`>[\]()\-!]/g, '').replace(/<\/?[^>]+(>|$)/g, '');
}

/**
 * Resolve the main page cover based on post front-matter.
 * For 'image' type, returns a local key or remote URL plus optional ImageMetadata.
 * For 'video' type, returns embed info for the lite-youtube component.
 *
 * @param post Blog collection entry
 * @returns Discriminated union CoverObject
 * @example
 * const cover = resolveCover(post);
 * if (cover.type === 'image' && cover.meta) { /* <Picture src={cover.meta} /> *\/ }
 */
export function resolveCover(post: CollectionEntry<'blog'>): CoverObject {
  const md = new MarkdownIt();
  const cover = (post.data.cover ?? {}) as FMCover;

  // Video cover: only set properties when present (exactOptionalPropertyTypes)
  if (cover.type === 'video' && cover.video) {
    const v = cover.video;
    return {
      alt: stripMarkup(v.title),
      type: 'video',
      video: {
        title: v.title,
        youtube: v.youtube,
        ...(v.artist ? { artist: v.artist } : {}),
      },
    };
    // no title on the video figure; adjust if you need it
  }

  // Image cover
  const rawName = cover.src ?? '';
  const defaultKey = (setup.images?.opengraph ?? '').trim();
  const keyOrUrl = resolveImageKey(rawName, post.id, post.collection, {
    defaultKey,
  });

  const alt = stripMarkup(cover.alt ?? cover.title ?? 'Image');
  const renderedTitle = cover.title ? md.renderInline(cover.title) : undefined;
  const meta = keyOrUrl.startsWith('/src/')
    ? getImageMeta(keyOrUrl)
    : undefined;

  if (
    keyOrUrl.startsWith('/src/') &&
    !hasImage(keyOrUrl) &&
    import.meta.env.DEV
  ) {
    console.debug(`[resolveCover] Not indexed: ${keyOrUrl} (post: ${post.id})`);
  }

  return {
    alt,
    src: keyOrUrl,
    type: 'image',
    ...(renderedTitle ? { title: renderedTitle } : {}),
    ...(meta ? { meta } : {}),
  };
}
