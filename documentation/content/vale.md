---
title: Vale HTML Report
tags: []
created: 2026-09-12T00:00:00+07:00
updated: 2026-09-12T00:00:00+07:00
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

## Current state

The active style set (`Vale`, `Microsoft`, `Google`, `alex`, `proselint`,
`Readability`, `write-good`, plus the DNB/AIDetection/Millennialisms
packages) is very verbose — expect thousands of results on the full blog.
Tuning `BasedOnStyles` and per-rule severity is a separate, later task; this
page will be extended with that setup once it settles.
