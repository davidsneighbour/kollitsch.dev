---
name: kdev-postreview
description: Review, edit, or prepare kollitsch.dev blog posts for publication using selectable checks for frontmatter, tags, SEO, cover, media, links, spelling, prose, Markdown, and publication readiness.
---

# Review, edit, and publish posts

Work on one resolved post and its directly associated assets. Accept a file, post directory, slug, URL, or unambiguous current post. Resolve it to `src/content/blog/{year}/{slug}/index.md` or `index.mdx`; ask when multiple posts match. Batch processing requires an explicit post set. Repository-wide link cleanup requires an explicit repository scope.

## Authority and boundaries

Read `AGENTS.md`, check `RESUME.md`, and evaluate all `.agents/instructions/` files before work. Apply rules for the selected post, assets, and any other files changed. Read `DESIGN.md` for visual decisions. The schema, tool configuration, and binding instructions outrank this skill's guidance; report conflicts rather than silently weakening rules. Read `documentation/development/known-false-positives.md` before diagnosing unexpected validation failures.

Preserve authorial meaning, factual claims, British English, plain quotes, custom fields, and unrelated changes. Do not fabricate dates, sources, or metadata. Read the entire post before editing or generating metadata. Do not widen content scope because a tool scans the repository.

## Invocation and selection

Invocation is interpreted by the agent; this is not a new CLI or an executable test runner.

```text
$kdev-postreview review src/content/blog/2026/example/index.md checks=links,orthography
$kdev-postreview edit example checks=tags,seo
$kdev-postreview review example scopes=frontmatter,language
$kdev-postreview edit example checks=cover operation=cover-migration
$kdev-postreview publish example
```

Choose a mode: `review` reports without content edits; `edit` applies authorised fixes; `publish` prepares the post, validates it, and performs only authorised publication actions. A bare review request defaults to `review`. An explicit editing or publishing request selects that mode. Preparing for publication does not itself authorise deployment.

Read [the registry](checks/index.md), expand named scopes or presets, deduplicate check IDs, and read only the selected definitions plus [the shared contract](resources/check-contract.md). Accept `checks=` or `scopes=` and clear natural-language equivalents. Reject unknown IDs with the available choices before running checks. `all` selects every check. Explicit selection replaces the default review preset. `publish` always includes the publish preset; extra selections add to it. Mandatory repository gates and consequences of edits cannot be disabled by selection.

## Orchestration

1. Resolve the target and inspect its complete source, assets, applicable rules, current Git state, and relevant tool definitions. Announce mode, resolved paths, expanded checks, and any mandatory additions.
2. Run selected checks using their contracts. Separate automatic findings from editorial judgement. Record unavailable tools, network restrictions, and missing evidence as `BLOCKED`, never `PASS`.
3. In `edit` or `publish`, apply requested corrections within scope. Metadata generation uses [the metadata procedure](resources/metadata-generation.md). Cover migration uses [the migration procedure](resources/cover-image-migration.md). Link remediation always uses [the item-level decision procedure](resources/link-review.md), including its interactive choices and maintenance markers. Review-only link checks stop at diagnosis.
4. Editing an existing post's content or frontmatter requires cover migration when its image violates `.agents/instructions/content-post-images.instructions.md`, even when `cover` was not selected. Inspect sharing and naming ambiguity before moving files. This does not create a requirement to add a cover to posts without one or to migrate video covers as images.
5. Re-run affected checks after the final edit; add `frontmatter` and `markdown` after any post edit, and `cover`/`media` when affected. Run mandatory `npm test`, `npx astro check`, and commit hooks as required by the repository. Full builds require the documented environment. Do not substitute a successful type check for a rendered-page or production-build check.
6. Inspect the final diff and generated hook artefacts. Follow the repository issue, commit, and push workflow when validated work is complete. Preserve unrelated staged files and other working-tree changes. Do not bypass failed hooks or deploy merely to finish the report.

## Report

Report the post path, mode, expanded selection, mandatory additions, and publication state. List the status of each check, evidence/command, findings with source locations, and remediation or blocker. Show changed metadata only when relevant, with reasons for tag removal, renaming, or asset movement. Separate unrelated baseline failures and skipped checks. Distinguish readiness, local publication state, committed/pushed work, and verified deployment. For batches, retain per-post results and an aggregate table; never infer that one editorial decision applies to all posts.

A partial selection is a partial review. Do not claim complete readiness unless every publish-preset check and required repository gate has adequate evidence and no unresolved blocker.

## Extend

Copy [the check template](resources/check-template.md) into `checks/{id}.md`, fill every section, and register the ID and relevant scopes in `checks/index.md`. Reuse existing helpers before adding scripts. Keep detailed mutation procedures under `resources/`; check definitions describe verification and delegate authorised remediation. Update [contributor documentation](../../../documentation/content/post-review.md) when selection or contracts change.
