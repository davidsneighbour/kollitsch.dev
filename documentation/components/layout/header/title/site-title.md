---
title: SiteTitle
tags: []
created: 2026-07-26T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Renders the large homepage header title as an image-filled heading that dissolves into a full-width image on hover, and dissolves and shatters apart as the user scrolls past it.

## File locations

| Field | Value |
| --- | --- |
| Component | [`src/components/layout/header/title/SiteTitle.astro`](../../../../../src/components/layout/header/title/SiteTitle.astro) |
| Data | [`src/data/setup.json`](../../../../../src/data/setup.json) (site title text), `src/assets/images/headline.jpg` (background image, optimized to WebP at build time via `getImage()`) |
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

The component wraps [`TextImageFill`](../../../ui/text-image-fill.md) with `imageUrl` set to the build-time-optimized headline image (via `getImage({ format: "webp", quality: 75, src: headlineSrc, width: 2000 })`), `fallbackColor="var(--color-orange-500)"`, and `tintColor="var(--color-red-800)"` at `tintOpacity={0.1}`, so the title text is normally filled with the headline image tinted red. The title text itself comes from `setup.title` in `setup.json`, and the link points at the homepage URL resolved by `getHomepageUrl()`.

### Scroll-exit: Dissolve and shatter

The outer `<header class="site-title-hero">` uses a scroll-driven `view()` timeline (`animation-range: exit 0% exit 100%`) to run the `site-title-exit` keyframes, fading the header's opacity to zero and translating it upward by `12px` with a slight scale-down as it exits the viewport. Layered inside that outer fade, the image-filled text dissolves early and hands off to a duplicate, `aria-hidden` layer of solid-coloured letters that fly apart from the centre and fade. Full timing model and tuning knobs are documented in [Site title animations](../../../../theme/site-title.md); see that page before changing any of the exit timing.

The header uses `overflow: clip`, not `overflow: hidden` — `hidden` establishes a scroll container, which breaks `animation-timeline: view()` on the shatter-letter children (see the linked theme doc for why).

### Hover animation (desktop only, `@media (hover: hover) and (pointer: fine)`)

The hover-in sequence is deliberately staggered rather than run as one block, and it mixes two curve families on purpose:

- **Text colour pop**—a plain `transition: color` on `.text-image-fill` carries the text colour from `transparent` to `var(--color-red-700)` over 0.35 seconds on `--ease-out-expo` (`cubic-bezier(0.19, 1, 0.22, 1)`), a steep curve chosen so the colour switch reads as a distinct "pop."
- **Link fade-out**—`.site-title-link` (the clickable text layer) only starts fading its opacity to 0% once the colour pop has landed: 0.5 seconds on the same expo curve, delayed 0.35 seconds. This sequencing (pop, then fade) is intentional—running both at once made the red pop barely register before the text vanished.
- **Background reveal**—the `.site-title-hero::after` pseudo-element holds a second, full-size copy of the headline image (via the `--headline-bg` custom property set on the `<header>`). It starts `clip-path: inset(22% 8% round 48px)` (clipped to roughly the text's footprint) and `opacity: 0%`. On hover it expands to `clip-path: inset(0% round 0)` over 0.9 seconds on `--ease-in-out-circ` (`cubic-bezier(0.785, 0.135, 0.15, 0.86)`) and fades to full opacity over 0.35 seconds on the expo curve, starting after a 0.1 second delay. The clip-path deliberately uses a gentler curve than the colour/opacity transitions: expo front-loads nearly all visible motion into the first fraction of its duration, which suits a quick colour pop but made a full-bleed image reveal this large read as rushed: circ spreads the motion across the whole duration instead.

On hover-out, each property transitions back independently (no keyframes involved, so nothing needs to "reverse" or restart on rapid hover toggling), but durations are re-balanced so the reveal doesn't just collapse all at once: colour (0.35s) and link opacity (0.4s) settle back first, while the `::after` clip-path takes longer to close (0.55s), so the image keeps shrinking a beat after everything else is already at rest.

Gated behind `@media (hover: hover) and (pointer: fine)`, not just `(hover: hover)`, so hybrid touch+mouse devices that report `hover: hover` with a coarse pointer don't fire this on tap.

Both layers share `background-size: 100vw auto` so the visible headline image and the hover-reveal image stay pixel-aligned; `background-attachment: fixed` is avoided because it does not interact correctly with the scroll-driven exit animation.

### Reduced motion

Under `@media (prefers-reduced-motion: reduce)`, the scroll-exit animation (including the dissolve and shatter layers) is disabled and all hover transitions (`::after`, `.site-title-link`, and the `.text-image-fill` colour transition) are turned off. The shatter layer is additionally forced to `display: none`.

## Extending

To change the hover reveal colour, edit `--color-red-700` where it's used in the `@media (hover: hover)` block, or swap the custom property reference; it comes from [`theme.css`](../../../../../src/styles/theme.css). To change which region of the header the background image initially hides behind, adjust the `clip-path: inset(...)` value on `.site-title-hero::after`. To change the scroll-exit dissolve/shatter timing, see [Site title animations](../../../../theme/site-title.md).
