import fs from 'fs';
import { glob } from 'glob';
import path from 'path';

/**
 * Removes a single-line frontmatter key if present.
 * Only affects YAML frontmatter at the top of the file.
 *
 * @param content - The full file content as a string
 * @param key - Frontmatter key to remove
 * @returns The transformed content
 */
function removeFrontmatterKey(content: string, key: string): string {
  const lines = content.split('\n');
  if (lines[0] !== '---') return content;

  const end = lines.findIndex((line, i) => i > 0 && line === '---');
  if (end === -1) return content;

  const keyRegex = new RegExp(`^${key}:\\s?.*`);

  const newLines = [
    lines[0],
    ...lines.slice(1, end).filter((line) => !keyRegex.test(line.trim())),
    lines[end],
    ...lines.slice(end + 1),
  ];

  return newLines.join('\n');
}

// CONFIG
const TARGET_DIR = './src/content/blog';
const FILE_GLOB = '**/*.md';
const FRONTMATTER_KEY = 'fmContentType';

const files = await glob(FILE_GLOB, {
  absolute: true,
  cwd: TARGET_DIR,
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
