# Frontmatter

## Purpose

Validate raw post metadata against the current schema and binding formatting rules.

## Input

`src/content/blog-schema.ts`, `src/content.config.ts`, `documentation/content/frontmatter.md`, and raw YAML.

## Verify

Required fields/types, cover refinements, `linktitle`, dates, enums, and nested options. Compare unknown/legacy keys with consumers; preserve them. Do not write generated `contentFormat`, rendered HTML, or schema defaults back to source.

## Method

Run `node src/scripts/linting/lint-frontmatter.ts` from the root: it scans all blog posts and has no file selector. Attribute findings to the selected post and report baseline failures separately. Do not use `--soft` as a passing gate. Inspect raw source for rules that parsing normalises, including tag casing and block-list syntax.

## Output

All schema issues, unknown fields, raw-source violations, and repository scan boundaries.

## Pass/fail

Schema or binding source-rule violations fail. Unknown fields without established violations warn. Missing validator prerequisites block.

## Remediation

Fix only established defects with supported values. Preserve dates and unknown fields; inspect consumers before proposing legacy-field removal.
