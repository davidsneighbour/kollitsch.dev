#!/usr/bin/env node

/**
 * Download local copies of YouTube/Vimeo video thumbnails referenced
 * anywhere in the site (blog frontmatter `cover.video.youtube` /
 * `cover.video.vimeo`, inline `<Youtube video="…">` / `<Vimeo video="…">`
 * usage, and hardcoded `videoId="…"` / `video="…"` props in .astro files).
 *
 * Vimeo detection is based on the one existing usage in the project
 * (frontmatter `cover.video.vimeo`, rendered via `PostImage.astro` into
 * `Vimeo.astro`); the `<Vimeo video="…">` tag pattern below is speculative
 * by comparison, since no post currently drops that tag directly into a
 * body (see sibling repo samui-samui.de's `fetch-video-thumbnails.ts`,
 * which this script's Vimeo handling was ported back from).
 *
 * Thumbnails are saved to `src/assets/images/youtube-thumbnails/<id>.jpg`
 * (YouTube) / `src/assets/images/vimeo-thumbnails/<id>.jpg` (Vimeo). This
 * lets `Youtube.astro` serve an Astro-optimized local poster instead of
 * live-fetching one from `i.ytimg.com` on every page view; `Vimeo.astro`
 * doesn't consume its cached copy yet (it still fetches its poster from
 * Vimeo's oEmbed API client-side) — the Vimeo output dir mainly exists so
 * `--verify` has thumbnails to compare against and so a future switch to a
 * local Vimeo poster has somewhere to read from.
 *
 * Usage:
 *   node src/scripts/content/fetch-youtube-thumbnails.ts               → fetch missing thumbnails for every id found in the project
 *   node src/scripts/content/fetch-youtube-thumbnails.ts <videoId>      → fetch (or refresh) a single video id, skipping the project scan (provider is auto-detected: numeric ids are Vimeo, 11-character ids are YouTube)
 *   node src/scripts/content/fetch-youtube-thumbnails.ts --force        → re-fetch all
 *   node src/scripts/content/fetch-youtube-thumbnails.ts <videoId> --force → re-fetch just that one id
 *   node src/scripts/content/fetch-youtube-thumbnails.ts --verify       → check every known id is still live/reachable (no download); exits 1 if any are dead
 *
 * --verify exists because a video can go dead *after* its thumbnail was
 * already downloaded successfully — the normal (non-verify) run only ever
 * looks at ids that don't have a local thumbnail yet, so it can't catch
 * that drift. It's meant for an occasional/scheduled audit, not every
 * commit: it makes one request per known video id, which is too slow to
 * run on every save.
 */

import fs from 'fs/promises';
import fg from 'fast-glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_ROOT = path.resolve(__dirname, '../..');
const OUTPUT_DIRS = {
  youtube: path.join(SRC_ROOT, 'assets/images/youtube-thumbnails'),
  vimeo: path.join(SRC_ROOT, 'assets/images/vimeo-thumbnails'),
} as const;

type Provider = keyof typeof OUTPUT_DIRS;

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;
const VIMEO_ID_RE = /^\d+$/;
// Real YouTube 404 responses for missing thumbnail sizes return a tiny
// 120x90 grey placeholder image instead of an HTTP error.
const PLACEHOLDER_MAX_BYTES = 2000;

const cliArgs = process.argv.slice(2);
const force = cliArgs.includes('--force');
const verify = cliArgs.includes('--verify');
// lint-staged always appends the staged file paths to this command, which
// this script's default (no-arg) full-project scan doesn't need — ignore
// path-like arguments instead of misreading one as an explicit video id.
const explicitId = cliArgs.find(
  (arg) => !arg.startsWith('--') && !arg.includes('/') && !arg.includes('\\'),
);

function detectProvider(id: string): Provider | null {
  if (YOUTUBE_ID_RE.test(id)) return 'youtube';
  if (VIMEO_ID_RE.test(id)) return 'vimeo';
  return null;
}

let explicitProvider: Provider | null = null;
if (explicitId) {
  explicitProvider = detectProvider(explicitId);
  if (!explicitProvider) {
    console.error(
      `"${explicitId}" is not a valid YouTube (11-character) or Vimeo (numeric) video id.`,
    );
    process.exit(1);
  }
}

