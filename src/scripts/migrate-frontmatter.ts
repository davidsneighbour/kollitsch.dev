#!/usr/bin/env node

/**
 * Frontmatter Migration Script for Astro
 *
 * This script migrates Markdown frontmatter from GoHugo format to Astro-compatible format.
 *
 * Features:
 * - Normalizes date fields into ISO 8601 with timezone offset
 * - Moves `publishDate` and `lastmod` into a single `date` field
 * - Extracts `cover` from `resources`, ensures it's relative (`./image.ext`)
 * - Quotes all string values in frontmatter for YAML compatibility
 * - Skips files dirty in Git to protect local changes
 * - Supports CLI flags for custom directory and forcing specific migrations
 *
 * Usage:
 *   node migrate-frontmatter.js
 *   node migrate-frontmatter.js --path=src/content/news
 *   node migrate-frontmatter.js --force=cover-path
 */

import fs from 'fs/promises';
import matter from 'gray-matter';
import yaml from 'js-yaml';
import { glob } from 'glob';
import { execSync } from 'node:child_process';
import path from 'node:path';

//
// Configuration
//
const TARGET_TIMEZONE_OFFSET_HOURS = 7;

// Parse CLI flags
const cliArgs = process.argv.slice(2);

// Extract optional --path and --force arguments
const pathArg = cliArgs.find(arg => arg.startsWith('--path='));
const BLOG_PATH = pathArg
  ? pathArg.replace('--path=', '')
  : './src/content/blog';

const forceMigrations = new Set(
  cliArgs
    .filter(arg => arg.startsWith('--force='))
    .flatMap(arg => arg.replace('--force=', '').split(',')),
);

/**
 * Checks if a given migration key is forced via --force=... CLI.
 */
function isForced(key: string): boolean {
  return forceMigrations.has(key);
}

/**
 * Formats a date value into ISO 8601 with timezone offset.
 */
// biome-ignore lint/suspicious/noExplicitAny: @todo find a good reason why we are lazy to type any(thing) here
function formatDate(value: any): string | null {
  const date = new Date(value);
  if (isNaN(date.getTime())) return null;

  const offsetMs = TARGET_TIMEZONE_OFFSET_HOURS * 60 * 60 * 1000;
  const tzDate = new Date(date.getTime() + offsetMs);

  const YYYY = tzDate.getUTCFullYear();
  const MM = String(tzDate.getUTCMonth() + 1).padStart(2, '0');
  const DD = String(tzDate.getUTCDate()).padStart(2, '0');
  const hh = String(tzDate.getUTCHours()).padStart(2, '0');
  const mm = String(tzDate.getUTCMinutes()).padStart(2, '0');
  const ss = String(tzDate.getUTCSeconds()).padStart(2, '0');

  const sign = TARGET_TIMEZONE_OFFSET_HOURS >= 0 ? '+' : '-';
  const absHours = Math.abs(TARGET_TIMEZONE_OFFSET_HOURS);
  const offsetHH = String(Math.trunc(absHours)).padStart(2, '0');
  const offsetMM = String((absHours % 1) * 60).padStart(2, '0');

  return `${YYYY}-${MM}-${DD}T${hh}:${mm}:${ss}${sign}${offsetHH}:${offsetMM}`;
}

/**
 * Returns true if the file is clean in Git.
 */
function isGitClean(filePath: string): boolean {
  try {
    const output = execSync(`git status --porcelain "${filePath}"`).toString();
    return output.trim() === '';
  } catch (err) {
    console.warn(`⚠️  Could not check Git status of: ${filePath}`);
    console.warn(err);
    return false;
  }
}

/**
 * Replaces matter.stringify with a version that quotes all frontmatter string values.
 * Uses js-yaml to force double quotes on all scalars.
 *
 * @param content - Markdown content body
 * @param data - Frontmatter object
 * @returns Full Markdown string with quoted frontmatter
 */
function stringifyWithQuotedStrings(
  content: string,
  data: Record<string, any>,
): string {
  return matter.stringify(content, data, {
    language: 'yaml',
    engines: {
      yaml: {
        stringify: data =>
          yaml.dump(data, {
            lineWidth: 0, // Do not wrap long lines
            quotingType: '"', // Use double quotes
            forceQuotes: true, // Always quote string scalars
          }),
      },
    },
  });
}

/**
 * Main logic for scanning and migrating Markdown frontmatter.
 */
async function cleanFrontmatter(): Promise<void> {
  try {
    const files = await glob(`${BLOG_PATH}/**/index.md`, { absolute: true });

    if (files.length === 0) {
      console.log(`ℹ️  No index.md files found under: ${BLOG_PATH}`);
      return;
    }

    for (const file of files) {
      try {
        const raw = await fs.readFile(file, 'utf-8');
        const parsed = matter(raw);
        const data = parsed.data;

        const original = data.date || data.publishDate || data.lastmod;
        const formatted = formatDate(original);
        if (!formatted) {
          console.warn(`⚠️  No valid date in ${file}`);
          continue;
        }

        let changed = false;

        // Normalize and unify date
        if (data.date !== formatted) {
          data.date = formatted;
          delete data.publishDate;
          delete data.lastmod;
          changed = true;
        }

        // Extract or fix relative cover path
        const cover = getCoverFromResources(data.resources);
        const needsFix =
          typeof data.cover === 'string' && !data.cover.startsWith('./');

        if (
          (!data.cover && cover) ||
          (isForced('cover-path') && cover && needsFix)
        ) {
          data.cover = ensureRelativeCover(cover);
          changed = true;
        }

        const updated = stringifyWithQuotedStrings(parsed.content, data);

        if (raw !== updated && changed) {
          if (!isGitClean(file)) {
            console.warn(`⏭️  Skipped (dirty in Git): ${file}`);
            continue;
          }

          await fs.writeFile(file, updated, 'utf-8');
          console.log(`✅ Updated frontmatter in: ${file}`);
        } else {
          console.log(`ℹ️  No changes for: ${file}`);
        }
      } catch (err) {
        console.error(`❌ Failed to process ${file}:`, err);
      }
    }
  } catch (err) {
    console.error('❌ Failed to glob files:', err);
    process.exit(1);
  }
}

/**
 * Extracts the first image path from Hugo's resources array.
 */
function getCoverFromResources(resources: unknown): string | undefined {
  if (
    Array.isArray(resources) &&
    resources.length > 0 &&
    typeof (resources[0] as { src?: string }).src === 'string'
  ) {
    return (resources[0] as { src: string }).src;
  }
  return undefined;
}

/**
 * Makes sure the cover image path is relative.
 */
function ensureRelativeCover(cover: string): string {
  if (
    cover.startsWith('./') ||
    cover.startsWith('../') ||
    cover.startsWith('/')
  ) {
    return cover;
  }
  return `./${cover}`;
}

// Run the migration
cleanFrontmatter();
