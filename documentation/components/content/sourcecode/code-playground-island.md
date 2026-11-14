---
title: CodePlaygroundIsland
tags: []
created: 2026-11-06T10:00:00+07:00
updated: 2026-11-14T14:35:00+07:00
---

React island behind [`CodePlayground`](code-playground.md) that owns an example's files and control state and renders the sandboxed preview, the controls, the layout modes, and the reset flow.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/sourcecode/CodePlaygroundIsland.tsx` |
| Data | `PlaygroundDescriptor` from `src/utils/code-playground.ts` |
| Tests | [`CodePlayground.test.ts`](../../../../src/components/content/sourcecode/CodePlayground.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `descriptor` | `PlaygroundDescriptor` | required | Validated example: files, controls, entry, state file, hooks, and ids |
| `children` | `ReactNode` | none | Static source fallback from Astro; removed while the editor is open |

## Usage

Use it only through `CodePlayground.astro`, which validates the descriptor:

```astro
---
import CodePlaygroundIsland from './CodePlaygroundIsland.tsx';
---

<CodePlaygroundIsland client:visible descriptor={descriptor}>
  <p>Static source</p>
</CodePlaygroundIsland>
```

## Behaviour

The shared preview builder uses `parse5` in both server rendering and the browser to identify declared stylesheet links, empty external script elements, and the real head opening tag. Source locations limit replacements to those elements; unrelated authored HTML, comments, raw text, and template content are preserved. Browser-accepted malformed script closing tags are recognised. Parsed attribute values are escaped before insertion. This is resource inlining, not HTML sanitisation: reader scripts run intentionally inside the opaque-origin iframe sandbox under its content security policy.

- A reducer holds the current files, the last valid state and its text, the state file error, and `externalRevision`, which increases on control changes and resets only.
- Server rendering and the first client render produce the same preview document without a bridge origin. After hydration the preview is rebuilt once with the host origin so runtime messages can arrive; later rebuilds wait for a 200 ms pause.
- "Edit code" loads `PlaygroundEditor.tsx` with a dynamic `import()`, shows a retry when loading fails, and moves focus to the source region when it is ready.
- Messages from the preview are validated with `readPreviewMessage()` (instance id and revision) after checking `event.source` and the `null` origin.
- An `IntersectionObserver` tells the preview when it leaves or enters the viewport.
- After "Discard edits", focus moves to the first enabled toolbar button, because "Reset all" is disabled once nothing is changed.
- After hydration it applies its own entries from the URL hash (`decodeSettings()`) once, then writes non-default settings back with `history.replaceState` 400 ms after each change (`encodeSettings()`, `updateHash()`). Other playgrounds' entries in the hash are kept.
- "Copy link" copies the current URL, or the playground's anchor when no setting differs from the defaults.
- Layout buttons ("Split", "Code", "Preview") are `aria-pressed` buttons in a `fieldset` labelled "Layout".
