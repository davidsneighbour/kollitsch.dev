# Tags

## Purpose

Validate topical classification and canonical tag syntax.

## Input

Post body, `.agents/instructions/content-blog.instructions.md`, `src/content/tags/`, `src/utils/tags.ts`, and `documentation/content/tags.md`.

## Verify

Lowercase ASCII kebab-case IDs, one per YAML block-list line, no duplicates, accurate central topics, canonical vocabulary, and no incidental or redundant synonyms.

## Method

Inspect the raw tags and existing taxonomy/alias consumers. Use frontmatter validation when type or schema evidence is needed. Do not assume an undocumented tag is automatically invalid.

## Output

Existing/proposed tags and reasons for removals or renaming.

## Pass/fail

Syntax and binding formatting violations fail; weak topical choices or potential synonyms warn. No arbitrary tag-count limit.

## Remediation

Use `../resources/metadata-generation.md` when generation is requested. Reuse canonical IDs and preserve valid tags.
