import path from 'path';
import fs from 'fs/promises';
import { glob } from 'glob';
import matter from 'gray-matter';
import { blogSchema } from '../content/config.ts';

type Frontmatter = Record<string, unknown>;

/**
 * Load a single Markdown file, extract frontmatter, and validate against blogSchema.
 *
 * @param filePath
 * @returns void (throws on fatal errors)
 */
async function validateFile(filePath: string): Promise<void> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8');
    const { data: frontmatter } = matter(raw) as {
      data: Frontmatter;
      content: string;
    };

    // Attempt to parse + transform via Zod
    const parsed = blogSchema.parse(frontmatter);
    console.log(`✅ [VALID]  ${filePath}`);
    console.log(parsed);
  } catch (err: unknown) {
    console.error(`❌ [INVALID] ${filePath}`);
    if (err instanceof Error) {
      console.error(`   ${err.message}`);
    } else {
      console.error(`   Unknown validation error:`, err);
    }
  }
}

/**
 * Main entrypoint:
 * 1. Find all Markdown files under src/content/blog/
 * 2. Validate each one.
 */
async function main(): Promise<void> {
  // Adjust the glob pattern to wherever you keep your .md files:
  const BLOG_GLOB = 'src/content/blog/**/index.md';

  try {
    const files: string[] = await new Promise((resolve, reject) => {
      glob(BLOG_GLOB, (err, matches) => {
        if (err) reject(err);
        else resolve(matches);
      });
    });

    if (files.length === 0) {
      console.warn('⚠️  No Markdown files found for pattern:', BLOG_GLOB);
      return;
    }

    for (const file of files) {
      await validateFile(file);
    }
  } catch (err: unknown) {
    console.error('Fatal error while searching for Markdown files:', err);
    process.exit(1);
  }
}

if (
  import.meta.url ===
  `file://${process.cwd()}/${path.basename(import.meta.url)}`
) {
  // If this file is run directly: node scripts/validate-frontmatter.ts
  main().catch((e) => {
    console.error('Unhandled error in validation script:', e);
    process.exit(1);
  });
}
