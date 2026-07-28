---
title: Site title animations
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

The homepage's large site title has two independent animated behaviours: a hover reveal that swaps the text fill for a full-width image, and a scroll-exit sequence that dissolves the text and shatters it into letters as it scrolls out of view. Both are purely decorative gimmicks — neither has any bearing on usability or accessibility, and both disable entirely under reduced motion.

## File location

| Field | Value |
| --- | --- |
| Component | [`src/components/layout/header/title/SiteTitle.astro`](../../src/components/layout/header/title/SiteTitle.astro) |

See [SiteTitle](../components/layout/header/title/site-title.md) for the component's full props/usage reference.

## Hover reveal

On hover-in (desktop only, gated behind `@media (hover: hover) and (pointer: fine)` so touch devices — including hybrid touch+mouse ones that report `hover: hover` — are unaffected), the sequence is deliberately staggered, and deliberately mixes two curve families rather than sharing one:

- **Text colour pop**—a plain `transition: color` on the `TextImageFill` text carries its colour from `transparent` to `var(--color-red-700)` over 0.35 seconds, on `--ease-out-expo` (`cubic-bezier(0.19, 1, 0.22, 1)`). This steep curve front-loads almost all the visible change into the first fraction of the duration, which is exactly what gives the colour switch its "pop."
- **Link fade-out**—the clickable text layer (`.site-title-link`) fades its opacity to 0% over 0.5 seconds on the same expo curve, but only starts after a 0.35 second delay — i.e. only once the colour pop has essentially finished. Running the pop and the fade concurrently (an earlier iteration) made the red barely register before the text vanished into the image; sequencing them fixes that.
- **Background reveal**—a `.site-title-hero::after` pseudo-element holds a second, full-size copy of the headline image (via a `--headline-bg` custom property set on the `<header>`). It starts clipped down to roughly the text's footprint (`clip-path: inset(22% 8% round 48px)`) at `opacity: 0%`, then on hover expands to cover the full header (`clip-path: inset(0% round 0)`) over 0.9 seconds on `--ease-in-out-circ` (`cubic-bezier(0.785, 0.135, 0.15, 0.86)`), and fades in over 0.35 seconds on the expo curve, starting after a 0.1 second delay. The clip-path deliberately does *not* share the expo curve: expo's front-loading suits a snappy colour pop, but made a reveal this large (the whole header) read as rushed. The gentler circ curve spreads the visible motion across the full duration instead, which reads as a more deliberate, weightier reveal appropriate to its size.

On hover-out, every property transitions back independently using its own `transition` declaration — there are no `@keyframes` involved in the hover effect, so nothing needs to "reverse" or restarts oddly on rapid hover toggling. Durations are rebalanced from hover-in so the reveal doesn't just collapse all at once: the colour (0.35s) and link opacity (0.4s) settle back first, while the `::after` clip-path takes longer to close (0.55s) — the image keeps shrinking for a beat after everything else is already at rest, rather than all three snapping shut together. Both the text fill and the `::after` reveal share `background-size: 100vw auto` so they stay pixel-aligned; `background-attachment: fixed` is avoided because it doesn't interact correctly with the scroll-driven exit animation below.

## Scroll-exit: dissolve and shatter

As the header scrolls out of view, the image-filled text dissolves and shatters into letters that fly apart, layered inside the whole-header opacity/transform fade that already carries the exit.

### The three layers

All three are driven by their own `animation-timeline: view()` bound to the header's own scroll-exit progress (`exit 0%` = header fully in view, `exit 100%` = fully scrolled past), so nothing here needs JavaScript or scroll listeners.

