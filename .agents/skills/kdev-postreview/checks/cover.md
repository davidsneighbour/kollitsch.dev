# Cover

## Purpose

Verify image/video cover configuration and the mandatory image location convention.

## Input

Schema, `.agents/instructions/content-post-images.instructions.md`, `src/utils/cover.ts`, `src/utils/opengraph.ts`, and `documentation/content/article-images.md`.

## Verify

Optional cover; image/video union and refinements, resolved assets, meaningful alt/title relationship, source extension, naming, shared references, and fallback behaviour. A fallback rendering alone does not prove the specified image exists.

## Method

Inspect schema and resolve the actual source through current consumers. Check references across the repository before file operations; inspect the image when judging `cover.alt` text. Use rendered evidence when requested/publishing.

## Output

Cover type, resolved path, sharing, missing source, convention defects, and migration requirements.

## Pass/fail

Schema, missing specified asset, or binding image-convention violations fail. No cover is not itself an error. Missing necessary visual evidence blocks.

## Remediation

Follow `../resources/cover-image-migration.md`. Editing content/frontmatter requires non-conforming image migration. Preserve source format, shared assets, and unrelated cover properties; ask for ambiguous names.
