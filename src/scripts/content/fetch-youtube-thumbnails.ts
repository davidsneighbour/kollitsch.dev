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
 *   node src/scripts/content/fetch-youtube-thumbnails.ts --verify       → check every known id is still live on YouTube (no download); exits 1 if any are dead
 *
 * --verify exists because a video can go dead *after* its thumbnail was
 * already downloaded successfully — the normal (non-verify) run only ever
 * looks at ids that don't have a local thumbnail yet, so it can't catch
 * that drift. It's meant for an occasional/scheduled audit, not every
 * commit: it makes one HEAD request per known video id, which is too slow
 * to run on every save.
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
const verify = cliArgs.includes('--verify');
const explicitId = cliArgs.find((arg) => !arg.startsWith('--'));

if (explicitId && !VIDEO_ID_RE.test(explicitId)) {
  console.error(
    `"${explicitId}" is not a valid 11-character YouTube video id.`,
  );
  process.exit(1);
}

const logPath = (filePath: string) =>
  path.relative(process.cwd(), filePath).replace(/\\/g, '/');

/**
 * Maps each referenced video id to the project-relative file(s) it was
 * found in, so a dead-video report can point straight at the content that
 * needs fixing.
 */
async function collectVideoIds(): Promise<Map<string, Set<string>>> {
  const idsToFiles = new Map<string, Set<string>>();

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
          const existing = idsToFiles.get(id) ?? new Set<string>();
          existing.add(logPath(file));
          idsToFiles.set(id, existing);
        }
      }
    }
  }

  return idsToFiles;
}

/**
 * Checks whether a video still exists on YouTube. `hqdefault.jpg` is
 * available for essentially every real video regardless of source
 * resolution, and — unlike the youtube.com watch page, which returns HTTP
 * 200 with a client-rendered "video unavailable" message — genuinely
 * returns a real 404 once a video has been deleted or made private.
 */
async function isVideoLive(videoId: string): Promise<boolean> {
  const response = await fetch(
    `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    { method: 'HEAD' },
  );
  return response.ok;
}

// JPEG magic number (FF D8 FF). Network data is written to disk below, so
// this confirms the response body is actually a JPEG before it's trusted as
// one — see CodeQL js/http-to-file-access (CWE-434/CWE-912):
// https://github.com/davidsneighbour/kollitsch.dev/security/code-scanning/75
function isJpeg(buffer: Buffer): boolean {
  return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
}

async function fetchBestThumbnail(videoId: string): Promise<Buffer> {
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
  throw new Error(`No thumbnail available for video id "${videoId}"`);
}

async function runVerify(idsToFiles: Map<string, Set<string>>) {
  const ids = [...idsToFiles.keys()].sort();
  console.log(`Verifying ${ids.length} unique YouTube video id(s) are still live…`);

  const dead: string[] = [];
  for (const id of ids) {
    const live = await isVideoLive(id);
    console.log(`${live ? '✔' : '✘'} ${id}${live ? '' : ' — no longer available on YouTube'}`);
    if (!live) dead.push(id);
  }

  if (dead.length === 0) {
    console.log(`\nAll ${ids.length} video(s) are still live.`);
    return;
  }

  console.log(`\n${dead.length} of ${ids.length} video(s) are no longer available:\n`);
  for (const id of dead) {
    const files = [...(idsToFiles.get(id) ?? [])].sort();
    console.log(`- ${id}`);
    for (const file of files) console.log(`    ${file}`);
  }
  process.exit(1);
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  const idsToFiles = explicitId
    ? new Map([[explicitId, new Set<string>()]])
    : await collectVideoIds();

  if (verify) {
    await runVerify(idsToFiles);
    return;
  }

  const ids = idsToFiles.keys();
  console.log(
    explicitId
      ? `Fetching thumbnail for video id "${explicitId}".`
      : `Found ${idsToFiles.size} unique YouTube video id(s) referenced in the project.`,
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