1. **Outer fade** (`.site-title-hero`, unchanged from before this effect existed) — fades the whole header's opacity to 0 and translates/scales it slightly, across the full `exit 0%` to `exit 100%` range. This is the outer envelope; the two layers below are cosmetic detail happening *inside* it, not a replacement for it.
2. **Image-fill dissolve** (`.site-title-fill`, the `TextImageFill` text) — fades and blurs out early in the exit.
3. **Shatter letters** (`.site-title-shatter`, a duplicate `aria-hidden="true"` layer) — crossfades in as the image-fill dissolves, in a solid accent colour (`var(--color-red-700)`, matching the hover reveal's accent), then each letter (`.shatter-letter`) flies outward from the title's centre and fades, on its own staggered `animation-range`.

### Timing model and tuning knobs

All timings are percentages of the header's own scroll-exit progress, defined as named constants at the top of `SiteTitle.astro`'s frontmatter so the whole sequence can be shifted earlier/later or restretched without touching the markup or keyframes:

| Constant | Current value | Meaning |
| --- | --- | --- |
| `fillDissolveEnd` | `25` | The image-filled text is fully dissolved (opacity 0, blurred) by this point. |
| `shatterInStart` | `6` | The solid-colour letters start fading in. |
| `shatterInEnd` | `fillDissolveEnd` | ...and are fully faded in by the time the image-fill is gone, so the handoff has no gap. |
| `shatterFlyStart` | `20` | The first letter (title's centre) starts flying outward. Overlaps the tail end of the crossfade on purpose. |
| `shatterStagger` | `17` | Spread, in percentage points, between the first and last letter's fly-start time. |
| `shatterWindow` | `25` | How long each individual letter's own fly-out animation takes, once it starts. |

`fillDissolveEnd`, `shatterInStart`, and `shatterInEnd` are written onto the `<header>`'s inline `style` as `--fill-dissolve-end`, `--shatter-in-start`, and `--shatter-in-end` custom properties, and read back via `var()` in the `<style>` block's `animation-range` declarations. `shatterFlyStart`, `shatterStagger`, and `shatterWindow` feed a build-time loop that computes each letter's own `animation-range` (as a literal percentage pair) plus its fly-out direction, and writes them as an inline `style` attribute per `<span class="shatter-letter">`.

Per-letter fly direction is computed from each letter's offset from the title's horizontal centre (`centerIndex`), not randomised, so letters near the edges travel further and rotate more (`--shatter-tx`, `--shatter-ty`, `--shatter-rot`) — an explosion-from-the-middle look rather than uniform motion.

When retiming the sequence, keep `shatterInEnd` equal to (or just past) `fillDissolveEnd` so the image-fill text doesn't visibly disappear before the letters have finished fading in underneath it.

### Why `overflow: clip`, not `overflow: hidden`

`.site-title-hero` clips its hover-reveal pseudo-element and the shatter letters to its own bounds. It originally did this with `overflow: hidden`, which turned out to break the shatter/dissolve layers: `overflow: hidden` establishes a *scroll container* per the CSS Overflow spec, even though nothing about it is actually user-scrollable. Descendant elements using `animation-timeline: view()` resolve their progress against their nearest scroll container — so `.site-title-fill` and `.site-title-shatter`, being descendants of `.site-title-hero`, were resolving against the header's own static (non-scrolling) scrollport instead of the page's, freezing their progress at whatever it started at (their `from` keyframe state, permanently).

`overflow: clip` visually clips identically but is explicitly *not* a scroll container (it forbids scrolling entirely, including programmatic scrolling), so descendants correctly fall through to the page's real scroller for their `view()` timeline. If a future change reintroduces `overflow: hidden` here, the dissolve/shatter layers will silently stop animating — the outer `.site-title-hero` fade will keep working because it doesn't have this ancestor problem (it's the element that establishes the scroll container, not a descendant of one).

## Accessibility

The hover reveal is gated behind `@media (hover: hover) and (pointer: fine)`, so touch devices never see it — including hybrid touch+mouse devices that report `hover: hover` with a coarse pointer — there's no hover state to get stuck in after a tap. The shatter layer duplicates the title's text purely for visual effect, so it is `aria-hidden="true"` and `pointer-events: none` — the only accessible copy of the title text is the real link inside `TextImageFill`.

Under `prefers-reduced-motion: reduce`, both animated behaviours are disabled: the hover reveal's `::after` clip-path/opacity and the text colour transition fall back to plain, short `ease` transitions with no movement; the scroll-exit's outer fade, `.site-title-fill`'s dissolve, and `.site-title-shatter`'s crossfade/fly-out are all set to `animation: none`, and `.site-title-shatter` is additionally forced to `display: none`. The image-filled title stays fully visible and static either way. See [SiteTitle](../components/layout/header/title/site-title.md#reduced-motion) for the exact reduced-motion CSS.
