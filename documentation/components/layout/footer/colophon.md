---
title: Colophon
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-11-13T00:00:00+07:00
---

Renders a large, faded, decorative repeat of the site title beneath the footer as a subtle visual signature.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/footer/Colophon.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (site title text) |
| Tests | [`src/components/layout/footer/Colophon.test.ts`](../../../../src/components/layout/footer/Colophon.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import Colophon from '@components/layout/footer/Colophon.astro';
---

<Colophon />
```

## Behaviour

This component has no client-side behaviour. It computes a font size (in `vw`) inversely proportional to the length of `setup.title`, so the title always spans roughly the same visual width regardless of how many characters it has. It sits `mt-12` below the footer's colophon strip, and its frame clips the word slightly below the baseline. The wrapper is `aria-hidden="true"` and carries `data-dnb-design-exception="decorative-low-contrast"`, since the text is purely decorative. The text colour is `olive-100` (hover `olive-200`) in light mode and `olive-900` (hover `olive-800`) in dark mode; see "Footer Colophon Watermark" in `DESIGN.md`.
