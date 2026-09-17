#!/usr/bin/env node
// Astro's content-collection loader only ever surfaces the FIRST Zod issue for
// an invalid entry (it formats `error.issues[0]` into the dev overlay / build
// error). That means fixing one frontmatter problem and reloading can just
// reveal the next one, one at a time. This script runs the same `blogSchema`
// directly against every post's frontmatter and prints every failing field at
// once, so all issues in a post are visible together.
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { blogSchema, deriveContentFormat } from '../../content/blog-schema.ts';

const soft = process.argv.includes('--soft');

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

let hasErrors = false;

for (const file of walk('src/content/blog')) {
  const raw = fs.readFileSync(file, 'utf8');
  const { data } = matter(raw);

  const result = blogSchema.safeParse({
    ...data,
    contentFormat: deriveContentFormat(file),
  });

  if (result.success) continue;

  hasErrors = true;
  console.error(`\n✖ ${file}`);
  for (const issue of result.error.issues) {
    const field = issue.path.length > 0 ? issue.path.join('.') : '(root)';
    console.error(`  - ${field}: ${issue.message}`);
  }
}

if (!hasErrors) {
  console.log('✔ All blog post frontmatter is valid.');
}

process.exit(hasErrors && !soft ? 1 : 0);
