---
title: SiteTitle
tags: []
created: 2026-07-26T00:00:00+07:00
updated: 2026-07-26T00:00:00+07:00
---

Renders the large homepage header title as an image-filled heading that dissolves into a full-width image on hover, and fades out as the user scrolls past it.

## File locations

| Field | Value |
| --- | --- |
| Component | [`src/components/layout/header/title/SiteTitle.astro`](../../src/components/layout/header/title/SiteTitle.astro) |
| Data | [`src/data/setup.json`](../../src/data/setup.json) (site title text), `public/headline.jpg` (background image) |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `siteTitleId` | `string` | required | `id` applied to the outer `<header>`, used as a scroll or navigation anchor |

## Usage

```astro
---
import SiteTitle from '@components/layout/header/title/SiteTitle.astro';
---

<SiteTitle siteTitleId="site-title" />
```

## Behaviour

The component wraps [`TextImageFill`](text-image-fill.md) with `imageUrl="/headline.jpg"`, `fallbackColor="var(--color-orange-500)"`, and `tintColor="var(--color-red-800)"` at `tintOpacity={0.1}`, so the title text is normally filled with the headline image tinted red. The title text itself comes from `setup.title` in `setup.json`, and the link points at the homepage URL resolved by `getHomepageUrl()`.

### Scroll-exit fade

The outer `<header class="site-title-hero">` uses a scroll-driven `view()` timeline (`animation-range: exit 0% exit 100%`) to run the `site-title-exit` keyframes, fading the header's opacity to zero and translating it upward by `12px` with a slight scale-down as it exits the viewport.

### Hover animation (desktop only, `@media (hover: hover)`)

On hover-in the following run together:

- **Text colour morph**—the `text-colour-morph` keyframes animate the `.text-image-fill` text colour from `transparent` (0%) through a red mid-tone at `--color-red-700` (40%, previously `--color-orange-500`) to `var(--color-gray-400)` (100%), over 0.9 seconds with an `ease` timing function.
- **Background reveal**—the `.site-title-hero::after` pseudo-element holds a second, full-size copy of `/headline.jpg`. It starts `clip-path: inset(22% 8% round 48px)` (clipped to roughly the text's footprint) and `opacity: 0%`. On hover it expands to `clip-path: inset(0% round 0)` over 0.7 seconds (`cubic-bezier(0.25, 0.46, 0.45, 0.94)`) and fades to full opacity over 0.35 seconds, starting after a 0.1 second delay.
- **Link fade-out**—`.site-title-link` (the clickable text layer) fades its opacity to 0% over 0.5 seconds, starting after a 0.2 second delay, so the greying text visually dissolves into the expanding background image.

On hover-out, the `text-colour-morph` animation is removed (CSS animations do not reverse) and a plain `transition: color 0.4s ease` on `.text-image-fill` carries the colour back toward transparent. The `::after` clip-path and opacity, and the link opacity, transition back using their own `transition` declarations.

Both layers share `background-size: 100vw auto` so the visible headline image and the hover-reveal image stay pixel-aligned; `background-attachment: fixed` is avoided because it does not interact correctly with the scroll-driven exit animation.

### Reduced motion

Under `@media (prefers-reduced-motion: reduce)`, the scroll-exit animation is disabled and all hover transitions (`::after`, `.site-title-link`, and the `.text-image-fill` colour animation/transition) are turned off.

## Extending

To change the hover mid-tone colour, edit the 40% stop in the `text-colour-morph` `@keyframes` block; it currently uses `--color-red-700` from [`theme.css`](../../src/styles/theme.css). To change which region of the header the background image initially hides behind, adjust the `clip-path: inset(...)` value on `.site-title-hero::after`.
