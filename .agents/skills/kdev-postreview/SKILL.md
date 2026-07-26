---
id: review-blog-post
name: review-blog-post
title: Review Blog Post
description: "Reviews, improves, validates, and maintains one blog post at a time. Use when asked to review a post, fix post metadata, generate tags, write a description or summary, migrate a cover image, lint a post, or prepare a post for publication."
---

Review and work on a single blog post and its directly associated assets.

Use this skill for tasks such as:

* reviewing an existing post
* validating or correcting frontmatter
* generating or improving tags
* generating or improving the description
* generating or improving the summary
* migrating the cover image
* running repository checks relevant to the post
* preparing a post for publication
* applying future post-level maintenance operations

Work on one post at a time unless the user explicitly requests batch processing.

## Core principles

1. Inspect the repository before assuming its structure or conventions.
2. Treat repository configuration, schemas, existing content, and documented rules as authoritative.
3. Limit changes to the selected post and its directly associated assets unless broader changes are explicitly approved.
4. Preserve the author's meaning, voice, language, and factual claims.
5. Do not fabricate facts, dates, quotations, sources, locations, people, or events.
6. Do not silently remove unusual frontmatter fields.
7. Use repository-native commands and tools.
8. Report uncertain decisions instead of guessing.
9. Keep operations modular so additional post-maintenance capabilities can be added later.

## Inputs

Identify the target post from one of the following:

* an explicit post file path
* a directory containing `index.md` or `index.mdx`
* a post slug
* a URL that can be mapped to repository content
* the currently selected or recently discussed post, when unambiguous

Resolve the post to a concrete path before modifying files.

Expected post forms may include:

```text
src/content/blog/{year}/{slug}/index.md
src/content/blog/{year}/{slug}/index.mdx
```

Do not assume these paths when the repository uses a different content structure.

## Initial repository inspection

Before reviewing the post, inspect the relevant repository configuration.

Look for:

* `AGENTS.md`
* more specific instruction files
* the content collection schema
* frontmatter type definitions
* neighbouring posts
* repository documentation
* package scripts
* lint and validation configuration
* image conventions
* taxonomy or tag definitions
* post-specific utilities or scripts

Useful files may include:

```text
package.json
astro.config.*
src/content.config.*
src/content/config.*
src/content/**/*
README.md
.ai/**/*
.vscode/**/*
```

Determine:

* the package manager
* the post schema
* required frontmatter fields
* optional frontmatter fields
* permitted field types
* repository-specific formatting
* available validation commands
* whether commands can target one post

## Review workflow

Run these phases in order unless the user requests only a specific operation.

1. Identify and inspect the post
2. Validate frontmatter
3. Review generated metadata
4. Review associated assets
5. Apply requested changes
6. Run focused checks
7. Run broader checks when justified
8. Summarise changes and remaining issues

## 1. Identify and inspect the post

Read:

* the complete frontmatter
* the complete post body
* referenced local assets
* nearby or related posts when useful for consistency
* the repository schema and rules

Record internally:

* post path
* slug
* language
* title
* publication date
* current tags
* current description
* current summary
* current cover information
* draft or publication state
* unusual custom fields

Do not edit before understanding the entire post.

## 2. Frontmatter validation

Load the repository's frontmatter rules from:

```text
resources/frontmatter.md
```

Also inspect the actual content schema and existing repository conventions.

Validate:

* required fields are present
* values have the correct types
* dates use the expected format
* path and asset references are valid
* enum-like values are permitted
* arrays contain valid entries
* deprecated fields are identified
* fields are ordered consistently, when the repository enforces ordering
* unknown fields are preserved and reported
* generated metadata matches the post content
* draft and publication fields do not contradict each other

Classify findings as:

* **error** — violates the schema or breaks repository checks
* **warning** — likely incorrect, outdated, inconsistent, or incomplete
* **suggestion** — optional editorial improvement
* **valid** — checked and accepted

Do not invent a missing value merely to satisfy the schema. Generate editorial metadata only where this skill explicitly permits it.

## 3. Metadata generation

Metadata generation rules live in:

```text
resources/metadata-generation.md
```

The initial supported generated fields are:

* tags
* description
* summary

### Tags

Generate tags from the subject matter of the post, not from its format.

Good tags describe:

* central topics
* named places
* relevant people
* organisations
* technologies
* events
* recurring series
* important concepts

Avoid generic format tags such as:

```text
article
blog
blogpost
post
news
website
```

unless the repository explicitly uses them as taxonomy terms.

Before adding tags:

1. inspect existing tags across the repository
2. prefer established spelling and capitalisation
3. identify synonyms and near-duplicates
4. reuse existing taxonomy terms where accurate
5. avoid tags supported only by incidental mentions
6. avoid excessive tagging
7. preserve valid existing tags unless they are demonstrably wrong

When replacing or removing a tag, explain why.

### Description

Generate a concise standalone description suitable for listings and metadata.

The description should:

