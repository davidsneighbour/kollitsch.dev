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
| Tests | none (browser behaviour; see [`code-playground.md`](code-playground.md)) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
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

- Renders `SandpackProvider` with `autorun: false` and no `SandpackPreview`, so Sandpack's hosted bundler is never contacted; only `SandpackCodeEditor` (file tabs, line numbers, CodeMirror) is used.
- Host files are copied into Sandpack only when `externalRevision` changes. Editor changes reach the host 120 ms after typing pauses, or at once when focus leaves the editor. Reporting them in the same input event chain as CodeMirror's own synchronous update caused a "Maximum update depth exceeded" loop during fast typing.
- The component is wrapped in `memo` and receives host files by reference, so host updates do not re-render the Sandpack tree while the reader types.
- Syntax colours mirror the Expressive Code themes: `dracula` when `data-code-theme="dracula"`, otherwise `light-plus`. A `MutationObserver` follows theme changes. Comment and inactive-tab colours are raised to at least 4.5:1 contrast.
- Below the editor: "Copy" and "Reset" actions for the active file, and the hint that `Esc` then `Tab` leaves the editor.
