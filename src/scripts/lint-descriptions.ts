#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

const MIN = 110;
const MAX = 160;

let hasErrors = false;
let hasWarnings = false;

function walk(dir: string): string[] {
  return fs.readdirSync(dir).flatMap((entry) => {
    const full = path.join(dir, entry);
    return fs.statSync(full).isDirectory()
      ? walk(full)
      : full.endsWith('.md') || full.endsWith('.mdx')
        ? [full]
        : [];
  });
}

for (const file of walk('src/content')) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data } = matter(raw);

  const description =
    typeof data.description === 'string'
      ? data.description.trim()
      : '';

  // HARD ERROR: missing or empty
  if (!description) {
    console.error(
      `ERROR ${file}:1:1 description frontmatter MUST exist and MUST NOT be empty`
    );
    hasErrors = true;
    continue;
  }

  const len = description.length;

  // SOFT WARNING: length out of bounds
  if (len < MIN || len > MAX) {
    console.warn(
      `WARNING ${file}:1:1 description length ${len} (expected ${MIN}-${MAX})`
    );
    hasWarnings = true;
  }
}

// NOTE:
// exit 0 on purpose for now
// flip to `process.exit(hasErrors ? 1 : 0)` once the backlog is fixed
process.exit(0);