* accurately state what the post is about
* identify its most important distinguishing detail
* make sense outside the post page
* avoid unsupported claims
* avoid generic openings
* avoid repeating the title verbatim
* use the post's language
* follow repository-specific length limits

Do not turn the description into promotional clickbait unless that is the established editorial style.

### Summary

Generate a compact editorial summary of the post.

The summary should:

* capture the main point or narrative
* preserve important context
* reflect the actual post rather than only its introduction
* differ meaningfully from the description
* use the post's language
* follow repository-specific length limits

By default:

* the description explains what the reader will find
* the summary condenses what the post says

If the repository defines these fields differently, follow the repository definition.

### Editorial safeguards

When generating metadata:

* do not introduce facts absent from the post
* do not resolve ambiguities without evidence
* do not modernise historical language unless requested
* do not translate the post unless requested
* do not change the author's viewpoint
* do not expose private editorial notes in public metadata
* flag posts whose content is too unclear to summarise reliably

## 4. Associated asset review

Inspect assets directly referenced by the post.

Initially supported asset maintenance includes cover-image migration.

Load its complete procedure from:

```text
resources/cover-image-migration.md
```

Do not migrate images automatically unless requested or clearly included in the current task.

## 5. Apply changes

Before modifying the post:

1. distinguish required fixes from optional editorial changes
2. preserve formatting and unrelated frontmatter
3. avoid rewriting the post body unless requested
4. keep the diff limited to the selected post and associated assets
5. verify any destination path before moving or deleting files

When several valid editorial choices exist, present the recommended choice and explain material alternatives.

Do not stop for confirmation when the correct action is established by repository rules and the requested task. Ask only when an irreversible or genuinely ambiguous choice cannot be resolved from the repository.

## 6. Focused validation

Run the narrowest checks that meaningfully validate the selected post.

Prefer, in order:

1. a repository-provided post-specific validation command
2. a content collection or schema validation command
3. a formatter or linter scoped to the post
4. a local asset-reference check
5. a repository-wide command when focused validation is unavailable

Examples may include:

```bash
npm run lint -- --files "src/content/blog/{year}/{slug}/index.md"
npm run check:content
npm run validate
npm run astro check
npx biome check "src/content/blog/{year}/{slug}/index.md"
```

These are examples only. Inspect `package.json` and repository documentation before selecting commands.

Never assume a command supports file arguments. Check its definition first.

## 7. Repository checks

Run the repository's established non-mutating quality gates relevant to the change.

Possible checks include:

* Markdown linting
* frontmatter schema validation
* content collection validation
* Astro checks
* Biome checks
* TypeScript checks
* broken-reference checks
* image validation
* build validation
* repository-specific post audits

Do not run mutating formatters across the entire repository unless explicitly required.

If a full repository check fails for unrelated existing reasons:

1. identify which failures relate to the selected post
2. separate unrelated failures clearly
3. do not repair unrelated files without approval
4. report the exact command and relevant failure

## 8. Final verification

After changes:

* re-read the final frontmatter
* confirm generated metadata reflects the post
* confirm referenced files exist
* confirm old asset references were removed where intended
* inspect the diff
* ensure no unrelated files changed
* rerun relevant checks after the final edit

## Result format

Return a concise report with these sections.

### Post

* path
* slug
* language
* publication state

### Changes

List each changed field or asset and the reason.

### Metadata

Show the final:

* tags
* description
* summary

### Validation

For each command:

```text
PASS — command
FAIL — command
SKIPPED — command and reason
```

### Remaining issues

List unresolved errors, warnings, ambiguous editorial decisions, or unrelated repository failures.

If nothing remains, state:

```text
No unresolved post-level issues found.
```

## Extension system

Additional post-maintenance operations should be documented as separate files under:

```text
resources/
```

Register each operation in:

```text
resources/extensions.md
```

Each extension should define:

* operation name
* purpose
* trigger conditions
* required inspection
* permitted changes
* questions that require user input
* validation steps
* cleanup steps
* result fields

Potential future extensions include:

* canonical URL review
* SEO metadata review
* link validation
* heading hierarchy review
* image alt-text generation
* image optimisation
* legacy markup migration
* taxonomy migration
* related-post suggestions
* structured-data validation
* editorial note processing
* publication-date repair
* redirects
* location, person, or event taxonomy extraction

Extensions must not override repository instructions or the core safety constraints in this skill.

## Batch mode

Batch processing is allowed only when explicitly requested.

For batch work:

1. process posts individually
2. keep separate findings for each post
3. do not infer that one editorial decision applies to all posts
4. stop destructive shared-asset operations when ownership is ambiguous
5. run post-level checks after each post where practical
6. provide an aggregate summary after all posts

Suggested final table:

| Post | Frontmatter | Metadata | Assets | Checks | Result |
| -------- | ----------- | -------- | --------- | ------ | ------ |
| `{slug}` | fixed | updated | unchanged | passed | ready |
