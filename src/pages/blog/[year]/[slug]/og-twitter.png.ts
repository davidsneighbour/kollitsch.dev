/**
 * Dynamic OG image generation for blog posts.
 * - Uses satori to render SVG from JSX/HTML markup.
 * - Uses resvg to convert SVG to PNG.
 * - Caches generated PNG images on disk for performance.
 *
 * Route: /blog/[year]/[slug]/og-twitter.png
 * Collection id format: [year]/[slug]
 *
 * Query params:
 *   - width:  number (default 1200)
 *   - height: number (default 675)
 *
 * @see https://github.com/vercel/satori
 * @see https://www.npmjs.com/package/satori-html
 * @see https://og-playground.vercel.app/ (Satori playground)
 *
 * Satori supports TailwindCSS via `tw` prop, but some things are missing (see Satori docs).
 */

import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import setup from '@data/setup.json' with { type: 'json' };
import { Resvg } from '@resvg/resvg-js';
import { formatISO8601Local } from '@utils/datetime';
import type { APIContext } from 'astro';
import he from 'he';
import satori, { type SatoriOptions } from 'satori';
import { html } from 'satori-html';

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 675;

const ChangaPath =
  './node_modules/@fontsource/changa-one/files/changa-one-latin-400-normal.woff';
const Exo2Path =
  './node_modules/@fontsource/exo-2/files/exo-2-latin-400-normal.woff'; // non-variable font

// Read font data once at module load.
const ChangaData = fs.readFileSync(ChangaPath);
const Exo2Data = fs.readFileSync(Exo2Path);

// Cache directory: keep it out of git, easy to persist in CI.
const CACHE_DIR = path.join(process.cwd(), 'node_modules', '.og_image_cache');

/**
 * Build Satori options for a given size.
 * @param {number} width
 * @param {number} height
 * @returns {SatoriOptions}
 */
function buildOgOptions(width: number, height: number): SatoriOptions {
  return {
    debug: true,
    fonts: [
      { data: ChangaData, name: 'Changa', style: 'normal', weight: 400 },
      { data: Exo2Data, name: 'Exo 2', style: 'normal', weight: 300 },
    ],
    height,
    width,
  };
}

/**
 * Ensure cache directory exists.
 * @returns {void}
 */
function ensureCacheDir(): void {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
}

/**
 * Parse and validate width/height from request URL.
 * Falls back to defaults if invalid or missing.
 * @param {URL} url
 * @returns {{ width: number; height: number }}
 */
function parseDimensions(url: URL): { width: number; height: number } {
  const params = url.searchParams;
  const wRaw = params.get('width');
  const hRaw = params.get('height');

  const toPosInt = (v: string | null, fallback: number): number => {
    if (!v) return fallback;
    const n = Number.parseInt(v, 10);
    if (!Number.isFinite(n) || n <= 0 || n > 4096) return fallback; // simple guardrails
    return n;
  };

  const width = toPosInt(wRaw, DEFAULT_WIDTH);
  const height = toPosInt(hRaw, DEFAULT_HEIGHT);
  return { height, width };
}

/**
 * Create a short, deterministic content hash.
 * Includes title + pubDate + dimensions to separate caches by size.
 * @param {string} title
 * @param {Date} pubDate
 * @param {number} width
 * @param {number} height
 * @returns {string}
 */
