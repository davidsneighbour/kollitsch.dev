---
title: VHS
tags: []
created: 2026-08-10T21:13:20+07:00
updated: 2026-08-10T21:13:20+07:00
---

Wraps child markup in Canvas UI's VHS WebGL treatment, with a non-supporting-browser fallback that leaves the original children visible.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/gimmicks/vhs.tsx` |
| Data | none |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | required | Markup captured by the experimental HTML-in-canvas source canvas |
| `className` | `string` | `undefined` | Classes applied to the wrapper |
| `imageSourceOnly` | `boolean` | `false` | Forces the shader source to use the first child `<img>` instead of experimental subtree capture |
| `style` | `CSSProperties` | `undefined` | Inline wrapper styles; `position` defaults to `relative` unless supplied |
| `speed` | `number` | `0.5` | Playback speed for tape artefacts |
| `wave` / `jitter` / `crease` / `switching` | `number` | Canvas UI defaults | Strength controls for tape wobble, line jitter, crease bands, and head-switching noise |
| `switchingHeight` | `number` | `0.02` | Height of the head-switching band as a fraction of the frame |
| `bloom` / `aberration` / `acBeat` / `grain` / `scanlines` / `vignette` / `barrel` / `saturation` / `exposure` | `number` | Canvas UI defaults | Visual tuning values forwarded to the VHS shader |

## Usage

```astro
---
import VHS from '@components/gimmicks/vhs';
---

<VHS client:visible className="relative block aspect-video overflow-hidden">
  <img src="/example.jpg" alt="" />
</VHS>
```

## Behaviour

The component comes from `npx shadcn@latest add @canvas-ui/vhs-react`, then lives under `gimmicks/` because it is a visual novelty rather than a shared UI primitive. On supporting browsers, it captures its child subtree through the experimental `layoutsubtree` canvas path, uploads that source into a WebGL shader, and renders animated VHS artefacts into an absolutely positioned output canvas. When `imageSourceOnly` is enabled, it skips the experimental subtree capture and uploads the first child `<img>` through a normal 2D canvas before the same VHS shader runs. It respects `prefers-reduced-motion` by rendering a still frame instead of continuously advancing the animation.

If the browser does not support HTML-in-canvas capture or WebGL initialisation fails, the original children stay visible without the VHS output. Use this component only around the visual layer that should be distorted; wrapping a larger layout will also capture and treat that larger layout.
