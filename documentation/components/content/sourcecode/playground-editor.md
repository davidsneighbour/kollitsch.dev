---
title: PlaygroundEditor
tags: []
created: 2026-11-06T10:00:00+07:00
updated: 2026-11-06T10:00:00+07:00
---

Sandpack-based source editor of the code playground, loaded only after a reader selects "Edit code".

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/sourcecode/PlaygroundEditor.tsx` |
| Data | none |
| Tests | [`code-playground.spec.ts`](../../../../src/test/content/code-playground/code-playground.spec.ts) (e2e and axe) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `idPrefix` | `string` | required | Prefix for element ids, unique per playground |
| `filesRef` | `{ current: Record<string, string> }` | required | Current host files, passed by reference |
| `externalRevision` | `number` | required | Increases when controls or resets change files outside the editor |
| `meta` | `readonly PlaygroundFile[]` | required | File list with `readOnly` and `hidden` flags |
| `activeFile` | `string` | required | File shown first |
| `onFileChange` | `(path: string, code: string) => void` | required | Receives editor changes |
| `onResetFile` | `(path: string) => void` | required | Resets one file to its authored version |
| `onAnnounce` | `(message: string) => void` | required | Sends a short message to the host's status region |

## Usage

Load it with a dynamic import so Sandpack stays out of the initial bundle:

```astro
---
const module = await import('./PlaygroundEditor.tsx');
const PlaygroundEditor = module.default;
---

<PlaygroundEditor
  idPrefix={descriptor.anchorId}
  filesRef={filesRef}
  externalRevision={externalRevision}
  meta={descriptor.files}
  activeFile={descriptor.activeFile}
  onFileChange={onFileChange}
  onResetFile={onResetFile}
  onAnnounce={setAnnouncement}
/>
```

## Behaviour

- Renders `SandpackProvider` with `autorun: false` and no `SandpackPreview`, so Sandpack's hosted bundler is never contacted. Only Sandpack's file state and its `CodeEditor` (CodeMirror with line numbers) are used.
- File tabs are the playground's own: a `tablist` of `tab` buttons with roving `tabindex`, arrow keys, Home, and End. Sandpack's tab strip puts `role="tab"` on a wrapper around a button, which axe reports as `nested-interactive`.
- Focus model: Sandpack wraps CodeMirror in a focusable `role="textbox"` element and removes the editable element from the tab order (Enter moves into it). That nests two textboxes for screen readers and makes axe report the scroller (`scrollable-region-focusable`). After each mount the panel turns the wrapper into a labelled `group` (without `aria-autocomplete` and `aria-multiline`), makes the editable element the single tab stop, and links it to the hint with `aria-describedby`. Escape focuses the wrapper; while it has focus, the editable element leaves the tab order, so the next Tab moves on to "Copy".
- Host files are copied into Sandpack only when `externalRevision` changes. Editor changes reach the host 120 ms after typing pauses, or at once when focus leaves the editor. Reporting them in the same input event chain as CodeMirror's own synchronous update caused a "Maximum update depth exceeded" loop during fast typing.
- The component is wrapped in `memo` and receives host files by reference, so host updates do not re-render the Sandpack tree while the reader types.
- Syntax colours mirror the Expressive Code themes: `dracula` when `data-code-theme="dracula"`, otherwise `light-plus`. A `MutationObserver` follows theme changes. Comment and inactive-tab colours are raised to at least 4.5:1 contrast.
- Below the editor: "Copy" and "Reset" actions for the active file, and the hint that `Tab` indents and `Esc` then `Tab` leaves the editor.
