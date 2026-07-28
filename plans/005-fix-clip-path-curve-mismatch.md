# 005—Match the clip-path reveal's curve to its scale

- **Commit:** 4c4717a8b23f
- **Severity:** MEDIUM
- **Category:** Easing & duration / Cohesion
- **Estimated scope:** 1 file, 1 declaration

## Problem

`.site-title-hero:hover::after`'s `clip-path` transition uses `cubic-bezier(0.25, 0.46, 0.45, 0.94)`. This is the course's own named curve for "button press"—a small, brief interaction—but here it drives the biggest, most-watched motion in the whole hover reveal: a 700ms `clip-path` expansion that grows the header image from a small inset region to fill the entire header. Every other stage in the same reveal (the `::after` opacity fade, the text color transition, the link's opacity fade) uses the stronger `cubic-bezier(0.19, 1, 0.22, 1)` (the course's pick for "card hover, text reveal"). The result: the most prominent movement in the sequence has the gentlest curve, while the subtler stages around it have the strongest one—backwards, and it leaves two different curve personalities inside what should read as one choreography.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/layout/header/title/SiteTitle.astro` | 97-103 | `.site-title-hero:hover::after`'s transition, mixing two different curves |

### Current code

```css
/* src/components/layout/header/title/SiteTitle.astro:97 */
.site-title-hero:hover::after {
  clip-path: inset(0% round 0);
  opacity: 100%;
  transition:
    clip-path 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity 0.35s cubic-bezier(0.19, 1, 0.22, 1) 0.1s;
}
```

## Target

```css
.site-title-hero:hover::after {
  clip-path: inset(0% round 0);
  opacity: 100%;
  transition:
    clip-path 0.7s cubic-bezier(0.19, 1, 0.22, 1),
    opacity 0.35s cubic-bezier(0.19, 1, 0.22, 1) 0.1s;
}
```

Only the `clip-path` curve changes—from `cubic-bezier(0.25, 0.46, 0.45, 0.94)` to `cubic-bezier(0.19, 1, 0.22, 1)`. No duration, delay, or any other declaration changes.

**Why this value:** `cubic-bezier(0.19, 1, 0.22, 1)` (`--ease-out-expo`) is already the curve every other stage of this exact hover reveal uses (`SiteTitle.astro:102`, `108`, `114`, `118`, `123`). Reusing it here does two things at once: it replaces a curve tagged for a small, brief interaction ("button press") with one tagged for this exact use case ("card hover, text reveal"—a hover-triggered image/text reveal is precisely that), and it makes the whole choreography share one curve family instead of two, so it reads as a single deliberate motion instead of a stage that feels slightly different from its neighbors.

## Conventions to follow

- `cubic-bezier(0.19, 1, 0.22, 1)` is already this file's established curve for every stage of this hover reveal—this plan simply extends it to the one stage that didn't get it yet, not introducing a new value.

## Steps

1. In `SiteTitle.astro:101`, change `clip-path 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)` to `clip-path 0.7s cubic-bezier(0.19, 1, 0.22, 1)`.
2. Leave the `0.7s` duration and the `opacity 0.35s cubic-bezier(0.19, 1, 0.22, 1) 0.1s` declaration on the same rule untouched.
3. Leave every other rule in the file untouched—this is a one-value change.

## Out of scope

- Do not change the `0.7s` duration—this plan is about the curve, not the timing.
- Do not touch the base (hover-out) `::after` rule, the text color rules, the `.site-title-link` opacity rules, the scroll-linked exit animation, or the reduced-motion block.
- Do not touch `Header.astro` or `#navbar-brand`.

## Verification

### Build

- [ ] Type-check and lint pass.

### Behavior

- [ ] Hover the site title: the image reveal, opacity fade, and color transition all now visibly share the same curve character—no stage should stand out as "softer" than the others.
- [ ] Un-hover: the reverse `clip-path` transition (governed by the base rule's own `0.4s cubic-bezier(0.19, 1, 0.22, 1)`, already correct and untouched) still looks consistent with the hover-in direction.

### Feel

- [ ] Record the hover-in sequence and scrub frame by frame—the clip-path expansion should now show the same fast-start, gentle-settle character as the opacity/color stages next to it, rather than a flatter, more even-paced curve.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

None—this is a direct, low-risk value swap reusing a curve already proven correct elsewhere in the exact same choreography.
