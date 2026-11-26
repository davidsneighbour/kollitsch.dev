---
title: SiteTitle
tags: []
created: 2026-07-26T00:00:00+07:00
updated: 2026-11-26T00:00:00+07:00
---

Renders the large header title as the brand combination mark. On pointer hover the header photo grows out behind the logo while the logo fades out. The header fades and lifts as the user scrolls past it.

## File locations

| Field | Value |
| --- | --- |
| Component | [`src/components/layout/header/title/SiteTitle.astro`](../../../../../src/components/layout/header/title/SiteTitle.astro) |
| Logo | [`BrandLogo`](../../../brand-logo.md) (geometry from `src/brand/kollitsch-brand/logo.master.svg`) |
| Data | [`src/data/brand-artwork.ts`](../../../../../src/data/brand-artwork.ts) (header photo for the hover reveal) |
| Tests | `src/test/layout/header/title/SiteTitle.spec.ts` (e2e) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `siteTitleId` | `string` | required | `id` applied to the outer `<header>`, used as a scroll or navigation anchor |
| `compact` | `boolean` | `false` | Less vertical padding for reading pages: `py-4 md:py-6` instead of `py-6 md:py-10`. The logo width does not change. |

## Usage

```astro
---
import SiteTitle from '@components/layout/header/title/SiteTitle.astro';
---

<SiteTitle siteTitleId="site-title" />
```

## Behaviour

The link to the homepage (`getHomepageUrl()`) contains the inline SVG combination mark with the accessible name `KOLLITSCH.dev`. The logo takes its colours from the `--logo-*` theme tokens. It never gets an image fill, tint, or per-glyph animation (brand guide, section 12.2). It fills the `wide` container (the same width as the footer); the height follows from the `viewBox`.

### Scroll exit

The outer `<header class="site-title-hero">` uses a scroll-driven `view()` timeline (`animation-range: exit 0% exit 100%`) to run the `site-title-exit` keyframes: opacity to zero, `12px` upward, and a slight scale-down. The header uses `overflow: clip`, not `overflow: hidden`, because `hidden` establishes a scroll container that breaks `animation-timeline: view()`. See [Site title animations](../../../../theme/site-title.md).

### Hover reveal (`@media (hover: hover) and (pointer: fine)`)

- **Background reveal**: `.site-title-hero::after` holds the header photo (`--headline-bg`). It starts at `clip-path: inset(22% 8% round 48px)` and `opacity: 0%`, and expands to `inset(0% round 0)` over 0.9 seconds (`cubic-bezier(0.785, 0.135, 0.15, 0.86)`), fading in over 0.35 seconds after a 0.1 second delay.
- **Logo fade-out**: `.site-title-link` fades to 0% over 0.5 seconds after a 0.35 second delay, so the photo replaces the logo instead of being drawn into it.
- `.is-toggle-hover` (set by the theme toggle, see `Header.astro`) keeps the reveal open while the pointer is over the corner theme toggle.

### Reduced motion

Under `prefers-reduced-motion: reduce`, the scroll-exit animation is turned off and the hover transitions become short opacity-only `ease` transitions.

## Extending

To change the region the photo starts from, adjust `clip-path: inset(...)` on `.site-title-hero::after`. To change the logo itself, change `src/brand/kollitsch-brand/` and follow its guide; do not edit the SVG in the component.
