---
title: Colophon
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-11-14T00:00:00+07:00
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

A small client script sets the hover direction; everything else is CSS. It computes a font size (in `vw`) inversely proportional to the length of `setup.title`, so the title always spans roughly the same visual width regardless of how many characters it has. It sits `mt-12` below the footer's colophon strip, and its frame clips the word slightly below the baseline. The wrapper is `aria-hidden="true"` and carries `data-dnb-design-exception="decorative-low-contrast"`, since the text is purely decorative.

At rest, the text colour is `olive-100` in light mode and `olive-900` in dark mode. The whole word, including the hover spectrum, is drawn at 50% opacity (`opacity-50`). On hover, a spectrum from red to violet floods into the word from the side where the pointer enters (900ms) and drains out to the side where it leaves (450ms). The spectrum is a `::after` copy of the word (`content: attr(data-text)`), clipped to the text and revealed by a mask whose soft edge moves with the registered property `--colophon-front`. The script sets `data-colophon-side` on `pointerenter` and `pointerleave`, using `colophonSide()`, `colophonSettled()`, and `colophonDirection()` from `src/utils/colophon-direction.pure.ts`. It keeps the current side while a flood or drain is still running, so the edge never jumps. Its listeners are removed on `astro:before-swap` and bound again on `astro:page-load`.

While the pointer stays, the spectrum sways: a slow drift of its position and a small tilt of its angle (`--colophon-angle`). Reduced motion changes the colours at once, without sweep or sway. Browsers without text clipping or masking keep the olive colours with the `olive-200` / `olive-800` hover. Without the script, the spectrum floods from the left. Touch devices show the spectrum after a tap. See "Footer Colophon Watermark" in `DESIGN.md` for the values and the confirmed exceptions to the palette and hover timing rules.
