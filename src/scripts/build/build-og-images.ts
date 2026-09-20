#!/usr/bin/env node
/**
 * Pre-generate social/OG images for blog posts.
 *
 * Runs outside Astro/Vite (plain Node), so it reads blog frontmatter
 * directly via gray-matter + the Node-safe `blogSchema` (see
 * src/content/blog-schema.ts and src/scripts/linting/lint-frontmatter.ts
 * for the same pattern), rather than via `astro:content`.
 *
 * See scratch/og-image-generation.plan.md for the full design.
 *
 * Usage:
 *   node src/scripts/build/build-og-images.ts
 *     → incremental: generate missing/stale images, prune orphans, ensure default.jpg
 *   node src/scripts/build/build-og-images.ts --force
 *     → regenerate every image (including default.jpg) unconditionally
 *   node src/scripts/build/build-og-images.ts --check
 *     → validate only (missing/stale/orphans); writes nothing; exits non-zero on problems
 *   node src/scripts/build/build-og-images.ts --file="src/content/blog/2026/foo/index.md" [--file=...]
 *     → only (re)generate the given posts' images; still prunes orphans and ensures default.jpg exists
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fg from 'fast-glob';
import matter from 'gray-matter';
import { blogSchema, deriveContentFormat } from '../../content/blog-schema.ts';
import {
  backgroundImageCandidates,
  type PostImageIdentity,
  resolveCoverImageKey,
} from '../../utils/social-image/cover-image.ts';
import { formatDisplayDate } from '../../utils/social-image/format-date.ts';
import { computeFingerprint } from '../../utils/social-image/fingerprint.ts';
import {
  renderSocialImage,
  toBackgroundImageSrc,
} from '../../utils/social-image/generate.ts';
import {
  type Manifest,
  readManifest,
  writeManifest,
} from '../../utils/social-image/manifest.ts';
import {
  getBlogSocialImageFsPath,
  getDefaultSocialImageFsPath,
  SOCIAL_IMAGE_HEIGHT,
  SOCIAL_IMAGE_WIDTH,
} from '../../utils/social-image/paths.ts';
import {
  siteAuthorName,
  siteDefaultImageKey,
  siteOgImageKey,
  siteTitle,
} from '../../utils/social-image/site-info.ts';

const CONTENT_ROOT = path.resolve(process.cwd(), 'src/content/blog');
const OG_FORMAT = 'jpeg' as const;

// ---------- CLI args ----------

interface CliOptions {
  force: boolean;
  check: boolean;
  files: string[] | null; // null = full scan
}

export function parseArgs(argv: string[]): CliOptions {
  const force = argv.includes('--force');
  const check = argv.includes('--check');
  const files = argv
    .filter((a) => a.startsWith('--file='))
    .map((a) => path.resolve(process.cwd(), a.slice('--file='.length)));
  return { check, files: files.length > 0 ? files : null, force };
}

// ---------- Frontmatter parsing (Vite-independent) ----------

interface ParsedPost {
  id: string; // '2026/example-post'
  file: string; // absolute fs path
  title: string; // plain text, postfixed
  date: Date | undefined;
  lastModified: Date | undefined;
  draft: boolean;
  cover: PostImageIdentity['cover'];
}

export function idFromFile(file: string): string {
  const rel = path.relative(CONTENT_ROOT, file).replace(/\\/g, '/');
  return rel.replace(/\.(md|mdx)$/i, '').replace(/\/index$/, '');
}

function stripHtmlTags(value: string): string {
  return value.replace(/<[^>]*>/g, '');
}

function parsePostFile(file: string): ParsedPost | undefined {
  const raw = fs.readFileSync(file, 'utf8');
  const { data } = matter(raw);

  const result = blogSchema.safeParse({
    ...data,
    contentFormat: deriveContentFormat(file),
  });

  if (!result.success) {
    const fields = result.error.issues
      .map((issue) => issue.path.join('.') || '(root)')
      .join(', ');
    console.error(`✖ ${file}: invalid frontmatter, skipping (${fields})`);
    return undefined;
  }

  // Image titles use the same plain-text preference as resolvePostTitle()
  // in src/utils/content.ts (linktitle, then title; HTML tags stripped).
  // The schema's `title` field is markdown-rendered to HTML for page
  // display, so the raw (pre-transform) value is used here instead.
  const rawTitle =
    (typeof data['linktitle'] === 'string' && data['linktitle'].trim()) ||
    (typeof data['title'] === 'string' && data['title'].trim()) ||
    siteTitle;
  const title = `${stripHtmlTags(rawTitle)}${setupHeadPostfix()}`;

  return {
    cover: result.data.cover,
    date: result.data.date,
    draft: result.data.draft ?? false,
    file,
    id: idFromFile(file),
    lastModified: result.data.lastModified,
    title,
  };
}

let cachedPostfix: string | undefined;
function setupHeadPostfix(): string {
  if (cachedPostfix === undefined) {
    // Deliberately re-read here rather than importing setup.json a second
    // time: keeps this module's only site.json dependency inside
    // site-info.ts, matched against the same 'head.postfix' field
    // src/utils/content.ts uses.
    const setupPath = path.resolve(process.cwd(), 'src/data/setup.json');
    const raw = JSON.parse(fs.readFileSync(setupPath, 'utf8')) as {
      head?: { postfix?: string };
    };
    cachedPostfix = raw.head?.postfix ?? '';
  }
  return cachedPostfix;
}

async function loadAllPosts(): Promise<ParsedPost[]> {
  const files = await fg('**/*.{md,mdx}', {
    absolute: true,
    cwd: CONTENT_ROOT,
  });
  const posts: ParsedPost[] = [];
  for (const file of files) {
    const post = parsePostFile(file);
    if (post) posts.push(post);
  }
  return posts;
}

