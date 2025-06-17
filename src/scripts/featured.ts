#!/usr/bin/env node

/**
 * Manage `featured: true` tags in Markdown frontmatter
 *
 * Commands:
 *   node check_featured.ts         → Defaults to 'list'
 *   node check_featured.ts list    → Lists all posts with `featured: true`
 *   node check_featured.ts clean   → Removes all `featured: true` tags
 *   node check_featured.ts show    → Prints the post selected as featured for the homepage
 */

import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';
import { glob } from 'glob';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const COLLECTION = 'blog';
const CONTENT_PATH = path.resolve(__dirname, '../content', COLLECTION);
const SITEINFO_PATH = path.resolve(__dirname, '../data/setup.json');

const command = process.argv[2] ?? 'list';

const logPath = (filePath: string) =>
  path.relative(process.cwd(), filePath).replace(/\\/g, '/');

async function loadSiteinfo() {
  const raw = await fs.readFile(SITEINFO_PATH, 'utf8');
  return JSON.parse(raw);
}

async function getAllFiles() {
  return await glob(`${CONTENT_PATH}/**/*.md`);
}

async function parsePosts() {
  const files = await getAllFiles();
  const posts = [];

  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const parsed = matter(content);

    const date = new Date(parsed.data.date);
    if (isNaN(date.getTime())) continue;

    posts.push({
      file,
      slug: path.basename(file, '.md'),
      data: parsed.data,
      date,
    });
  }

  return posts
    .filter((post) => post.data.draft !== true)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
}

async function listFeaturedPosts() {
  const files = await getAllFiles();
  let count = 0;
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const { data } = matter(content);
    if (data.featured === true) {
      console.log(`✔ featured: ${logPath(file)}`);
      count++;
    }
  }
  if (count === 0) console.log('No posts with `featured: true` found.');
}

async function cleanFeaturedFlags() {
  const files = await getAllFiles();
  let count = 0;
  for (const file of files) {
    const content = await fs.readFile(file, 'utf8');
    const parsed = matter(content);
    if (parsed.data.featured === true) {
      delete parsed.data.featured;
      const updated = matter.stringify(parsed.content, parsed.data);
      await fs.writeFile(file, updated, 'utf8');
      console.log(`✘ removed: ${logPath(file)}`);
      count++;
    }
  }
  if (count === 0) console.log('No `featured: true` tags found to clean.');
}

async function showCurrentFeatured() {
  const siteinfo = await loadSiteinfo();
  const limit = siteinfo.homepage?.recent_posts ?? 6;

  const posts = await parsePosts();
  const featured = posts.find((p) => p.data.featured === true) || posts[0];

  if (!featured) {
    console.log(
      '⚠ No valid post found (no posts or all are drafts/malformed).',
    );
    return;
  }

  console.log(`📌 Current homepage featured post:`);
  console.log(`  → ${featured.slug}`);
  console.log(`  → Title: ${featured.data.title}`);
  console.log(`  → Date: ${featured.data.date}`);
  console.log(`  → Path: ${logPath(featured.file)}`);

  const recent = posts
    .filter((p) => p.file !== featured.file)
    .slice(0, limit)
    .map((p) => `  - ${p.slug} (${logPath(p.file)})`);

  console.log(`📰 ${limit} recent posts shown after featured:`);
  console.log(recent.join('\n'));
}

switch (command) {
  case 'list':
    await listFeaturedPosts();
    break;
  case 'clean':
    await cleanFeaturedFlags();
    break;
  case 'show':
    await showCurrentFeatured();
    break;
  default:
    console.error(`Unknown command: ${command}`);
    process.exit(1);
}
