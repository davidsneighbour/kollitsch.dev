---
title: CodePlayground
tags: []
created: 2026-11-06T10:00:00+07:00
updated: 2026-11-06T10:00:00+07:00
---

Embeds an editable HTML, CSS, and JavaScript example in a blog post, with a live sandboxed preview, typed controls, and a static source fallback.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/sourcecode/CodePlayground.astro` |
| Data | `src/content/blog/<year>/<post>/examples/<example>/` (see "Authoring an example") |
| Tests | [`CodePlayground.test.ts`](../../../../src/components/content/sourcecode/CodePlayground.test.ts), [`code-playground.pure.test.ts`](../../../../src/utils/code-playground.pure.test.ts), [`code-playground.schema.test.ts`](../../../../src/utils/code-playground.schema.test.ts), e2e and axe: [`code-playground.spec.ts`](../../../../src/test/content/code-playground/code-playground.spec.ts) |

Related files:

| File | Responsibility |
| --- | --- |
| [`CodePlaygroundIsland.tsx`](code-playground-island.md) | React shell: file state, preview, controls, view modes, divider, reset |
| [`PlaygroundControls.tsx`](playground-controls.md) | Schema-driven controls |
| [`PlaygroundEditor.tsx`](playground-editor.md) | Sandpack editor, loaded only on request |
| `src/utils/code-playground.pure.ts` | Browser-safe validation, control changes, and preview document builder |
| `src/utils/code-playground.schema.ts` | Build-time validation of `playground.json` and `controls.json` |
| `src/utils/code-playground.ts` | Build-time loader (`import.meta.glob`, raw file contents) |
| `src/packages/site/code-playground.jsonc` | `@codesandbox/sandpack-react` dependency fragment |
| `ec.config.mjs` | Expressive Code options; required by the `<Code>` component used for the static source |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `leaf` | `string` | required | Post directory below `src/content/blog/`, for example `2026/halftone-typography-with-css` |
| `example` | `string` | required | Directory name below the post's `examples/` folder |
| `headingLevel` | `2 \| 3 \| 4` | `3` | Heading level of the playground title |
| `class` | `string` | none | Extra classes on the outer `<section>` |

## Usage

Posts that use the component must be MDX:

```astro
---
import CodePlayground from '@components/content/sourcecode/CodePlayground.astro';
---

<CodePlayground leaf="2026/halftone-typography-with-css" example="halftone" />
```

```astro
<CodePlayground
  leaf="2026/halftone-typography-with-css"
  example="halftone"
  headingLevel={2}
  class="my-12"
/>
```

## Authoring an example

An example is a directory next to the post. A post can hold several examples:

```text
src/content/blog/2026/my-post/
  index.mdx
  examples/
    halftone/
      playground.json
      controls.json
      playground-state.json
      index.html
      styles.css
      index.js
```

The blog collection only loads `.md` and `.mdx` files, so example files never become posts. Only `.html`, `.css`, `.js`, and `.json` files are loaded; dotfiles are ignored.

`playground.json` (manifest, version 1):

| Key | Description |
| --- | --- |
| `version` | Always `1` |
| `id` | Must equal the example directory name |
| `title`, `description` | Shown above the playground |
| `runtime` | Always `vanilla` |
| `entry` | The `.html` file rendered in the preview |
| `activeFile` | File shown first in the editor; must be visible |
| `state` | The `.json` state file the controls write to |
| `controls` | The controls file, usually `controls.json` |
| `hooks` | CSS selectors the preview reports as missing after loading, for example `["#sample"]` |
| `files` | Ordered list of `{ "path", "readOnly"?, "hidden"? }`; paths are lowercase, relative, and without `..` |

`controls.json` holds `{ "version": 1, "controls": [...] }`. Each control has an `id` (the key in the state file), a `label`, an optional `help` text, and an optional `when` (the id of a switch control; the control is shown only while that switch is on). Types:

| Type | Extra keys | Value in the state file |
| --- | --- | --- |
| `text` | `maxLength` | String |
| `range` | `min`, `max`, `step`, `unit`, optional `below: { id, factor }` | Number; with `below`, it stays strictly below `state[id] * factor` |
| `colour` | none | Six-digit hex colour, for example `#202020` |
| `switch` | none | Boolean, rendered as a switch |
| `toggle` | none | Boolean, rendered as a pressed/unpressed button |

Defaults come from the authored state file; controls do not declare their own defaults. The build fails with a message naming the example when the manifest or controls are invalid, a declared file is missing or larger than 64 KiB, paths are duplicated, the entry is not HTML, the active file is hidden, a `when` or `below` reference is wrong, or the state file does not match the controls.

The example JavaScript reads the state with a JSON module import and applies it, for example as CSS custom properties and with `textContent`:

```js
import state from './playground-state.json' with { type: 'json' };
```

Because the controls only change the visible state file, copying the files reproduces exactly what the preview shows.

## Behaviour

Server rendering:

- `CodePlayground.astro` loads and validates the example at build time and renders a `<section>` with a linked title (the section id is the canonical link anchor), the description, and the island.
- The island's static HTML already contains the preview (`srcdoc`), the controls (disabled until hydration), and a collapsed "Source files" list rendered with Expressive Code. Without JavaScript the preview still shows the CSS result.

In the browser:

