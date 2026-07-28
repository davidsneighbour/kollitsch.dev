---
title: LetterGlitch
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Renders a canvas-based "Matrix"-style animated letter glitch background behind slotted content, desktop/fine-pointer only.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/gimmicks/LetterGlitch.astro` |
| Data | none |
| Tests | none |

## Props

Extends `HTMLAttributes<"section">`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `glitchColors` | `string[]` | `["#5e4491", "#a476ff", "#241a38"]` | Fallback colour palette used when `useBrandTokens` resolves nothing |
| `glitchSpeed` | `number` | `33` | Milliseconds between glitch updates |
| `smooth` | `boolean` | `true` | When `true`, changed cells fade between colours instead of switching instantly |
| `useBrandTokens` | `boolean` | `true` | When `true`, resolves `brandVars` from computed CSS instead of using `glitchColors` |
| `brandVars` | `string[]` | `["--brand-300", "--brand-600", "--brand-900"]` | CSS custom property names resolved (via an offscreen canvas fill) into the active colour palette |
| `outerVignette` | `boolean` | `true` | Radial vignette fading the canvas edges to the shell background colour |
| `centerVignette` | `boolean` | `false` | Radial vignette darkening the canvas centre |

## Usage

```astro
---
import LetterGlitch from '@components/gimmicks/LetterGlitch.astro';
---

<LetterGlitch>
  <div>
    <h2>Have a project in mind?</h2>
  </div>
</LetterGlitch>
```

## Behaviour

The `<section class="letter-glitch-band">` is hidden by default and only shown at `min-width: 1024px` combined with `(pointer: fine)`, so this effect is desktop-only. The former `src/components/content/cta/letter-glitch.astro` wrapper was removed because its generic project CTA copy did not have a clear page placement in the current editorial design system. Use `LetterGlitch` directly only when a page has a deliberate, content-specific CTA that benefits from the animated treatment.

The animation itself is a `LetterGlitchController` class, one per `[data-letter-glitch]` root, instantiated on `astro:page-load` and torn down on `astro:before-swap` (so instances don't leak across view-transition navigations):

- Reads its configuration from a `data-letter-glitch-config` JSON attribute (validated field-by-field, falling back per-field on parse failure).
- Fills a grid of monospace characters/symbols sized to the container (`ResizeObserver`-driven, debounced 100ms), each with its own current and target colour.
- On an interval of `glitchSpeed` ms, randomly re-picks ~5% of cells' character and target colour; when `smooth` is enabled, colour changes interpolate over several animation frames rather than snapping.
- When `useBrandTokens` is `true`, resolves each `brandVars` CSS custom property to an RGB colour via a 1×1 offscreen canvas fill (handles any valid CSS colour, not just hex).
- Only runs on `(min-width: 1024px) and (pointer: fine)` (a `matchMedia` listener starts/stops it as that condition changes) and respects `(prefers-reduced-motion: reduce)` (renders one static frame instead of animating).

## Extending

To use different brand colours, either override the `--brand-300`/`--brand-600`/`--brand-900` CSS custom properties in scope, or pass `useBrandTokens={false}` with an explicit `glitchColors` array.
