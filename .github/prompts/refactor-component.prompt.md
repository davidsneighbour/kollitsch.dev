---
mode: 'ask'
model: GPT-5 mini
tools: ['edit/createFile', 'edit/createDirectory', 'edit/editFiles', 'runCommands', 'runTasks', 'kollitsch.dev Docs/*', 'playwright/*', 'chrome-devtools/*', 'problems', 'testFailure', 'todos', 'runTests']
description: 'Refactor a single Astro component per strict project rules'
---

You are refactoring a single component from this repository. Apply the rules below rigorously. If something is unclear, make the safest reasonable choice and proceed.

## Scope

* Only touch the currently selected file under `src/components/**`.
* Do not change public API unless you explain the change and provide a migration note (see Output Mode B).
* Prefer minimal diffs that achieve full compliance.

## Project context and hard requirements

* Astro 5+ only. Use up to date idioms. No deprecated patterns.
* TypeScript everywhere, strict mode. Never use `any`. Prefer `unknown` with type guards. Adhere to tsconfig.json.
* Props type must be named `Props` and must be `export`ed.
* All functions must have JSDoc with tags and examples when meaningful.
* Links in rendered HTML must use trailing slashes for internal URLs.
* Use Tailwind CSS v4 utility classes. Do not use inline `style=`.
* Avoid unnecessary DOM nesting. Favor semantic HTML.
* Accessibility is mandatory: proper roles, labels, alt text, heading order.
* Security: do not interpolate unsanitized HTML, URLs, or attributes. Avoid `set:html` where possible. Validate external URLs. Escape dynamic text by default.
* Text style: use straight apostrophes and quotes.
* Global browser state must live under `window.kdev` if needed.
* Testing hooks: keep the exported `Props` type stable. If you must change it, add a migration note (see Output Mode B).

## Code comment policy (strict)

* **Only functional, procedural comments are allowed inside code.** Examples: JSDoc for props/functions, inline comments that explain *what the code does* or *why a specific line is necessary for runtime behavior or a11y*.
* **Forbidden inside code:** any meta commentary about the act of refactoring or the editing process. Do **not** include phrases like: `refactor`, `refactored`, `cleanup`, `modernized`, `migrated`, `converted`, `adjusted`, `switched`, `updated`, `before/after`, `previously`, `legacy`, `this change`, `in this PR`, `as requested`.
* If you need to explain a change, put it in the **note block outside the code** (see Output Contract).
* Do not add TODOs unless fixing them in the same diff.

## Props documentation format

1. Exported type

```ts
export interface Props {
  /**
   * Short one line description.
   * @example "Article title"
   */
  title: string;

  /**
   * Optional description shown under the title.
   * @default ""
   * @example "A quick primer on OG images"
   */
  description?: string;
}
```

2. Add a concise JSDoc header at the top of the component listing props, defaults, and one usage example.
3. For unions or complex objects, include a minimal example in the JSDoc.

## Tailwind over CSS

* Replace inline styles with Tailwind utilities.
* Extract repeated utility groups with small class strings or `clsx` when needed.
* Do not add wrapper elements just to apply spacing. Prefer `gap-*`, `space-*`, `flex`, `grid`.
* Add spacing utilities only on the end side of the element (right and bottom on LTR).

## Structure and semantics

* Prefer `<section>`, `<header>`, `<figure>`, `<nav>`, etc.; use `<div>` only when no semantic tag fits.
* Keep nesting shallow. No unnecessary wrappers.
* Use accessible patterns: labelled controls, `aria-*` only when necessary.
* Headings must be in logical order.

## Safety and input hygiene

* Validate and normalize incoming props at the boundary:

  * Ensure URLs are absolute or project-safe before rendering into `href` or `src`.
  * Never pass user strings into `set:html`. If HTML is required, document sanitization and scope narrowly.
* Images:

  * Always provide `alt` (empty if decorative).
  * Prefer Astro image utilities; provide width and height if known.

## Repo specific notes

* OG image components use Satori, Resvg, optional Sharp. Keep memory low; avoid unnecessary DOM in SVG generators. Props must be explicit and documented.
* Use helpers for environment-aware URLs instead of hardcoding `Astro.site` assumptions.
* Resolve tag aliases at boundaries; do not leak alias semantics into general layout logic.

## What to change in a typical refactor

1. Add or fix `export interface Props`.
2. Add concise component-level JSDoc with props, defaults, and an example.
3. Replace inline styles with Tailwind utilities.
4. Reduce wrapper `<div>`s; merge classes onto fewer elements.
5. Improve a11y (alt, labels, roles, keyboard focus).
6. Validate and guard external inputs; remove `set:html` unless sanitized.
7. Keep names consistent and descriptive; avoid cryptic abbreviations.
8. Update/add minimal tests only if prop shapes changed.

## Acceptance checklist

* [ ] `export interface Props { ... }` exists and is used.
* [ ] Every prop has JSDoc, `@default`, and at least one `@example` where useful.
* [ ] No `style=` attributes; Tailwind utilities used instead.
* [ ] DOM depth reduced without losing semantics.
* [ ] a11y basics verified.
* [ ] No unsafe HTML injection; external URLs validated.
* [ ] Internal links end with trailing slash.
* [ ] No `any`; types are explicit and safe.
* [ ] **No meta commentary inside code comments** (see policy).

---

# Verification & linting contract

* After producing the refactor (Mode A or Mode B), **run** (if your agent supports terminal/tools):

  1. `npm test`
  2. `npx astro check`
  
* If any command fails, **revise the patch** until all three pass. Re-emit only the updated Mode A/Mode B output.
* Do **not** edit files outside `src/components/**` unless the failure is a test-only change tightly coupled to the component (e.g. its `.test.ts` or a fixture).
* If you **cannot** run commands, say so in plain text after the code block and list what would have been executed. Then:

  * Re-scan the change against the Acceptance checklist.
  * Perform a static self-audit for: exported `Props`, no `any`, no inline `style=`, a11y basics, trailing slashes, no unsafe HTML.
  * Emit Mode A/Mode B output again if you spotted issues.

---

# OUTPUT CONTRACT — PICK EXACTLY ONE MODE

**Mode A — Unified diff only**

* Output a single fenced code block with language `diff`.
* Include only a valid unified diff for the current file, starting with `--- a/<path>` and `+++ b/<path>`.
* No other text or blocks before or after the diff.

**Mode B — Full file only**

* Output a single fenced code block with language `astro` containing the **entire final file content**.
* No other blocks mixed with the code.

**Optional note (plain chat text, not a code block)**

* After Mode A or Mode B, you may add normal chat text that includes:

  * **Rationale** (3–6 bullets).
  * **Migration note** only if public props changed.
* This note is **not** inside a fenced code block. You **may** use Markdown formatting (bold, lists, inline code). Do **not** include additional fenced code blocks in the note, unless quoting a tiny inline example is necessary (prefer inline code).

**Validation rule:** If your output contains forbidden meta commentary inside the code block, stop and re-emit a compliant response.
