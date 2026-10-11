# SEO

## Purpose

Review descriptions, summaries, and metadata consumed by the page head.

## Input

`src/content/blog-schema.ts`, `src/scripts/linting/lint-descriptions.ts`, `src/components/layout/head/Head.astro`, `src/utils/opengraph.ts`, and `src/components/seo/schema/BlogPosting.astro`.

## Verify

Non-empty, accurate description; the skill editorial maximum is 160 characters, with 140-160 preferred and key detail early. An optional summary may fall back to description; do not require a distinct summary. Inspect canonical, robots, social-image, and structured-data inputs without inventing new frontmatter SEO keys.

## Method

Count the trimmed description on the selected post. The repository description script scans all `src/content`, has no file selector, and warns outside 110-160 without failing on length. Distinguish that warning from this skill editorial rule. Inspect head consumers; when rendered metadata is requested or publishing, check the actual page output and report missing render evidence as blocked.

## Output

Description length, summary/fallback, factual fit, canonical/robots/social/schema evidence, and warning versus editorial failure.

## Pass/fail

Missing description or a description over the skill maximum fails; outside the preferred range warns. Missing optional summary passes. Unverified required rendered metadata blocks.

## Remediation

Generate only from the complete post using `../resources/metadata-generation.md`. Do not add keywords or facts. Do not change shared head components during post review.
