// src/scripts/convert-cover-frontmatter.ts
import { glob } from 'glob';
import fs from 'fs';
import path from 'path';

/**
 * Replace shorthand cover: path with expanded cover block.
 * Skips if `cover:` is followed by an indented block.
 */
function transformFrontmatter(content: string): string {
  const lines = content.split('\n');
  const newLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Match only `cover: something` on a single line
    const match = line.match(/^cover:\s+(.+)$/);

    if (match) {
      const nextLine = lines[i + 1] ?? '';
      const isNextIndented = /^\s+/.test(nextLine);

      // Skip if next line is part of a YAML block (object form already)
      if (isNextIndented) {
        newLines.push(line);
        continue;
      }

      // Replace with expanded form
      const imagePath = match[1];
      newLines.push('cover:');
      newLines.push(`  src: ${imagePath}`);
      newLines.push(`  type: image`);
    } else {
      newLines.push(line);
    }
  }

  return newLines.join('\n');
}

// CONFIG
const CONTENT_DIR = './src/content';
const FILE_GLOB = '**/*.md';

const files = await glob(FILE_GLOB, { cwd: CONTENT_DIR, absolute: true });

for (const file of files) {
  const original = fs.readFileSync(file, 'utf-8');
  if (!/^cover:\s/m.test(original)) continue;

  const updated = transformFrontmatter(original);
  if (updated !== original) {
    fs.writeFileSync(file, updated, 'utf-8');
    console.log(`Updated: ${file}`);
  }
}
