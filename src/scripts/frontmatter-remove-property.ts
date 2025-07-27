// src/scripts/remove-frontmatter-key.ts
import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

/**
 * Removes a single-line frontmatter key if present.
 * Skips any multi-line values or nested blocks.
 *
 * @param content - The full file content as a string
 * @param key - Frontmatter key to remove
 * @returns The transformed content
 */
function removeFrontmatterKey(content: string, key: string): string {
  const keyRegex = new RegExp(`^${key}:.*$`);
  const lines = content.split('\n');
  const newLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (keyRegex.test(line.trim())) continue;
    newLines.push(line);
  }

  return newLines.join('\n');
}

// CONFIG
const TARGET_DIR = './src/content/blog';
const FILE_GLOB = '**/*.md';
const FRONTMATTER_KEY = 'type';

const files = await glob(FILE_GLOB, {
  cwd: TARGET_DIR,
  absolute: true,
});

for (const file of files) {
  const original = fs.readFileSync(file, 'utf-8');

  if (!new RegExp(`^${FRONTMATTER_KEY}:\\s`, 'm').test(original)) continue;

  const updated = removeFrontmatterKey(original, FRONTMATTER_KEY);

  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf-8');
    console.log(`Removed ${FRONTMATTER_KEY} from: ${file}`);
  }
}
