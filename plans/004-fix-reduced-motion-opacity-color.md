# 004 — Keep opacity/color transitioning under prefers-reduced-motion

- **Commit:** 28fb96812a30
- **Severity:** MEDIUM
- **Category:** Accessibility
- **Estimated scope:** 1 file, ~10 lines

## Problem

The site title's `prefers-reduced-motion: reduce` block sets `transition: none` on the `::after` reveal, on `.site-title-link`, and on the text color — removing opacity and color feedback entirely instead of keeping it. The rule under reduced motion is "gentler, not zero": movement should stop, but opacity/color/background-color transitions should keep running, because removing them entirely makes the UI's state changes less understandable, not just less flashy. `Header.astro`'s own `#navbar-brand` reduced-motion rule two files over already does this correctly — it zeroes the `transform` but keeps `transition: opacity 0.3s ease;` — so this is also a consistency gap within the same feature (the hero title and its sticky-brand counterpart), not just a standalone accessibility miss.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/layout/header/title/SiteTitle.astro` | 153–168 | The `prefers-reduced-motion: reduce` block for the whole hero |
| `src/components/layout/header/Header.astro` | 312–316 | The correct exemplar: `#navbar-brand`'s own reduced-motion rule |

### Current code

```css
/* src/components/layout/header/title/SiteTitle.astro:153 */
@media (prefers-reduced-motion: reduce) {
  .site-title-hero {
    animation: none;
  }

  .site-title-hero::after,
  .site-title-link {
    transition: none;
  }

  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  .site-title-hero .site-title-link :global(.text-image-fill) {
    animation: none;
    transition: none;
  }
}
```

The exemplar this should match:

```css
/* src/components/layout/header/Header.astro:312 */
@media (prefers-reduced-motion: reduce) {
  #navbar-brand {
    transform: none;
    transition: opacity 0.3s ease;
  }

  #navigation-and-theme-select {
    animation: none;
  }
}
```

## Target

Keep `.site-title-hero { animation: none; }` as-is — the scroll-linked exit is a movement/transform-driven parallax-style effect tied to scroll position, and stopping movement entirely under reduced motion is correct there (it isn't an opacity-only fade, it's `translateY` + `scale` bound to `animation-timeline: view()`, which is exactly the kind of scroll-linked motion that should be disabled, not softened).

For the hover reveal, instead of blanket `transition: none`, disable only the transform/clip-path-driven movement and keep opacity and color running:

```css
@media (prefers-reduced-motion: reduce) {
  .site-title-hero {
    animation: none;
  }

  .site-title-hero::after {
    transition: opacity 0.3s ease;
  }

  .site-title-link {
    transition: opacity 0.4s ease;
  }

  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  .site-title-hero .site-title-link :global(.text-image-fill) {
    animation: none;
    transition: color 0.4s ease;
  }
}
```

The `clip-path` half of `::after`'s transition is dropped entirely under `reduce` (no `clip-path` in the property list above), so the image reveal snaps instantly to its start/end shape instead of animating a shape change — shape/clip-path movement is exactly the kind of motion reduced-motion users want stopped. `opacity` keeps a short transition on all three elements so the reveal/conceal still reads as a soft cross-fade instead of a hard cut, and the text color keeps transitioning too.

**Why these values:**

- `opacity 0.3s ease` on `::after`: matches its own hover-out opacity duration (`0.3s`) already declared in the non-reduced-motion rule at line 106 — reuse the existing duration rather than inventing a new one.
- `opacity 0.4s ease` on `.site-title-link`: matches its own hover-out opacity duration already declared at line 132.
- `color 0.4s ease` on the text: matches the text color's hover-out duration already declared at line 122 (or whatever plan 001 leaves it at, if applied first — reuse that duration).
- `ease` (not the `cubic-bezier` from plan 003) is intentionally left as the plain built-in here: reduced-motion transitions are a fallback path, not the primary feel — matching the pre-plan-003 duration/curve pairing keeps this plan independent of whether plan 003 has landed yet. If plan 003 has already been applied, use its curve here too for consistency instead of reverting to `ease`.

## Conventions to follow

- Match `Header.astro:312-316`'s pattern exactly: zero out `transform`/`animation`/`clip-path`, keep `opacity` (and here, `color`) transitioning.
- Keep the `stylelint-disable-next-line selector-pseudo-class-no-unknown` comment above the `:global()` selector, matching this file's existing convention.

## Steps

1. In `SiteTitle.astro:153-168`, leave the top-level `.site-title-hero { animation: none; }` rule untouched.
2. Replace `.site-title-hero::after, .site-title-link { transition: none; }` with two separate rules, each keeping an `opacity` transition (see Target).
3. In the `:global(.text-image-fill)` rule, keep `animation: none;` (or, if plan 001 has landed and there's no longer an `animation` property on this element, drop that line) but replace `transition: none;` with `transition: color 0.4s ease;` (matching whatever duration the non-reduced-motion `color` transition uses at the time).

## Out of scope

- Do not change `.site-title-hero`'s own `animation: none` — the scroll-linked exit should stay fully disabled under reduced motion.
- Do not touch `Header.astro`'s `#navbar-brand` reduced-motion rule — it's already correct and is the exemplar, not a target.
- Do not add `clip-path` back into the reduced-motion transition list — shape movement should stay disabled.
- If plan 003 has been applied first, do not revert its curve on the non-reduced-motion rules; only this reduced-motion block is in scope here.

## Verification

### Build

- [ ] Type-check and lint pass.

### Behavior

- [ ] With `prefers-reduced-motion: reduce` emulated in DevTools, hover the site title: the image shape snaps instantly (no clip-path animation) but opacity and text color still fade in/out smoothly over their stated durations — nothing should look like a hard, instant cut on opacity or color.
- [ ] Still under `reduce`, confirm the scroll-linked hero exit remains fully static (no movement) — unchanged from before this plan.
- [ ] With reduced motion off (`no-preference`), confirm nothing changed — this plan only touches the `@media (prefers-reduced-motion: reduce)` block.

### Feel

- [ ] Toggle the OS/DevTools reduced-motion setting and hover a few times — it should feel calmer than the full animation but still communicate "something responded to your hover," not feel like a broken or inert element.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

None — this is a direct application of a pattern the codebase already implements correctly one file over (`Header.astro`'s `#navbar-brand`), so there's no open feel question here.
