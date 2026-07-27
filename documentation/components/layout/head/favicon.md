---
title: Favicon
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders the favicon, web app manifest, and Apple touch icon links for the `<head>`.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/head/Favicon.astro` |
| Data | [`src/assets/favicon/favicon.png`](../../../../src/assets/favicon/favicon.png), [`src/assets/favicon/favicon.svg`](../../../../src/assets/favicon/favicon.svg) |
| Tests | [`src/components/layout/head/Favicon.test.ts`](../../../../src/components/layout/head/Favicon.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import Favicon from '@components/layout/head/Favicon.astro';
---

<Favicon />
```

## Behaviour

This component has no client-side behaviour. At build time it uses `astro:assets`' `getImage()` to generate a 180 by 180 pixel PNG Apple touch icon from `favicon.png` and an optimised SVG from `favicon.svg`, then emits four `<link>` tags: a 32 by 32 pixel `.ico` favicon, the SVG favicon (`sizes="any"`), the web app manifest (`/manifest.json`), and the Apple touch icon.

## Extending

To change the favicon artwork, replace `src/assets/favicon/favicon.png` and `src/assets/favicon/favicon.svg`; both are re-processed automatically at build time.