- The island hydrates with `client:visible`. The Sandpack editor is downloaded only when the reader selects "Edit code"; pages without a playground ship no playground JavaScript.
- The preview is an `<iframe sandbox="allow-scripts" srcdoc>`, so reader code runs in an opaque origin without access to the article, its storage, or its cookies, and cannot open pop-ups, navigate the page, submit forms, or download files. An injected content security policy blocks all network requests; a `<base href="https://playground.invalid/">` keeps relative URLs from reaching the site. Stylesheets and scripts referenced by the entry HTML are inlined; JSON and JavaScript files are available to module imports through an import map of `data:` URLs.
- No request goes to CodeSandbox or any other third party. Sandpack provides only the editor, tabs, and file state; its hosted bundler is never started.
- Edits rebuild the preview after a 200 ms pause. A small bridge reports runtime errors and missing hooks to the host with `postMessage`; the host accepts only messages from its own iframe window, from the opaque origin, for its instance id and current preview revision.
- An invalid state file stays in the editor as typed. The controls are disabled, an error explains the problem, and the preview uses the last valid state until the file is fixed or reset.
- Modified files are listed in the toolbar. "Reset all" asks for confirmation and restores every file and control value together. The editor has "Copy" and "Reset" actions for the active file.
- Settings links: control values that differ from the authored state are written to the URL hash as URL search parameters named `<example>.<control>`, for example `#halftone.dotSpacing=14&stripes.angle=30` (colours without `#`, booleans as `1`/`0`). The hash is updated with `history.replaceState` 400 ms after the last change, holds every playground on the page, and is removed when all settings are back at their defaults. Code edits are not recorded. On load, each playground applies its own entries after hydration: unknown keys and invalid values are ignored, ranges are clamped, and dependent bounds hold. A small page script scrolls to the first playground named in the hash, which also hydrates it. "Copy link" copies the current URL, or the playground's anchor when nothing is changed. The hash never reaches the server or analytics.
- Layout modes: split, code only, and preview only. Hidden panes use the `hidden` attribute and leave the focus order and the accessibility tree. In split mode at `md` and up, a `separator` resizes the panes by pointer or keyboard (arrow keys in 5 % steps, Shift for 10 %, Home and End for the 25 % and 75 % limits, Enter or a double-click to reset). Below `md` the panes stack.
- Files are a `tablist` (one `tab` button per file, arrow keys, Home, and End). The editable CodeMirror element is the panel's single tab stop and is described by the hint below the editor: `Tab` indents, `Esc` followed by `Tab` leaves the editor. See [`PlaygroundEditor`](playground-editor.md) for how Sandpack's focus wrapper is adjusted.
- A polite status region announces editor loading, resets, copy results, state file errors, preview errors, and missing hooks. It does not announce ordinary rebuilds.
- While the preview is outside the viewport, the host sets `data-playground-hidden` on the preview's root element, so examples can pause animations.

Limits of version 1: only the `vanilla` runtime exists; nested relative imports from imported JavaScript modules do not resolve (the entry script's imports do); code edits are not saved or shared, only control settings are. Reader code can still use a lot of CPU; reloading the page recovers. Arbitrary edits can produce inaccessible output, which the playground does not check.

## Testing

- Unit tests cover validation, control changes, URL settings, the preview document builder, and the server-rendered island.
- `src/test/content/code-playground/code-playground.spec.ts` runs against the dev server, because the test post is a draft. It scans both playgrounds with axe (WCAG 2.1 A and AA) in dark and light mode, closed and with the editor open, and tests independent state of two playgrounds, settings links (restore, clamping, invalid values, reset), state file edits, the editor focus model, and the separator.
- Screen readers were not tested by a person. The accessibility tree (names, roles, states, and live region text) was reviewed in Chrome instead; a manual NVDA and VoiceOver pass is still open.

## Measured sizes

Measured on 6 November 2026 from a local production build (`npx astro build` with the test post temporarily set to `draft: false`), served by `astro preview` and loaded in Chrome. Brotli sizes are computed with Node's `zlib` at quality 11; Cloudflare's own compression may differ slightly.

| When | Files | Raw | Brotli |
| --- | --- | --- | --- |
| Page load, playground not yet visible | none | 0 KB | 0 KB |
| Playground scrolls into view | island, button recipe, React, React DOM client, JSX runtime | 280 KB | 77 KB |
| "Edit code" | `PlaygroundEditor` chunk (Sandpack editor UI, CodeMirror, HTML/CSS/JS languages) | 623 KB | 175 KB |

- Sandpack's runtime clients (`index-*`, `node`, `runtime` chunks) are built as separate lazy chunks and were never requested.
- No request left the site's origin, before or after opening the editor.
- Layout shift without recent input was 0 for the whole session, including opening the editor.
- Each playground adds its files to the page HTML twice: as island props (about 7 KB each for the two examples) and as the static source fallback.
- Posts without a playground load none of these files. The homepage carries a playground only when the newest post contains one, because it always shows the latest post in full.

## Extending

New control types need a case in `PlaygroundControl` and `validateControlValue` (`code-playground.pure.ts`), in the zod `controlSchema` (`code-playground.schema.ts`), and in `PlaygroundControls.tsx`, with tests for each. A new runtime needs a new `runtime` literal and its own preview builder; do not route it through Sandpack's hosted bundler without a separate privacy and isolation review.
