#!/usr/bin/env node

/**
 * Download local copies of YouTube video thumbnails referenced anywhere in the
 * site (blog frontmatter `cover.video.youtube`, inline `<Youtube video="…">`
 * usage, and hardcoded `videoId="…"` / `video="…"` props in .astro files).
 *
 * Thumbnails are saved to `src/assets/images/youtube-thumbnails/<id>.jpg` so
 * `Youtube.astro` can serve an Astro-optimized local poster image instead of
 * live-fetching one from i.ytimg.com on every page view.
 *
 * Usage:
 *   node src/scripts/content/fetch-youtube-thumbnails.ts               → fetch missing thumbnails for every id found in the project
 *   node src/scripts/content/fetch-youtube-thumbnails.ts <videoId>      → fetch (or refresh) a single video id, skipping the project scan
 *   node src/scripts/content/fetch-youtube-thumbnails.ts --force        → re-fetch all
 *   node src/scripts/content/fetch-youtube-thumbnails.ts <videoId> --force → re-fetch just that one id
 */

import fs from 'fs/promises';
import fg from 'fast-glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SRC_ROOT = path.resolve(__dirname, '../..');
const OUTPUT_DIR = path.join(SRC_ROOT, 'assets/images/youtube-thumbnails');

const VIDEO_ID_RE = /^[A-Za-z0-9_-]{11}$/;
// Real YouTube 404 responses for missing thumbnail sizes return a tiny
// 120x90 grey placeholder image instead of an HTTP error.
const PLACEHOLDER_MAX_BYTES = 2000;

const cliArgs = process.argv.slice(2);
const force = cliArgs.includes('--force');
const explicitId = cliArgs.find((arg) => !arg.startsWith('--'));

if (explicitId && !VIDEO_ID_RE.test(explicitId)) {
  console.error(
    `"${explicitId}" is not a valid 11-character YouTube video id.`,
  );
  process.exit(1);
}

const logPath = (filePath: string) =>
  path.relative(process.cwd(), filePath).replace(/\\/g, '/');

async function collectVideoIds(): Promise<Set<string>> {
  const ids = new Set<string>();

  const files = await fg(['**/*.md', '**/*.mdx', '**/*.astro'], {
    cwd: SRC_ROOT,
    absolute: true,
  });

  const patterns = [
    /^\s*youtube:\s*["']?([A-Za-z0-9_-]{11})["']?\s*$/gm,
    /<Youtube\s+[^>]*\bvideo=["']([A-Za-z0-9_-]{11})["']/g,
    /\bvideo(?:Id)?=["']([A-Za-z0-9_-]{11})["']/g,
  ];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    for (const pattern of patterns) {
      for (const match of content.matchAll(pattern)) {
        const id = match[1];
        if (id && VIDEO_ID_RE.test(id)) {
          ids.add(id);
        }
      }
    }
  }

  return ids;
}

async function fetchBestThumbnail(videoId: string): Promise<Buffer> {
  const candidates = ['maxresdefault.jpg', 'sddefault.jpg', 'hqdefault.jpg'];

  let lastBuffer: Buffer | null = null;
  for (const candidate of candidates) {
    const url = `https://i.ytimg.com/vi/${videoId}/${candidate}`;
    const response = await fetch(url);
    if (!response.ok) continue;

    const buffer = Buffer.from(await response.arrayBuffer());
    if (buffer.byteLength > PLACEHOLDER_MAX_BYTES) {
      return buffer;
    }
    lastBuffer = buffer;
  }

  // hqdefault should always exist for a valid video id; fall back to
  // whatever we last received even if it looked like a placeholder.
  if (lastBuffer) return lastBuffer;
  throw new Error(`No thumbnail available for video id "${videoId}"`);
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const ids = explicitId ? new Set([explicitId]) : await collectVideoIds();
  console.log(
    explicitId
      ? `Fetching thumbnail for video id "${explicitId}".`
      : `Found ${ids.size} unique YouTube video id(s) referenced in the project.`,
  );

  let fetched = 0;
  let skipped = 0;
  let failed = 0;

  for (const id of [...ids].sort()) {
    const destPath = path.join(OUTPUT_DIR, `${id}.jpg`);

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
      const buffer = await fetchBestThumbnail(id);
      await fs.writeFile(destPath, buffer);
      console.log(`✔ fetched: ${logPath(destPath)} (${buffer.byteLength} bytes)`);
      fetched++;
    } catch (error) {
      console.error(`✘ failed: ${id} — ${(error as Error).message}`);
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