// ---------- Image resolution (fs-backed, no Vite) ----------

function existsFs(key: string): boolean {
  if (/^https?:\/\//i.test(key)) return true;
  const rel = key.replace(/^\/+/, '');
  return fs.existsSync(path.resolve(process.cwd(), rel));
}

// ---------- Pure decision logic (unit-tested directly) ----------

/**
 * Whether a post's image needs (re)generation: forced, missing on disk, or
 * its stored fingerprint no longer matches the freshly computed one.
 */
export function isImageStale(
  force: boolean,
  fileExists: boolean,
  storedFingerprint: string | undefined,
  currentFingerprint: string,
): boolean {
  return force || !fileExists || storedFingerprint !== currentFingerprint;
}

/**
 * Whether default.jpg should be (re)generated. In `--file` mode (lint-staged,
 * one post at a time) an unrelated post commit must not force-rewrite the
 * shared default image just because its fingerprint drifted — only its
 * absence triggers generation there. Full/`--force` runs regenerate on any
 * staleness.
 */
export function shouldGenerateDefault(
  opts: Pick<CliOptions, 'files' | 'force'>,
  fileExists: boolean,
  fingerprintStale: boolean,
): boolean {
  if (opts.force) return true;
  if (opts.files) return !fileExists;
  return !fileExists || fingerprintStale;
}

/** Social-image files with no corresponding blog post left. Pure set diff. */
export function computeOrphans(
  validPaths: ReadonlySet<string>,
  existingFiles: readonly string[],
): string[] {
  return existingFiles.filter((f) => !validPaths.has(f));
}

// ---------- Generation ----------

type PostStatus = 'generated' | 'ok' | 'missing' | 'stale';

interface ProcessResult {
  fsPath: string;
  status: PostStatus;
}

/**
 * Cheap (fs.existsSync-only, no Sharp) candidate selection — used for every
 * post on every run, including `--check`, to compute the fingerprint. The
 * chosen key only gets decoded/resized (via `resolveBackgroundPixels`) when
 * a render is actually about to happen, so `--check` and no-op incremental
 * runs stay fast regardless of blog size.
 */
function resolveBackgroundKey(
  cover: PostImageIdentity['cover'],
  id: string,
): string {
  const resolvedArticleImageKey = resolveCoverImageKey(
    { collection: 'blog', cover, id },
    existsFs,
    siteDefaultImageKey,
    siteOgImageKey,
  );
  const candidates = backgroundImageCandidates(
    resolvedArticleImageKey,
    siteDefaultImageKey,
    siteOgImageKey,
  );
  return candidates.find((candidate) => existsFs(candidate)) ?? 'none';
}

/** Decode/resize the already-chosen background key. Only call when rendering. */
async function resolveBackgroundPixels(backgroundImageKey: string): Promise<string> {
  if (backgroundImageKey === 'none') return '';
  const src = await toBackgroundImageSrc(
    backgroundImageKey,
    SOCIAL_IMAGE_WIDTH,
    SOCIAL_IMAGE_HEIGHT,
  );
  return src ?? '';
}

function writeImageAtomic(absPath: string, buffer: Buffer): void {
  fs.mkdirSync(path.dirname(absPath), { recursive: true });
  const tmp = `${absPath}.tmp-${process.pid}-${Date.now()}`;
  fs.writeFileSync(tmp, buffer);
  fs.renameSync(tmp, absPath);
}

async function processPost(
  post: ParsedPost,
  manifest: Manifest,
  opts: CliOptions,
): Promise<ProcessResult | undefined> {
  const fsPath = getBlogSocialImageFsPath(post.id);
  if (!fsPath) return undefined; // id doesn't match '<year>/<slug>'; shouldn't happen for blog

  const absPath = path.resolve(process.cwd(), fsPath);
  const backgroundImageKey = resolveBackgroundKey(post.cover, post.id);
  const postDateDisplay = formatDisplayDate(post.lastModified ?? post.date);

  const fingerprint = computeFingerprint({
    author: siteAuthorName,
    backgroundImage: backgroundImageKey,
    date: post.date?.toISOString(),
    format: OG_FORMAT,
    height: SOCIAL_IMAGE_HEIGHT,
    modifiedDate: post.lastModified?.toISOString(),
    siteTitle,
    title: post.title,
    width: SOCIAL_IMAGE_WIDTH,
  });

  const fileExists = fs.existsSync(absPath);
  const existingEntry = manifest[fsPath];
  const stale = isImageStale(
    opts.force,
    fileExists,
    existingEntry?.fingerprint,
    fingerprint,
  );

  if (opts.check) {
    if (!fileExists) return { fsPath, status: 'missing' };
    if (stale) return { fsPath, status: 'stale' };
    return { fsPath, status: 'ok' };
  }

  if (!stale) return { fsPath, status: 'ok' };

  const backgroundSrc = await resolveBackgroundPixels(backgroundImageKey);
  const rendered = await renderSocialImage({
    backgroundSrc,
    format: OG_FORMAT,
    height: SOCIAL_IMAGE_HEIGHT,
    postDateDisplay,
    title: post.title,
    width: SOCIAL_IMAGE_WIDTH,
  });
  writeImageAtomic(absPath, rendered.buffer);
  manifest[fsPath] = { fingerprint, generatedAt: new Date().toISOString() };
  return { fsPath, status: 'generated' };
}

async function processDefaultImage(
  manifest: Manifest,
  opts: CliOptions,
): Promise<ProcessResult> {
  const fsPath = getDefaultSocialImageFsPath();
  const absPath = path.resolve(process.cwd(), fsPath);
  const fileExists = fs.existsSync(absPath);

  const fingerprint = computeFingerprint({
    author: siteAuthorName,
    backgroundImage: siteOgImageKey,
    format: OG_FORMAT,
    height: SOCIAL_IMAGE_HEIGHT,
    siteTitle,
    title: siteTitle,
    width: SOCIAL_IMAGE_WIDTH,
  });
  const existingEntry = manifest[fsPath];
  const fingerprintStale = isImageStale(
    opts.force,
    fileExists,
    existingEntry?.fingerprint,
    fingerprint,
  );

  if (opts.check) {
    if (!fileExists) return { fsPath, status: 'missing' };
    if (fingerprintStale) return { fsPath, status: 'stale' };
    return { fsPath, status: 'ok' };
  }

  if (!shouldGenerateDefault(opts, fileExists, fingerprintStale)) {
    return { fsPath, status: 'ok' };
  }

  const backgroundSrc = await toBackgroundImageSrc(
    siteOgImageKey,
    SOCIAL_IMAGE_WIDTH,
    SOCIAL_IMAGE_HEIGHT,
  );
  const rendered = await renderSocialImage({
    backgroundSrc: backgroundSrc ?? '',
    format: OG_FORMAT,
    height: SOCIAL_IMAGE_HEIGHT,
    postDateDisplay: '',
    title: siteTitle,
    width: SOCIAL_IMAGE_WIDTH,
  });
  writeImageAtomic(absPath, rendered.buffer);
  manifest[fsPath] = { fingerprint, generatedAt: new Date().toISOString() };
  return { fsPath, status: 'generated' };
}

// ---------- Orphan pruning ----------

function pruneOrphans(
  allPosts: ParsedPost[],
  manifest: Manifest,
  opts: CliOptions,
): string[] {
  const validPaths = new Set(
    allPosts
      .map((p) => getBlogSocialImageFsPath(p.id))
      .filter((p): p is string => Boolean(p)),
  );

  const existingFiles = fg.sync('public/images/social/blog/**/*.jpg', {
    cwd: process.cwd(),
  });
  const orphans = computeOrphans(validPaths, existingFiles);

  if (!opts.check) {
    for (const orphan of orphans) {
      fs.rmSync(path.resolve(process.cwd(), orphan));
      delete manifest[orphan];
    }
  }

  return orphans;
}

// ---------- Main ----------

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));
  const manifest = readManifest();

  // Drafts are generated and tracked too — a draft is a normal, previewable
  // state on the way to publishing, not a reason to withhold its social
  // image (see scratch/og-image-generation.plan.md "Draft posts").
  const allPosts = await loadAllPosts();

  // --check always audits the whole repo; --file only narrows generation.
  const targetPosts =
    !opts.check && opts.files
      ? allPosts.filter((p) => opts.files!.includes(p.file))
      : allPosts;

  const results: ProcessResult[] = [];
  for (const post of targetPosts) {
    const result = await processPost(post, manifest, opts);
    if (result) results.push(result);
  }

  const defaultResult = await processDefaultImage(manifest, opts);
  results.push(defaultResult);

  const orphans = pruneOrphans(allPosts, manifest, opts);

  if (!opts.check) {
    writeManifest(manifest);
  }

  const generated = results.filter((r) => r.status === 'generated');
  const missing = results.filter((r) => r.status === 'missing');
  const stale = results.filter((r) => r.status === 'stale');

  if (opts.check) {
    for (const r of missing) console.error(`✖ missing: ${r.fsPath}`);
    for (const r of stale) console.error(`✖ stale: ${r.fsPath}`);
    for (const o of orphans) console.error(`✖ orphaned: ${o}`);

    const problems = missing.length + stale.length + orphans.length;
    if (problems > 0) {
      console.error(`\n✖ ${problems} social-image issue(s) found.`);
      process.exit(1);
    }
    console.log(`✔ All ${results.length} social images are present and current.`);
    return;
  }

  console.log(
    `✔ ${generated.length} generated, ${results.length - generated.length} unchanged, ${orphans.length} orphan(s) pruned.`,
  );
}

function isMainModule(): boolean {
  return process.argv[1] === fileURLToPath(import.meta.url);
}

if (isMainModule()) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
