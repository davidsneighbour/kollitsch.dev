/**
 * Rendering pipeline for social/OG images: Satori -> Resvg -> Sharp.
 *
 * Pure: returns image bytes, does not touch disk itself. Used exclusively
 * by the standalone build-og-images.ts CLI script (see
 * scratch/og-image-generation.plan.md) — OpenGraphImage.astro no longer
 * renders images at runtime, only resolves pre-generated static files.
 */

import fs from 'node:fs';
import path from 'node:path';
import { Resvg } from '@resvg/resvg-js';
import satori from 'satori';
import { createLogger, type Logger } from '../logger.ts';
import { buildOgOptions, markup } from './template.ts';

const log: Logger = createLogger({ slug: 'social-image:generate' });

export type OgFormat = 'png' | 'jpeg' | 'webp';

export type OgImageResult = {
  buffer: Buffer;
  width: number;
  height: number;
  format: OgFormat;
  mime: 'image/png' | 'image/jpeg' | 'image/webp';
};

const SHARP_CONFIG = {
  cache: { files: 0, items: 32, memory: 32 },
  concurrency: 1,
  jpegQuality: 80,
  limitInputPixels: 64_000_000, // ~64MP guard
  pngCompression: 9 as 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9,
  pngEffort: 10 as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
  webpQuality: 80,
} as const;

const REMOTE_IMAGE_REGEX = /^https?:\/\//i;

/**
 * Prepare background image as data URL, pre-sized to the output (or pass through remote).
 *
 * Note: For remote URLs, Satori can fetch directly. Keeping remote URLs reduces memory
 * since we avoid embedding huge base64 buffers. For local files, resize via Sharp first.
 */
export async function toBackgroundImageSrc(
  key: string,
  targetW: number,
  targetH: number,
): Promise<string | null> {
  if (!key) return null;

  const sharp = (await import('sharp')).default;
  sharp.cache(SHARP_CONFIG.cache);
  sharp.concurrency(SHARP_CONFIG.concurrency);

  // Remote: fetch then resize -> data URL
  if (REMOTE_IMAGE_REGEX.test(key)) {
    try {
      const ac = new AbortController();
      const t = setTimeout(() => ac.abort(), 10_000); // 10s guard
      const res = await fetch(key, { signal: ac.signal });
      clearTimeout(t);

      if (!res.ok) {
        log.warn(
          { status: res.status, url: key },
          'Remote background fetch failed',
        );
        return null;
      }

      const buf = Buffer.from(await res.arrayBuffer());
      const out = await sharp(buf)
        .resize({
          fit: 'cover',
          height: targetH,
          width: targetW,
          withoutEnlargement: true,
        })
        .jpeg({ mozjpeg: true, quality: SHARP_CONFIG.jpegQuality })
        .toBuffer();

      return `data:image/jpeg;base64,${out.toString('base64')}`;
    } catch (err) {
      log.error({ err, url: key }, 'Remote background processing failed');
      return null;
    }
  }

  // Local file: read then resize -> data URL
  const relative = key.replace(/^\/+/, '');
  const filePath = path.join(process.cwd(), relative);
  if (!fs.existsSync(filePath)) {
    log.warn({ filePath }, 'Background image not found');
    return null;
  }

  try {
    const out = await sharp(filePath)
      .resize({
        fit: 'cover',
        height: targetH,
        width: targetW,
        withoutEnlargement: true,
      })
      .jpeg({ mozjpeg: true, quality: SHARP_CONFIG.jpegQuality })
      .toBuffer();

    return `data:image/jpeg;base64,${out.toString('base64')}`;
  } catch (error) {
    log.error({ err: error, filePath }, 'Failed to prepare background image');
    return null;
  }
}

function mimeFor(format: OgFormat): OgImageResult['mime'] {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg';
    case 'webp':
      return 'image/webp';
    default:
      return 'image/png';
  }
}

/**
 * Transcode/optimize the rendered PNG into requested format with conservative memory.
 */
async function optimizeWithSharp(
  inputPngBuffer: Uint8Array,
  format: OgFormat,
): Promise<Buffer> {
  const sharp = (await import('sharp')).default;
  sharp.cache(SHARP_CONFIG.cache);
  sharp.concurrency(SHARP_CONFIG.concurrency);

  const image = sharp(inputPngBuffer, {
    limitInputPixels: SHARP_CONFIG.limitInputPixels,
  });

  switch (format) {
    case 'png':
      return image
        .png({
          compressionLevel: SHARP_CONFIG.pngCompression,
          effort: SHARP_CONFIG.pngEffort,
          palette: true,
        })
        .toBuffer();
    case 'jpeg':
      return image
        .jpeg({ mozjpeg: true, quality: SHARP_CONFIG.jpegQuality })
        .toBuffer();
    case 'webp':
      return image.webp({ quality: SHARP_CONFIG.webpQuality }).toBuffer();
  }
}

export interface RenderSocialImageParams {
  title: string;
  postDateDisplay: string;
  width: number;
  height: number;
  format: OgFormat;
  backgroundSrc: string;
}

/** Render a social image and return its bytes. Does not touch disk. */
export async function renderSocialImage({
  title,
  postDateDisplay,
  width,
  height,
  format,
  backgroundSrc,
}: RenderSocialImageParams): Promise<OgImageResult> {
  log.info({ format, height, title, width }, 'Rendering social image');

  const endGen = log.timer('render');
  let svg: string;
  try {
    svg = await satori(
      markup(title, postDateDisplay, width, height, backgroundSrc),
      buildOgOptions(width, height),
    );
    endGen('satori');
  } catch (e) {
    endGen('satori failed');
    throw e;
  }

  const endPix = log.timer('pixels');
  try {
    const renderedPng = new Resvg(svg, { fitTo: { mode: 'original' } })
      .render()
      .asPng();
    const optimized = await optimizeWithSharp(renderedPng, format);
    endPix('resvg+sharp');
    return { buffer: optimized, format, height, mime: mimeFor(format), width };
  } catch (e) {
    endPix('resvg+sharp failed');
    log.error({ err: e }, 'Resvg/Sharp pipeline failed');
    throw e;
  }
}
