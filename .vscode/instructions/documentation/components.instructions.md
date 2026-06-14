---
applyTo: "documentation/components/**"
---

# Component Documentation Rules

Every component under `src/components/` that is created or meaningfully changed **must** have a matching documentation file at:

```text
documentation/components/<kebab-case-component-name>.md
```

Create the file when the component is first written. Update it whenever the props contract, behaviour, or usage changes.

## Required frontmatter

```markdown
---
title: <ComponentName>
tags: []
created: <ISO 8601 date with +07:00 offset>
updated: <ISO 8601 date with +07:00 offset>
---
```

File paths belong in the `## File locations` table, not in frontmatter. The `Vale.Terms` rule flags `.astro` file extensions as casing violations when they appear in YAML frontmatter values.

## Required sections (in this order)

### 1. Opening paragraph

One sentence: what the component does and why it exists. No heading; just prose immediately after the frontmatter.

### 2. `## File locations`

A table with three rows:

| Field | Value |
| --- | --- |
| Component | `src/components/<path>/<Name>.astro` |
| Data | path to companion data file, or "none" |
| Tests | path to test files, or "none" |

### 3. `## Props`

A table listing every prop. Required columns: **Prop**, **Type**, **Default**, **Description**.
Mark required props with "required" in the Default column.

If the component accepts no props, write: "This component accepts no props."

### 4. `## Usage`

A fenced code block (language: `astro`) showing the minimal import and usage in an Astro frontmatter + template. Follow it immediately with a second example showing all props when that adds meaningful clarity.

### 5. `## Behaviour`

Prose or a bullet list describing what the component does at runtime: DOM mutations, JS events, CSS interactions, server-side logic, etc. If the component has no client-side behaviour, write: "This component has no client-side behaviour."

### 6. `## Extending` (optional)

Include this section only when there is a concrete, non-obvious way to add new variants or data. Skip it for simple presentational components.

## Style rules

* Use British English throughout.
* Write tables with spaces around `|` separators: `| --- |` not `|---|`.
* Fenced code blocks must specify a language.
* All file paths in prose are formatted as inline code.
* Link to companion files using relative Markdown links from the repo root, for example `[random-headings.json](../../src/data/random-headings.json)`.
* Do not use `←`, `→`, or other arrow characters in prose; spell it out instead.
* Vale runs on all Markdown files; avoid `Microsoft.DateOrder` violations (spell out month names in full when they appear in prose, not in frontmatter).
