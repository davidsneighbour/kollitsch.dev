# 001—Fix text-colour-morph restarting on rapid hover

- **Commit:** 28fb96812a30
- **Severity:** HIGH
- **Category:** Interruptibility & springs
- **Estimated scope:** 1 file, ~15 lines

## Problem

`text-colour-morph` is a `@keyframes` animation applied only while `.site-title-hero:hover` matches. `@keyframes` restart from 0% every time they're (re-)applied—they cannot retarget mid-flight the way a CSS transition or spring can. If a user hovers the site title, moves the pointer out, then back in before the 900ms morph finishes, the animation is removed (selector stops matching) and reapplied from scratch on the next hover-in. This produces a visible snap back toward `transparent` instead of a smooth continuation from wherever the color currently was—the same defect class as the Sonner toast bug (a second toast added quickly made the first jump to its new position).

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/layout/header/title/SiteTitle.astro` | 79–91 | The `text-colour-morph` `@keyframes` definition |
| `src/components/layout/header/title/SiteTitle.astro` | 119–129 | The hover-out/hover-in rules that apply and remove the animation |

### Current code

```css
/* src/components/layout/header/title/SiteTitle.astro:79 */
@keyframes text-colour-morph {
  0% {
    color: transparent;
  }

  40% {
    color: var(--color-red-700);
  }

  100% {
    color: var(--color-gray-400);
  }
}

/* src/components/layout/header/title/SiteTitle.astro:119 */
/* On hover-out, transition from gray back to transparent */
/* stylelint-disable-next-line selector-pseudo-class-no-unknown */
.site-title-link :global(.text-image-fill) {
  transition: color 0.4s ease;
}

/* On hover-in, run the three-stop colour animation */
/* stylelint-disable-next-line selector-pseudo-class-no-unknown */
.site-title-hero:hover .site-title-link :global(.text-image-fill) {
  animation: text-colour-morph 0.9s ease forwards;
}
```

## Target

Drop the `@keyframes` for the color stage entirely and drive the three stops with a plain CSS transition on `color`, so the browser retargets from whatever the current computed color is instead of restarting from `0%`. A 3-stop sequence can't be expressed as a single `transition`, so collapse it to the two stops that matter for a hover reveal—a fast move to the accent color, held by the accompanying `::after` reveal, since the final `gray` stop only exists to dissolve the text as the image takes over (which the `.site-title-hero:hover .site-title-link { opacity: 0% }` rule two rules down already does).

```css
/* stylelint-disable-next-line selector-pseudo-class-no-unknown */
.site-title-link :global(.text-image-fill) {
  color: transparent;
  transition: color 0.6s var(--ease-out-expo, cubic-bezier(0.19, 1, 0.22, 1));
}

/* stylelint-disable-next-line selector-pseudo-class-no-unknown */
.site-title-hero:hover .site-title-link :global(.text-image-fill) {
  color: var(--color-red-700);
}
```

Remove the now-unused `@keyframes text-colour-morph` block (lines 79–91) and its reference at line 128.

**Why these values:**

- `transition` instead of `@keyframes`: transitions retarget from the current value on interruption; keyframes always restart from `0%`. This is the fix for the bug itself.
- `0.6s`: keeps the same rough feel as the original 900ms morph's first two stops (0%→40% was 40% of 900ms ≈ 360ms to reach the accent color; 600ms on a direct two-stop transition reads similarly since there's no longer a third stop to travel through).
- `cubic-bezier(0.19, 1, 0.22, 1)` (`--ease-out-expo`): this is the exact curve the *Animations on the Web* course names for "card hover, text reveal"—matches this use case precisely and replaces the built-in `ease` this file uses everywhere else (see plan 003).
- Dropping the third `gray` stop: the text is already fading to `opacity: 0%` via the existing `.site-title-hero:hover .site-title-link { opacity: 0%; transition: opacity 0.5s ease 0.2s; }` rule (line 135–138), so a separate gray stop on the color itself is redundant motion competing with that fade—removing it simplifies without losing the visual effect.

## Conventions to follow

- `--ease-out-expo` isn't yet defined as a token anywhere in this repo (checked: no `--ease-*` custom properties exist in `src/`). Inline the `cubic-bezier(0.19, 1, 0.22, 1)` value directly as done above; do not invent a new token file for a single use.
- Keep the `/* stylelint-disable-next-line selector-pseudo-class-no-unknown */` comments exactly as they are above each `:global()` selector—that's this file's existing convention for the Astro `:global()` pseudo-class lint exemption.

## Steps

1. Delete the `@keyframes text-colour-morph` block at `SiteTitle.astro:79-91`.
2. Replace the two rules at `SiteTitle.astro:119-129` with the transition-based version above (add a base `color: transparent` declaration to the hover-out rule; change the hover-in rule from `animation: text-colour-morph 0.9s ease forwards;` to `color: var(--color-red-700);`).
3. Leave every other rule in the file (`::after` clip-path reveal, `.site-title-link` opacity fade, the reduced-motion block) untouched—they're covered by separate plans.

## Out of scope

- Do not touch the `::after` clip-path reveal rules (lines 93-117)—covered by plan 003.
- Do not touch the reduced-motion block (lines 153-168)—covered by plan 004.
- Do not touch `Header.astro` or `#navbar-brand`—covered by plan 002.
- Do not introduce a new animation library or a CSS custom-property token file for a single easing value.

## Verification

### Build

- [ ] Type-check and lint pass (stylelint in particular, given the `:global()` exemption comments).

### Behavior

- [ ] Hover the site title once: text goes from transparent to the red accent color smoothly, then fades out as the image reveals (unchanged from before).
- [ ] Hover in, quickly move out, then back in within ~200ms, repeated several times: the color transitions smoothly toward whatever direction the pointer state currently dictates—it must never visibly snap back to fully transparent mid-hover.
- [ ] With `prefers-reduced-motion: reduce` emulated in DevTools, nothing about this specific rule needs to change (plan 004 handles the reduced-motion block separately)—just confirm this change didn't regress that block.

### Feel

- [ ] Record the hover interaction and scrub frame by frame—the color should ease in smoothly with a strong early move (per `ease-out-expo`), not feel flat.
- [ ] Look at it again with fresh eyes before calling it done: does removing the third (`gray`) stop change the perceived quality of the reveal versus the original three-stop version? If it now feels like something is missing, note that in this plan's Notes for a follow-up rather than reintroducing `@keyframes`.

## Notes

Whether losing the middle `gray` stop changes the felt quality of the reveal is a judgment call the audit can't make from code alone—the three-stop sequence may have been chosen deliberately for how it reads against the image beneath it. If the two-stop version feels thinner, an alternative is to keep three stops but implement them as two chained transitions using a short `transitionend`-driven class swap instead of `@keyframes`—that preserves interruptibility while keeping the middle stop, at the cost of a few lines of inline script. Flagging this trade-off for a human to decide after feel-checking the simpler version first.
