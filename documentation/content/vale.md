---
title: Vale HTML Report
tags: []
created: 2026-09-12T00:00:00+07:00
updated: 2026-11-14T00:00:00+07:00
---

Vale prose linting has two modes: a terminal-only check for CI/quick feedback
(`lint:vale`, `lint:vale:file`, documented in [Workspace Setup](../setup/workspace.md#vale-configuration)),
and a browsable HTML report for reviewing a large batch of findings.

## Running the report

```shell
npm run report:vale:blog
```

This runs Vale against `src/content/blog`, writes the raw results to
`reports/vale/vale-blog.json`, renders a self-contained HTML report to
`reports/vale/vale-blog.html`, serves that file locally, and opens it in the
VS Code Simple Browser.

The generator lives at `src/scripts/linting/vale-report.ts`.

Older generated reports can still exist under `scratch/vale`; that directory
is not used by the current report command.

If styles referenced in `src/config/.vale.ini` (`BasedOnStyles` /
`Packages`) are missing locally, run `npm run update:pre:vale` first to sync
them.

## Reading the report

Each issue is shown as a severity badge, a `file:line:column` location that
links straight to the file in VS Code (`vscode://file`), the rule that fired,
and the message.

* **Search** — filters by any text in the location, rule, or message.
* **Severity** — filters to errors, warnings, or suggestions.
* **Top Rules** (right sidebar) — click a rule to filter the table to just
  that rule; the active rule is outlined. Use **Clear Rule** or **Reset** to
  remove the filter.

## Rule set and tuning

`src/config/.vale.ini` enables `Vale`, `Microsoft`, `Google`, `proselint`, `write-good`, `AIDetection`, `Millennialisms`, and `DNB` for Markdown and MDX. Each change to the upstream rules has a comment in that file. The changes are in four groups:

* **Duplicate styles are not listed.** The `DNB` package contains copies of every `alex` rule (`DNB.Insensitive*`) and every `Readability` metric (`DNB.Readability*`). `alex` and `Readability` are therefore not in `BasedOnStyles`.
* **Duplicate rules are off.** When two rules report the same spans, one of them is set to `NO`. The comment names the rule that stays active.
* **Rules that require US conventions are off.** British English puts punctuation outside quotation marks, writes dates as "31 July 2016", uses spaced dashes, uses British spelling, and keeps the word after a colon in a sentence-case heading in lowercase.
* **Rules that flag deliberate voice choices are downgraded.** Expanded forms such as "cannot" (`Microsoft.Contractions`), paragraphs that start with "But" (`proselint.But`, `DNB.OpenlyBut`), and ordinals such as "20th" (`Google.Ordinal`) are not errors.

`Readability` stays in `Packages` for its opt-in `Readability.Polysyllables` rule. It lists every word of three or more syllables. To use it while you bring a readability score down, add `Readability.Polysyllables = YES` to the end of `src/config/.vale.ini` temporarily, then run:

```shell
vale --config src/config/.vale.ini --output=line --filter='.Name=="Readability.Polysyllables"' path/to/index.md
```

Remove the line again before you commit.

Vale reports an alert only once when two rules give the same message at the same position. When you turn off one rule of a duplicate pair, the count of the other rule can go up.

## Commit hook

The commit hook (`.lintstagedrc.ts`) runs Vale with `--minAlertLevel=error` on each staged `.md` and `.markdown` file. If Vale finds an error, the commit stops. Warnings and suggestions are shown in the editor and in the report, but the hook does not show them and they do not block the commit.

* The hook checks only the staged files. It does not check the full content base.
* It does not check `CHANGELOG` files, the generated agent definitions under `.claude/agents/`, or `.mdx` files.
* Files with errors from before the hook started to block commits must pass Vale when you next stage them.

To check a file before you commit it, run:

```shell
npm run lint:vale:file -- --minAlertLevel=error path/to/file.md
```

## Baseline

The accepted baseline is: no errors except the exceptions below. Warnings and suggestions are review aids, not a gate. The `.md` files in this list fail the commit hook when they are staged: fix the error when you next change the file.

On 14 November 2026, a full run against `src/content/blog` reported 10,174 alerts in 191 files: 27 errors, 8,516 warnings, and 1,631 suggestions. The highest-volume rules are `DNB.Hedging`, `DNB.AgenticCommunal`, `Microsoft.Contractions`, `DNB.OpenlySentenceLength`, and `DNB.OpenlyFutureTense`. They stay active as warnings or suggestions on purpose: they point to passages to review, and not every hit needs a change.

The 27 errors are these known items:

* `2023/pantones-color-of-the-year-peach-fuzz-in-css/index.mdx` and `2025/kurzschnitte-ii-10/index.mdx` (`DNB.Spelling`): American `color` in Pantone's `Color of the Year` branding and in CSS colour tool names. This is intentional.
* `2026/kurzschnitte-ii-11/index.md` (`proselint.Spelling`): the product name `Kigen Color` next to British "colour" in the same post.
* `2023/prevent-jsbuild-from-removing-un-unused-javascript-functionality/index.md` (`Microsoft.Spacing`, `Google.Spacing`) and `2024/swiss-made-2069/index.mdx` (`Google.OptionalPlurals`, `Microsoft.Plurals`): the alerts are in the frontmatter `title`. Vale comments cannot suppress frontmatter, and a title change also changes the social image.
* `2026/ai-in-contributions/index.md` (`Google.Latin`, `Microsoft.Foreign`): "e.g." on line 29 is not replaced yet. The post links to an unpublished draft, and the link check in the commit hook fails until that is fixed ([#2233](https://github.com/davidsneighbour/kollitsch.dev/issues/2233)).

Vale comments (`<!-- vale Rule.Name = NO -->`) work in `.md` files. In `.mdx` files with the current set-up, `{/* vale ... */}` comments have no effect.

For a new error outside this list, fix the text, add a real term to `src/config/vale/config/vocabularies/kollitsch-dev/accept.txt`, or tune the rule in `src/config/.vale.ini` with a comment that gives the reason.
