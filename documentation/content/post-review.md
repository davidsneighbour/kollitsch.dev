---
title: Post review skill
tags: []
created: 2026-10-11T00:00:00+07:00
updated: 2026-10-11T00:00:00+07:00
---

The repository-local `kdev-postreview` skill supports review, editing, and publication preparation for one post or an explicit batch. Its [entry point](../../.agents/skills/kdev-postreview/SKILL.md) handles selection, instruction discovery, edits, validation, and reporting. Individual verification definitions live under `checks/`; detailed editing procedures remain under `resources/`.

## Selection

```text
$kdev-postreview review example checks=links,orthography
$kdev-postreview edit example checks=tags,seo
$kdev-postreview review example scopes=frontmatter,language
$kdev-postreview publish example
```

These are agent instructions, not shell commands. [The registry](../../.agents/skills/kdev-postreview/checks/index.md) defines stable IDs, scopes, and presets. Explicit checks replace the default review preset. Publishing adds all publish checks. Mandatory repository checks and cover migration after an edit cannot be disabled through selection.

Review leaves content unchanged. Edit permits requested corrections. Publish distinguishes preparation, draft changes, commit/push, and deployment; deployment needs user authority. Link fixes retain the existing item-level interactive decision workflow. Checks use `PASS`, `FAIL`, `BLOCKED`, or `SKIPPED`, keeping warning severity and coverage separate from status. Missing tools or render evidence cannot establish readiness.

## Extending

Copy [the template](../../.agents/skills/kdev-postreview/resources/check-template.md) to `checks/{id}.md`. Define purpose, input, verify, method, output, pass/fail, and remediation under [the contract](../../.agents/skills/kdev-postreview/resources/check-contract.md). Register the ID and relevant scopes, reuse existing validators, and keep substantial mutation procedures in `resources/`. No second lint framework is required.

## Current verification limits

* `lint-frontmatter.ts` scans all blog posts; `lint-descriptions.ts` scans all content. Neither supports selecting a file. Report target findings and unrelated baseline failures separately. A future file selector should preserve current archive defaults.
* Schema validation requires a non-empty description but does not enforce its length. The description script warns outside 110-160 characters; this skill keeps the existing editorial maximum of 160 and preferred range of 140-160. Align these only through a separate documented decision.
* Missing or empty summaries fall back to descriptions. A separate generated summary is optional.
* Vale file checks provide prose findings; repository-wide and hook checks use `--no-exit`. Inspect findings instead of assuming exit zero means clean prose. Typos is the hook spelling tool; `cspell` remains a separate existing script.
* Lychee accepts 429, uses caching and exclusions, resolves root-relative URLs against production, and does not establish complete MDX/rendered-anchor coverage. Verify local routes, media, and page anchors separately before claiming readiness.
* Commit hooks fetch media thumbnails and generate/stage social images. Inspect these artefacts before committing. Type checking alone does not prove page rendering or live publication.

Use the executable schema and consumers when the general frontmatter index is outdated; do not copy that index into the skill. The skill removes speculative command examples and an incomplete duplicate field registry. Consider future focused file selectors and rendered route/metadata checks within the existing tools, rather than adding overlapping validators.
