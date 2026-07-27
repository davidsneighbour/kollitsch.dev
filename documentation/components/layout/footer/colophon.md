---
title: Colophon
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
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

This component has no client-side behaviour. It computes a font size (in `vw`) inversely proportional to the length of `setup.title`, so the title always spans roughly the same visual width regardless of how many characters it has. The wrapper is `aria-hidden="true"` since the text is purely decorative, and the text colour is a very low-opacity gray that brightens slightly on hover (`hover:text-gray-200/50` in light mode, `dark:hover:text-gray-800/50` in dark mode).
