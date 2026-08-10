---
title: Glitch
tags: []
created: 2026-08-10T21:43:00+07:00
updated: 2026-08-10T21:43:00+07:00
---

Wraps child markup in Canvas UI's Glitch WebGL treatment, with a non-supporting-browser fallback that leaves the original children visible.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/gimmicks/glitch.tsx` |
| Data | none |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `children` | `ReactNode` | required | Markup captured by the experimental HTML-in-canvas source canvas |
| `className` | `string` | `undefined` | Classes applied to the wrapper |
| `imageSourceOnly` | `boolean` | `false` | Forces the shader source to use the first child `<img>` instead of experimental subtree capture |
| `style` | `CSSProperties` | `undefined` | Inline wrapper styles; `position` defaults to `relative` unless supplied |
| `intensity` | `number` | `1` | Overall strength of the glitch |
| `interval` | `number` | `3` | Seconds between glitch bursts; `0` keeps the glitch running constantly |
| `duration` | `number` | `0.4` | Length of each burst in seconds |
| `slices` | `number` | `24` | Number of horizontal tear slices |
| `shift` | `number` | `30` | Horizontal slice offset in CSS pixels |
| `rgbShift` | `number` | `4` | Chromatic RGB split in CSS pixels |
| `blocks` | `number` | `0.5` | Amount of corrupted block artefacts |
| `noise` | `number` | `0.35` | Analog noise and scanline flicker |

## Usage

```astro
---
import Glitch from '@components/gimmicks/glitch';
---

<Glitch client:visible className="relative block aspect-video overflow-hidden">
  <img src="/example.jpg" alt="" />
</Glitch>
```

## Behaviour

The component comes from `npx shadcn@latest add @canvas-ui/glitch-react`, then lives under `gimmicks/` because it is a visual novelty rather than a shared UI primitive. On supporting browsers, it captures its child subtree through the experimental `layoutsubtree` canvas path, uploads that source into a WebGL shader, and renders shifted slices, RGB splits, corrupted blocks, noise, and scanline flicker into an absolutely positioned output canvas. When `imageSourceOnly` is enabled, it skips the experimental subtree capture and uploads the first child `<img>` through a normal 2D canvas before the same Glitch shader runs.

If the browser does not support HTML-in-canvas capture or WebGL initialisation fails, the original children stay visible without the Glitch output. Use this component only around the visual layer that should be distorted; wrapping a larger layout will also capture and treat that larger layout.