const logPath = (filePath: string) =>
  path.relative(process.cwd(), filePath).replace(/\\/g, '/');

/**
 * Maps each referenced `<provider>:<id>` pair to the project-relative
 * file(s) it was found in, so a dead-video report can point straight at the
 * content that needs fixing.
 */
async function collectVideoRefs(): Promise<Map<string, Set<string>>> {
  const refsToFiles = new Map<string, Set<string>>();

  const record = (provider: Provider, id: string, file: string) => {
    const key = `${provider}:${id}`;
    const existing = refsToFiles.get(key) ?? new Set<string>();
    existing.add(logPath(file));
    refsToFiles.set(key, existing);
  };

  const files = await fg(['**/*.md', '**/*.mdx', '**/*.astro'], {
    cwd: SRC_ROOT,
    absolute: true,
  });

  const youtubePatterns = [
    /^\s*youtube:\s*["']?([A-Za-z0-9_-]{11})["']?\s*$/gm,
    /<Youtube\s+[^>]*\bvideo=["']([A-Za-z0-9_-]{11})["']/g,
    /\bvideo(?:Id)?=["']([A-Za-z0-9_-]{11})["']/g,
  ];
  const vimeoPatterns = [
    /^\s*vimeo:\s*["']?(\d+)["']?\s*$/gm,
    /<Vimeo\s+[^>]*\bvideo=["'](\d+)["']/g,
  ];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');

    for (const pattern of youtubePatterns) {
      for (const match of content.matchAll(pattern)) {
        const id = match[1];
        if (id && YOUTUBE_ID_RE.test(id)) record('youtube', id, file);
      }
    }
    for (const pattern of vimeoPatterns) {
      for (const match of content.matchAll(pattern)) {
        const id = match[1];
        if (id && VIMEO_ID_RE.test(id)) record('vimeo', id, file);
      }
    }
  }

  return refsToFiles;
}

/**
 * Checks whether a YouTube video still exists. `hqdefault.jpg` is
 * available for essentially every real video regardless of source
 * resolution, and — unlike the youtube.com watch page, which returns HTTP
 * 200 with a client-rendered "video unavailable" message — genuinely
 * returns a real 404 once a video has been deleted or made private.
 */
async function isYoutubeVideoLive(videoId: string): Promise<boolean> {
  const response = await fetch(
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    { method: 'HEAD' },
  );
  return response.ok;
}

async function isVimeoVideoLive(videoId: string): Promise<boolean> {
  const apiUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
    `https://vimeo.com/${videoId}`,
  )}`;
  const response = await fetch(apiUrl);
  return response.ok;
}

// JPEG magic number (FF D8 FF). Network data is written to disk below, so
// this confirms the response body is actually a JPEG before it's trusted as
// one — see CodeQL js/http-to-file-access (CWE-434/CWE-912):
// https://github.com/davidsneighbour/kollitsch.dev/security/code-scanning/75
function isJpeg(buffer: Buffer): boolean {
  return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

async function fetchYoutubeThumbnail(videoId: string): Promise<Buffer> {
  const candidates = ['maxresdefault.jpg', 'sddefault.jpg', 'hqdefault.jpg'];

  let lastBuffer: Buffer | null = null;
  for (const candidate of candidates) {
    const url = `https://i.ytimg.com/vi/${videoId}/${candidate}`;
    const response = await fetch(url);
    if (!response.ok) continue;

    const contentType = response.headers.get('content-type');
    if (!contentType?.startsWith('image/')) continue;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (!isJpeg(buffer)) continue;

    if (buffer.byteLength > PLACEHOLDER_MAX_BYTES) {
      return buffer;
    }
    lastBuffer = buffer;
  }

  // hqdefault should always exist for a valid video id; fall back to
  // whatever we last received even if it looked like a placeholder.
  if (lastBuffer) return lastBuffer;
  throw new Error(`No thumbnail available for YouTube video id "${videoId}"`);
}

async function fetchVimeoThumbnail(videoId: string): Promise<Buffer> {
  const apiUrl = `https://vimeo.com/api/oembed.json?url=${encodeURIComponent(
    `https://vimeo.com/${videoId}`,
  )}`;
  const response = await fetch(apiUrl);
  if (!response.ok) {
    throw new Error(
      `Vimeo oEmbed lookup failed for video id "${videoId}" (HTTP ${response.status})`,
    );
  }

  const json = (await response.json()) as { thumbnail_url?: string };
  const thumbnailUrl = json.thumbnail_url;
  if (!thumbnailUrl) {
    throw new Error(
      `No thumbnail_url in Vimeo oEmbed response for "${videoId}"`,
    );
  }

  const imageResponse = await fetch(thumbnailUrl);
  if (!imageResponse.ok) {
    throw new Error(
      `Failed to download Vimeo thumbnail for "${videoId}" (HTTP ${imageResponse.status})`,
    );
  }

  const contentType = imageResponse.headers.get('content-type');
  if (!contentType?.startsWith('image/')) {
    throw new Error(`Vimeo thumbnail for "${videoId}" was not an image`);
  }

  const buffer = Buffer.from(await imageResponse.arrayBuffer());
  if (!isJpeg(buffer)) {
    throw new Error(`Vimeo thumbnail for "${videoId}" was not a JPEG`);
  }

  return buffer;
}

async function runVerify(refsToFiles: Map<string, Set<string>>) {
  const keys = [...refsToFiles.keys()].sort();
  console.log(
    `Verifying ${keys.length} unique video reference(s) are still live/reachable…`,
  );

  const dead: string[] = [];
  for (const key of keys) {
    const [provider, id] = key.split(':') as [Provider, string];
    const live =
      provider === 'youtube'
        ? await isYoutubeVideoLive(id)
        : await isVimeoVideoLive(id);
    console.log(
      `${live ? '✔' : '✘'} ${provider}:${id}${live ? '' : ' — no longer available'}`,
    );
    if (!live) dead.push(key);
  }

  if (dead.length === 0) {
    console.log(`\nAll ${keys.length} video(s) are still live.`);
    return;
  }

  console.log(
    `\n${dead.length} of ${keys.length} video(s) are no longer available:\n`,
  );
  for (const key of dead) {
    const files = [...(refsToFiles.get(key) ?? [])].sort();
    console.log(`- ${key}`);
    for (const file of files) console.log(`    ${file}`);
  }
  process.exit(1);
}

async function main() {
  await fs.mkdir(OUTPUT_DIRS.youtube, { recursive: true });
  await fs.mkdir(OUTPUT_DIRS.vimeo, { recursive: true });

  const refsToFiles = explicitId
    ? new Map([[`${explicitProvider}:${explicitId}`, new Set<string>()]])
    : await collectVideoRefs();

  if (verify) {
    await runVerify(refsToFiles);
    return;
  }

  const keys = [...refsToFiles.keys()].sort();
  console.log(
    explicitId
      ? `Fetching thumbnail for ${explicitProvider}:${explicitId}.`
      : `Found ${keys.length} unique video reference(s) in the project.`,
  );

  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (const key of keys) {
    const [provider, id] = key.split(':') as [Provider, string];
    const destPath = path.join(OUTPUT_DIRS[provider], `${id}.jpg`);

    if (!force) {
      const exists = await fs
        .access(destPath)
        .then(() => true)
        .catch(() => false);
      if (exists) {
        skipped++;
        continue;
      }
    }

    try {
      const buffer =
        provider === 'youtube'
          ? await fetchYoutubeThumbnail(id)
          : await fetchVimeoThumbnail(id);
      await fs.writeFile(destPath, buffer);
      console.log(
        `✔ fetched: ${logPath(destPath)} (${buffer.byteLength} bytes)`,
      );
      fetched++;
    } catch (error) {
      console.error(`✘ failed: ${key} — ${(error as Error).message}`);
      failed++;
    }
  }

  console.log(`\nDone. Fetched ${fetched}, skipped ${skipped} (already present), failed ${failed}.`);

  // A single explicit id is a deliberate request — a failure should be loud.
  // A full project scan runs unattended (e.g. via lint-staged on every blog
  // commit); a stale/deleted video elsewhere in the archive shouldn't block
  // unrelated commits forever, so only warn there.
  if (failed > 0 && explicitId) process.exit(1);
}

await main();
