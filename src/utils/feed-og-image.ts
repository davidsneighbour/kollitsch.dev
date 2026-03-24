import type { CollectionEntry } from 'astro:content';
import crypto from 'node:crypto';
import setup from '@data/setup.json' with { type: 'json' };
import {
  type OpenGraphSource,
  resolveOpenGraphPayload,
} from '@utils/content.ts';
import {
  type ResolveImageKeyOptions,
  resolveImageKey,
} from '@utils/opengraph.ts';

const TEMPLATE_VERSION = 1;
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const OG_FORMAT = 'jpeg' as const;

function generateContentHash(
  title: string,
  pubDate: Date | undefined,
  imageKey: string,
): string {
  const base = JSON.stringify({
    author: setup.author?.name ?? '',
    format: OG_FORMAT,
    height: OG_HEIGHT,
    imageKey,
    siteTitle: setup.title ?? '',
    title,
    v: TEMPLATE_VERSION,
    width: OG_WIDTH,
  });

  const content = pubDate ? `${base}-${pubDate.toISOString()}` : base;
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

function resolveBackgroundImageKey(post: CollectionEntry<'blog'>): string {
  const postPath = `/blog/${post.id.replace(/^\/+|\/+$/g, '')}/`;
  const canonicalUrl = new URL(postPath, setup.url).toString();

  const { payload } = resolveOpenGraphPayload(post as OpenGraphSource, {
    canonicalUrl,
    siteDescription: setup.description ?? '',
    siteTitle: setup.title ?? '',
    titlePostfix: setup.head?.postfix,
  });

  const image = payload.image;
  const hasContentIdentity =
    typeof image?.id === 'string' &&
    image.id.length > 0 &&
    typeof image?.collection === 'string' &&
    image.collection.length > 0;

  if (!hasContentIdentity) return 'none';

  const defaultArticleImageKey = (setup.images?.default ?? '').trim();
  const ogFallbackKey = (setup.images?.opengraph ?? '').trim();

  type CoverField = { type?: unknown; src?: unknown };
  const rawCover = image?.cover;
  const cover: CoverField =
    rawCover && typeof rawCover === 'object' ? (rawCover as CoverField) : {};
  const coverType = typeof cover.type === 'string' ? cover.type : 'image';

  const defaultKeyMaybe =
    (defaultArticleImageKey || ogFallbackKey || '').trim() || undefined;
  const opts: ResolveImageKeyOptions =
    defaultKeyMaybe !== undefined ? { defaultKey: defaultKeyMaybe } : {};

  const rawSrc =
    typeof rawCover === 'string'
      ? rawCover
      : typeof cover.src === 'string'
        ? cover.src
        : undefined;

  const resolved = resolveImageKey(
    coverType !== 'video' ? rawSrc : undefined,
    image?.id ?? '',
    image?.collection ?? '',
    opts,
  );

  return resolved || defaultArticleImageKey || ogFallbackKey || 'none';
}

export function getFeedOgImage(
  post: CollectionEntry<'blog'>,
  site: URL,
): string {
  const postPath = `/blog/${post.id.replace(/^\/+|\/+$/g, '')}/`;
  const canonicalUrl = new URL(postPath, site).toString();

  const { payload } = resolveOpenGraphPayload(post as OpenGraphSource, {
    canonicalUrl,
    siteDescription: setup.description ?? '',
    siteTitle: setup.title ?? '',
    titlePostfix: setup.head?.postfix,
  });

  const title = payload.title ?? post.data.title;
  const pubDate = post.data.date ? new Date(post.data.date) : undefined;
  const backgroundImageKey = resolveBackgroundImageKey(post);
  const hash = generateContentHash(title, pubDate, backgroundImageKey);

  return new URL(`/og_image/${hash}.jpg`, site).toString();
}
