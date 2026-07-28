# 002 — Replace transition-all and symmetric timing on the sticky brand

- **Commit:** 28fb96812a30
- **Severity:** HIGH
- **Category:** Easing & duration
- **Estimated scope:** 2 files, ~10 lines

## Problem

`#navbar-brand` uses Tailwind's `transition-all duration-600 ease-in-out`, which compiles to `transition-property: all`. That animates every property that changes on the element instead of only the two that matter (`opacity`, `transform`), which is the exact `transition: all` defect called out in the audit — it can pick up unintended properties and isn't guaranteed to stay on the GPU. The same single rule also drives both directions: appearing when the hero scrolls out of view and disappearing when it scrolls back in use an identical 600ms `ease-in-out`, but the user has already decided which state they're heading to in each case, so the two directions deserve different curves — and `ease-in-out` is the course's guidance for "moving while already on screen," not for entering/exiting.

## Where

| File | Lines | What's there |
| --- | --- | --- |
| `src/components/layout/header/Header.astro` | 54–62 | The `#navbar-brand` anchor with its Tailwind transition classes |
| `src/components/layout/header/Header.astro` | 250–257 | The global `#navbar-brand` transform rules that pair with the opacity classes |

### Current code

```astro
<!-- src/components/layout/header/Header.astro:54 -->
<span id="navbar-sitetitle">
  <a
    id="navbar-brand"
    href={getHomepageUrl()}
    class="font-changa flex-rows flex items-center gap-2 p-1.5 text-2xl opacity-0 transition-all duration-600 ease-in-out"
  >
    <Icon name="house-fill" class="place-self-center" />
    {setup.title}
  </a>
</span>
```

```css
/* src/components/layout/header/Header.astro:250 */
/* Brand name: slide in from the left as the site title scrolls away */
#navbar-brand {
  transform: translateX(-6px);
}

#navbar-brand.opacity-100 {
  transform: translateX(0);
}
```

`initStickyBrandObserver()` (same file, ~line 197) toggles `opacity-100`/`opacity-0` on `#navbar-brand` via an `IntersectionObserver` watching the hero's placeholder element — there is no separate "closing" trigger, both directions go through the same class toggle.

## Target

Replace the Tailwind transition utility classes with an explicit `transition` declaration naming only `opacity` and `transform`, and give the appear/disappear directions their own duration and curve using the `.opacity-100` class as the direction switch (mirroring how `#navbar-brand.opacity-100` already overrides the `transform` value).

```css
#navbar-brand {
  transform: translateX(-6px);
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}

#navbar-brand.opacity-100 {
  transform: translateX(0);
  transition:
    opacity 220ms cubic-bezier(0.16, 1, 0.3, 1),
    transform 220ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

Remove `opacity-0 transition-all duration-600 ease-in-out` from the `class` list on the `<a id="navbar-brand">` element (`Header.astro:57`), keeping only `opacity-0` if Tailwind's base opacity utility is still wanted as the initial-state class the JS toggles away from — otherwise drop it too, since the CSS block above already owns opacity fully via the same `.opacity-100` selector pairing that already exists for `transform`.

**Why these values:**

- Naming `opacity, transform` explicitly instead of `all`: this is the direct fix — only the two properties that actually change are animated, and both are compositor-only (cheap).
- `220ms` on entrance (`.opacity-100`, i.e. becoming visible as the hero scrolls away): well under the 300ms UI budget for a small, 6px-travel element; the previous 600ms was long for that little distance.
- `cubic-bezier(0.16, 1, 0.3, 1)` on entrance: this is the exact curve already used in this same file for `mobile-nav-reveal` (`Header.astro:285`, a very similar "something slides/fades into the header chrome" entrance) — reusing it keeps the header's motion system consistent instead of adding a third curve.
- `200ms ease` on exit (base state, i.e. brand disappearing as the hero scrolls back into view): shorter than the entrance per "exits should be shorter," and a softer curve since the element is leaving, not something the user needs to track arriving.

## Conventions to follow

- `cubic-bezier(0.16, 1, 0.3, 1)` is already the header's entrance curve at `Header.astro:285` (`mobile-nav-reveal`) — match it exactly rather than picking a different "strong" curve, so the header reads as one motion system.
- This repo has no shared `--ease-*`/`--duration-*` token file yet (checked: no such custom properties exist under `src/`) — inline the values as the rest of this file already does; don't introduce a token layer for two rules.

## Steps

1. In `Header.astro:57`, remove `transition-all duration-600 ease-in-out` from the `class` attribute on `<a id="navbar-brand">`. Decide whether to keep the Tailwind `opacity-0` utility as the initial-state class (recommended: keep it, since the JS toggles `opacity-100`/`opacity-0` classes and Tailwind's own `opacity-0`/`opacity-100` utilities already set the `opacity` value — only the `transition-property` was the problem).
2. In the global `<style>` block, replace the `#navbar-brand` and `#navbar-brand.opacity-100` rules (currently `Header.astro:250-257`) with the two rules shown in Target above.
3. Confirm no other selector in this file also expects `#navbar-brand` to have `transition-all` (searched: none does).

## Out of scope

- Do not touch `SiteTitle.astro` — covered by plans 001, 003, 004.
- Do not touch the mobile nav dropdown or hamburger button rules in this same file.
- Do not change the `IntersectionObserver` logic in the inline script — this plan is CSS-only.
- Do not introduce a shared easing/duration token file for two rules.

## Verification

### Build

- [ ] Type-check and lint pass.
- [ ] Visually confirm Tailwind still generates the expected `opacity-0`/`opacity-100` utility classes (no purge issue from removing the `transition-*` utilities).

### Behavior

- [ ] Scroll past the hero: the brand fades and slides in over ~220ms, noticeably snappier than the previous 600ms.
- [ ] Scroll back up past the hero: the brand fades and slides out over ~200ms.
- [ ] Scroll rapidly back and forth across the hero boundary several times: the transition retargets smoothly each time rather than jumping (this was already true with `transition-all`, since transitions retarget regardless of property list — this check just confirms the rewrite didn't regress it).
- [ ] With `prefers-reduced-motion: reduce` emulated in DevTools, `#navbar-brand`'s existing reduced-motion rule (`Header.astro:312-316`) still zeroes the transform and keeps only the opacity transition — confirm this plan's new `transition` shorthand doesn't get overridden incorrectly (the reduced-motion block only sets `transform: none; transition: opacity 0.3s ease;`, which will replace this plan's two-property shorthand entirely, so opacity keeps transitioning and transform stops — that's correct and requires no change to the reduced-motion block itself).

### Feel

- [ ] Record the scroll-triggered appear/disappear and scrub frame by frame — entrance should feel like it starts fast and settles (steep-start curve), exit should feel like a quieter fade.
- [ ] Look at it again with fresh eyes before calling it done.

## Notes

None — this one is a clean mechanical fix with no feel ambiguity, since the target curve is already proven elsewhere in the same file.
