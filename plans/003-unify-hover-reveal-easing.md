# 003 — Replace built-in ease with a picked curve across the title hover reveal

- **Commit:** 28fb96812a30
- **Severity:** MEDIUM
- **Category:** Easing & duration (with a Cohesion angle)
- **Estimated scope:** 1 file, ~6 declarations

## Problem

The hover reveal on the site title hero runs four sub-animations in sequence (`::after` clip-path expand, `::after` opacity fade-in, `.site-title-link` opacity fade-out, and the text color transition from plan 001). Only one of the four — the `::after` clip-path enter — uses a deliberately picked curve (`cubic-bezier(0.25, 0.46, 0.45, 0.94)`). Every other stage uses the CSS built-in `ease`, which the course flags as almost never strong enough: its acceleration is too weak, so those stages feel flat next to the one stage that got a real curve, undermining what the code comments describe as a single deliberate choreography.

This plan only touches curves, not durations or the sequence itself — the multi-stage timing (documented in the comment at `SiteTitle.astro:62-77`) is a deliberate design choice and is not being re-litigated here.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/layout/header/title/SiteTitle.astro` | 105–107 | `::after` base-state (hover-out) transition: `clip-path 0.4s ease, opacity 0.3s ease` |
| `src/components/layout/header/title/SiteTitle.astro` | 114–117 | `::after` hover-in transition: `opacity 0.35s ease 0.1s` (the `clip-path` half already has a real curve) |
| `src/components/layout/header/title/SiteTitle.astro` | 131–133 | `.site-title-link` base-state (hover-out) transition: `opacity 0.4s ease` |
| `src/components/layout/header/title/SiteTitle.astro` | 135–138 | `.site-title-link` hover-in transition: `opacity 0.5s ease 0.2s` |

### Current code

```css
/* src/components/layout/header/title/SiteTitle.astro:93 */
@media (hover: hover) {
  .site-title-hero::after {
    /* ...static properties omitted... */
    transition:
      clip-path 0.4s ease,
      opacity 0.3s ease;
    z-index: 0;
  }

  .site-title-hero:hover::after {
    clip-path: inset(0% round 0);
    opacity: 100%;
    transition:
      clip-path 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 0.35s ease 0.1s;
  }

  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  .site-title-link :global(.text-image-fill) {
    transition: color 0.4s ease;
  }

  .site-title-link {
    transition: opacity 0.4s ease;
  }

  .site-title-hero:hover .site-title-link {
    opacity: 0%;
    transition: opacity 0.5s ease 0.2s;
  }
}
```

## Target

Swap every plain `ease` for `cubic-bezier(0.19, 1, 0.22, 1)` — `--ease-out-expo`, the course's named pick for "strong: card hover, text reveal," which is exactly this surface. Keep every duration and delay exactly as they are; only the curve keyword changes.

```css
@media (hover: hover) {
  .site-title-hero::after {
    transition:
      clip-path 0.4s cubic-bezier(0.19, 1, 0.22, 1),
      opacity 0.3s cubic-bezier(0.19, 1, 0.22, 1);
    z-index: 0;
  }

  .site-title-hero:hover::after {
    clip-path: inset(0% round 0);
    opacity: 100%;
    transition:
      clip-path 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
      opacity 0.35s cubic-bezier(0.19, 1, 0.22, 1) 0.1s;
  }

  /* stylelint-disable-next-line selector-pseudo-class-no-unknown */
  .site-title-link :global(.text-image-fill) {
    transition: color 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .site-title-link {
    transition: opacity 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  }

  .site-title-hero:hover .site-title-link {
    opacity: 0%;
    transition: opacity 0.5s cubic-bezier(0.19, 1, 0.22, 1) 0.2s;
  }
}
```

Note: the `.site-title-hero:hover::after`'s `clip-path` half (0.7s, `cubic-bezier(0.25, 0.46, 0.45, 0.94)`) is left untouched — it's the one stage that already has a deliberately picked curve and is not part of this problem.

**Why these values:**

- `cubic-bezier(0.19, 1, 0.22, 1)`: this is `--ease-out-expo` from the course's curve list, named specifically for "card hover, text reveal" — a closer match to this exact use case (a hover-triggered image/text reveal) than inventing a new curve.
- Durations and delays are unchanged: this plan is scoped to curve quality only, not the sequence timing, per Hard Rule 6 (the staggered timing is a documented deliberate choice, not a defect).

## Conventions to follow

- Do not touch the `clip-path 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94)` declaration inside `.site-title-hero:hover::after` — it already follows the convention this plan is trying to spread to the other four declarations.
- No `--ease-*` custom-property tokens exist in this repo yet — inline the `cubic-bezier()` value literally, matching how the existing correct declaration already does it.

## Steps

1. In the `::after` base-state rule (`SiteTitle.astro:105-107`), replace both `ease` keywords with `cubic-bezier(0.19, 1, 0.22, 1)`.
2. In the `::after` hover-in rule (`SiteTitle.astro:114-117`), replace only the `opacity` transition's `ease` with `cubic-bezier(0.19, 1, 0.22, 1)` — leave the `clip-path` half untouched.
3. In the `.text-image-fill` hover-out rule (`SiteTitle.astro:122`), replace `ease` with `cubic-bezier(0.19, 1, 0.22, 1)`. If plan 001 has already been applied, this declaration will instead read `color: transparent; transition: color 0.6s cubic-bezier(0.19, 1, 0.22, 1);` — apply this change to whatever the color transition's duration is at the time, only touching the curve keyword.
4. In `.site-title-link`'s base-state rule (`SiteTitle.astro:131-133`), replace `ease` with `cubic-bezier(0.19, 1, 0.22, 1)`.
5. In `.site-title-hero:hover .site-title-link` (`SiteTitle.astro:135-138`), replace `ease` with `cubic-bezier(0.19, 1, 0.22, 1)`.

## Out of scope

- Do not change any duration or delay value — curves only.
- Do not touch the `clip-path` curve that's already `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- Do not touch the `@keyframes site-title-exit` scroll-driven animation (its `linear` easing is correct and exempt — see AUDIT.md's scroll-driven-animation exemption).
- Do not touch the reduced-motion block — covered by plan 004.
- If plan 001 (keyframe restart fix) has been applied first, only update the curve on whatever `color` transition rule exists at that point; do not reintroduce `@keyframes`.

## Verification

### Build

- [ ] Type-check and lint pass.

### Behavior

- [ ] Hover the site title: the image reveal, text fade, and (if plan 001 applied) color transition all now share a visibly steeper, more deliberate ease-out feel instead of the flatter built-in curve.
- [ ] Un-hover: the reverse transitions (image conceal, text fade back in) use the same curve family.
- [ ] With `prefers-reduced-motion: reduce` emulated in DevTools, this file's reduced-motion block still disables these transitions per plan 004's fix — confirm this curve change doesn't need any reduced-motion-specific handling of its own (curves don't need to differ under reduced motion; only movement needs gating).

### Feel

- [ ] Record the hover-in sequence and scrub frame by frame — every stage should now show a fast initial move that settles gently, matching the one stage (`clip-path` enter) that already looked right. If any stage still feels flat, the curve is too weak for that stage specifically — reconsider before shipping, don't just accept it.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

Whether `--ease-out-expo` is strong enough for the `opacity`-only stages (versus the `clip-path` stage, which has visible size/shape to carry the curve) is a feel judgment the audit can't fully make from code — opacity curves are more subtle to perceive than shape curves. If the opacity stages still read as flat after this change, `cubic-bezier(0.23, 1, 0.32, 1)` (`--ease-out-quint`, one step gentler) is the next value to try.