function generateContentHash(
  title: string,
  pubDate: Date,
  width: number,
  height: number,
): string {
  const content = `${title}-${pubDate.toISOString()}-${width}x${height}`;
  return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

/**
 * Lookup or render the PNG, then persist it.
 * @param {string} title - Post title (decoded)
 * @param {Date} pubDate - Publication date as Date
 * @param {string} postDate - Formatted date string for display
 * @param {number} width
 * @param {number} height
 * @returns {Promise<Uint8Array>}
 */
async function getCachedOrGeneratePng(
  title: string,
  pubDate: Date,
  postDate: string,
  width: number,
  height: number,
): Promise<Uint8Array> {
  ensureCacheDir();

  const contentHash = generateContentHash(title, pubDate, width, height);
  const cacheFilePath = path.join(CACHE_DIR, `${contentHash}.png`);

  if (fs.existsSync(cacheFilePath)) {
    console.log(`[og] Using cache: ${cacheFilePath}`);
    return new Uint8Array(fs.readFileSync(cacheFilePath));
  }

  console.log(`[og] Generating OG image: ${title} @ ${width}x${height}`);
  let svg: string;
  try {
    svg = await satori(
      markup(title, postDate, width, height),
      buildOgOptions(width, height),
    );
  } catch (e) {
    console.error('[og] Satori render failed:', e);
    throw e;
  }

  let png: Uint8Array;
  try {
    const rendered = new Resvg(svg, { fitTo: { mode: 'original' } })
      .render()
      .asPng();
    png = new Uint8Array(rendered);
  } catch (e) {
    console.error('[og] Resvg render failed:', e);
    throw e;
  }

  try {
    fs.writeFileSync(cacheFilePath, png);
  } catch (e) {
    console.error('[og] Cache write failed:', cacheFilePath, e);
    // continue without cache
  }

  return png;
}

/**
 * Build Satori markup for the OG image.
 * @param {string} title
 * @param {string} pubDate
 * @param {number} width
 * @param {number} height
 * @returns {ReturnType<typeof html>}
 */
function markup(title: string, pubDate: string, width: number, height: number) {
  return html`
<div style="display:contents;" tw="relative w-full h-full">
  <img src="https://images.unsplash.com/photo-1759338069275-333580793462"
       width="${width}" height="${height}"
       style="position:absolute;top:0;left:0;width:100%;height:100%;
              object-fit:cover;object-position:center;" />
  <div style="font-family:'Exo 2',sans-serif;"
       tw="flex flex-col w-full h-full bg-[#282828]/60 text-[#999999]">
    <div tw="flex flex-col flex-1 w-full p-10 leading-none">
      <h1 style="font-family:'Changa',sans-serif;" tw="text-6xl leading-snug text-white">${title}</h1>
      <p tw="text-xl">by ${setup.author.name}</p>
    </div>
    <div tw="flex flex-0 items-center justify-between w-full p-10 border-t border-[#2bbc89] text-xl">
      <p style="font-family:'Changa',sans-serif;">${setup.title}</p>
      <p tw="text-2xl">${pubDate}</p>
    </div>
  </div>
</div>
`;
}

/**
 * Return a true ArrayBuffer (never SharedArrayBuffer) with a tight copy
 * of the given Uint8Array's bytes.
 * @param {Uint8Array} view
 * @returns {ArrayBuffer}
 */
function toArrayBuffer(view: Uint8Array): ArrayBuffer {
  const out = new ArrayBuffer(view.byteLength);
  new Uint8Array(out).set(view);
  return out;
}

/**
 * GET /blog/[year]/[slug]/og-twitter.png
 */
export async function GET(context: APIContext): Promise<Response> {
  const year = context.params?.year;
  const slug = context.params?.slug;

  // In Astro 4/5, use context.url when available, else derive from request.
  const url =
    'url' in context && context.url instanceof URL
      ? context.url
      : new URL(context.request.url);

  const { width, height } = parseDimensions(url);

  console.log('[og] GET params', { height, slug, width, year });

  if (
    typeof year !== 'string' ||
    typeof slug !== 'string' ||
    year.length !== 4
  ) {
    return new Response('Invalid params', { status: 400 });
  }

  const id = `${year}/${slug}`; // collection id format

  // Resolve post at request time (works in dev and build)
  const { getCollection } = await import('astro:content');
  const post = (await getCollection('blog', (p) => p.id === id))[0];

  if (!post) {
    console.log('[og] Not found for id', id);
    return new Response('Not found', { status: 404 });
  }

  const decodedTitle = he.decode(post.data.title);
  const pubDate = new Date(post.data.date);
  const postDate = formatISO8601Local(pubDate);

  const pngBuffer = await getCachedOrGeneratePng(
    decodedTitle,
    pubDate,
    postDate,
    width,
    height,
  );
  const ab = toArrayBuffer(pngBuffer);

  return new Response(ab, {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'image/png',
    },
  });
}

/**
 * Generate static params for all posts in the blog collection.
 * Maps id "YYYY/slug" -> { year: "YYYY", slug: "slug" }.
 */
export async function getStaticPaths() {
  const { getCollection } = await import('astro:content');
  const posts = await getCollection('blog');

  return posts
    .map((post) => {
      const [year, slug] = post.id.split('/');
      if (!year || !slug) return null;
      return { params: { slug, year } as const };
    })
    .filter((v): v is { params: { year: string; slug: string } } => v !== null);
}
