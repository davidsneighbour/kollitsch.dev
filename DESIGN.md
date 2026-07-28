---
version: alpha
name: KOLLITSCH.dev*
description: Digital garden, blog, and web-development reference for Patrick Kollitsch
colors:
  # Primary / brand - the single interactive accent hue
  primary: "oklch(64.6% 0.222 41.116deg)"
  primary-hover: "oklch(55.3% 0.195 38.402deg)"
  # Link pair - deep red shifts toward orange on hover
  link: "oklch(50.5% 0.213 27.518deg)"
  link-hover: "oklch(64.6% 0.222 41.116deg)"
  # Surfaces (light / dark) - Tailwind's `olive` scale (v4.2+), not `gray`
  surface: "oklch(98.8% 0.003 106.5deg)"
  surface-dark: "oklch(15.3% 0.006 107.1deg)"
  surface-raised: "#ffffff"
  surface-raised-dark: "oklch(26.8% 0.011 36.5deg)"
  # Text
  on-surface: "oklch(43.8% 0.017 39.3deg)"
  on-surface-dark: "oklch(92.2% 0.005 34.3deg)"
  on-surface-muted: "oklch(54.7% 0.021 43.1deg)"
  # Structural
  border: "oklch(92.2% 0.005 34.3deg)"
  border-dark: "oklch(36.7% 0.016 35.7deg)"
  # Semantic
  error: "oklch(57.7% 0.245 27.325deg)"
  code-highlight: "oklch(63.7% 0.237 25.331deg)"
typography:
  h1:
    fontFamily: "Changa One"
    fontSize: 2.25rem
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0em
    fontFeature: normal
  h2:
    fontFamily: "Changa One"
    fontSize: 2.25rem
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: 0em
  h3:
    fontFamily: "Changa One"
    fontSize: 1.875rem
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: 0em
  body-xl:
    fontFamily: "Exo 2 Variable"
    fontSize: 1.5rem
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: 0em
    fontVariation: "'wght' 300"
  body-lg:
    fontFamily: "Exo 2 Variable"
    fontSize: 1.25rem
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: 0em
    fontVariation: "'wght' 300"
  body-md:
    fontFamily: "Exo 2 Variable"
    fontSize: 1rem
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: 0em
    fontVariation: "'wght' 300"
  body-sm:
    fontFamily: "Exo 2 Variable"
    fontSize: 0.875rem
    fontWeight: 300
    lineHeight: 1.6
    letterSpacing: 0em
    fontVariation: "'wght' 300"
  code:
    fontFamily: "JetBrains Mono Variable"
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  code-sm:
    fontFamily: "JetBrains Mono Variable"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0em
  label:
    fontFamily: "Exo 2 Variable"
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0em
  label-sm:
    fontFamily: "Exo 2 Variable"
    fontSize: 0.75rem
    fontWeight: 400
    lineHeight: 1
    letterSpacing: 0em
rounded:
  sm: 2px
  md: 6px
  lg: 8px
  xl: 12px
  full: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 64px
  content-max: 1024px
  cta-max: 672px
  page-px: 24px
  documentation-nav-indent: 12px
  documentation-nav-deep-indent: 16px
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-dark}"
    rounded: "{rounded.md}"
    padding: 12px
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  prose-link:
    textColor: "{colors.link}"
  prose-link-hover:
    textColor: "{colors.link-hover}"
  card:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-dark:
    backgroundColor: "{colors.surface-raised-dark}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-image:
    rounded: "{rounded.xl}"
  caption:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label}"
  inline-code:
    backgroundColor: "{colors.code-highlight}"
    rounded: "{rounded.sm}"
    typography: "{typography.code-sm}"
  input-error:
    textColor: "{colors.error}"
  source-code-badge:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    borderColor: "{colors.border}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
    typography: "{typography.code-sm}"
  source-code-badge-dark:
    textColor: "{colors.on-surface-dark}"
    borderColor: "{colors.border-dark}"
    rounded: "{rounded.md}"
    padding: "6px 12px"
  source-code-badge-hover:
    backgroundColor: "{colors.surface}"
  scrollbar:
    thumbColor: "{colors.primary}"
    thumbHoverColor: "{colors.link}"
  documentation-sidebar-nested-list:
    padding: "{spacing.documentation-nav-indent}"
  documentation-sidebar-deep-nested-list:
    padding: "{spacing.documentation-nav-deep-indent}"
---

# KOLLITSCH.dev* Design System

## Overview

**Technical editorial** with a restrained personality. The site serves as a developer's digital garden - half personal blog, half living web-development reference - aimed at an audience that appreciates density, precision, and the occasional bit of wit. It is built from Koh Samui, Thailand, and the design echoes that contradiction: deeply technical but unhurried.

The visual language is built around three constraints:

1. A **warm, near-neutral gray palette** as the base - not cool, not clinical.
2. A **single accent pair** (a burnt-orange primary shifting to a darker tone on hover) that signals every interactive element without overwhelming the content.
3. **Variable-weight typography** that can express both the weight of a technical headline and the lightness of body prose without switching families.

The overriding aesthetic is **engineered lightness**: generous line heights, minimal corner radii, no decorative shadows - hierarchy is achieved through tone, scale, and spacing rather than visual ornament.

## Colors

The palette keeps its emotional range narrow on purpose. A wide range of grays covers structure, text, and surface; a single accent hue covers everything interactive.

* **Primary (`oklch(64.6% 0.222 41.116deg)`):** A burnt orange - "Koh Samui Dusk". Used exclusively for primary CTAs, inline links on hover, and the brand asterisk in the site title. One accent, used consistently.
* **Primary Hover (`oklch(55.3% 0.195 38.402deg)`):** A shade darker than primary, shifting toward deep orange-red - enough movement to confirm activation without a color-family jump.
* **Link (`oklch(50.5% 0.213 27.518deg)`):** Deep red for inline prose links. Distinct from the orange primary so links read as navigational, not primary-action.
* **Link Hover (`oklch(64.6% 0.222 41.116deg)`):** Shifts to the primary orange on hover - the brand hue arrives when the user reaches for the link.
* **Surface / Surface Dark:** Warm off-white (`oklch(98.8%)`) in light mode, near-black (`oklch(15.3%)`) in dark mode - Tailwind's `olive` scale. The warmth is intentional - pure white and pure black feel too harsh for long-form reading.
* **On-Surface / On-Surface Dark:** `oklch(43.8%)` mid-gray for light mode body text; `oklch(92.2%)` for dark mode. Both pass WCAG AA against their respective surfaces.
* **Border:** A whisper-light `oklch(92.2%)` in light mode and `oklch(36.7%)` in dark mode. Borders define without asserting.
* **Code Highlight:** Red-500 at 10% opacity (`oklch(63.7%)`) as the inline code chip background - visually distinct from prose without introducing a new color family.

The full gray scale (50–950) and an orange scale (50–950) are defined as Tailwind design tokens in `src/styles/theme.css`. Only the semantic roles above should be referenced in components.

### Two neutral families: `gray` (structural) vs. `olive` (surface)

Tailwind v4.2 added `mauve`, `olive`, `mist`, and `taupe` as stock neutral palettes alongside the classic `slate`/`gray`/`zinc`/`neutral`/`stone` lineup. This site's own custom `gray` scale (`src/styles/theme.css`) turns out to be an exact, shade-for-shade match of Tailwind's stock `taupe` - it was hand-built before Tailwind shipped the equivalent, and happens to be identical.

Rather than rename that scale retroactively (a values-only diff with zero visual change), `gray` stays the name for **structural neutrals** - body text, muted text, borders, `--input`. `olive` was added as a second, deliberate neutral family reserved specifically for **`--background`** (page surface, light and dark) and anything that derives its tint from `--background`. The two families sit at nearly the same lightness steps but different hues, so text/border legibility choices don't shift just because the page background got warmer.

**Do not** extend this into a blanket "replace all grays with olive" refactor - only `--background`-derived surfaces should use `olive`. Text, borders, and muted-foreground colors stay on `gray` for legibility.

### Deriving tinted surfaces from `--background`

Any UI chrome that needs to read as "a tint of whatever the page background is" - the sticky header, the nav dropdown popover, breadcrumb pills - should be expressed as a `color-mix()` or black/white opacity overlay of `var(--background)`, never as an independently chosen gray/olive shade. This was the actual bug behind several rounds of "doesn't look themed" fixes this session:

* The sticky header's dark-mode tint was hardcoded to 92% opacity while light mode used 70% - nearly opaque, which hid the backdrop blur entirely. Fixed by sharing one `--header-tint: 70%` custom property between both themes (`src/components/layout/header/Header.astro`).
* The nav dropdown's `--popover` (dark) was a fixed `--color-gray-800`, unrelated in hue to the new olive background. Fixed to `color-mix(in oklch, var(--background) 88%, #ffffff 12%)` - a lightened tint of the actual background, not a separate palette pick.
* Breadcrumb pills, previously `bg-gray-100 dark:bg-gray-900`, became `bg-black/5 dark:bg-white/5` - a relative overlay that reads correctly against any background lightness.

The payoff: if `--background` changes again later, these surfaces update automatically instead of needing another pass of manual fixes.

`red-700` is the `link` token's underlying color and is reused deliberately across components (link text, `Badge.astro`, `Button.astro`, scrollbar thumb, PageFind error text, and `text-red-700` on the header's search/close icons in `Header.astro`) - it is not a leftover debugging class wherever it appears. See the debug-class naming convention in Do's and Don'ts.

For icons that paint via `stroke="currentColor"` (Lucide) or `fill="currentColor"` (Bootstrap Icons in `src/icons/`), use `text-*` to set the color, not `stroke-*`/`fill-*` - the presentation attribute resolves against the CSS `color` property, and a literal `stroke`/`fill` property on an ancestor does not override it.

## Typography

Three families, three roles. No substitutions.

* **Changa One** (`--font-changa`): Headlines only. A condensed display face with strong weight presence at large sizes. Only the 400 weight is available - let the letterforms do the work. Applied to all h1–h6, the site title, and any large display text.
* **Exo 2 Variable** (`--font-exo2`): Body text, UI copy, captions. Used at `font-light` (300) for reading; 400 for labels and metadata. The variable axis allows subtle weight shifts for emphasis. Responsive sizing: 14px (mobile) → 16px → 20px → 24px (large desktop) using Tailwind's `text-sm/base/xl/2xl` scale.
* **JetBrains Mono Variable** (`--font-jetbrainsmono`): Code, inline code, and technical labels. The variable weight axis provides both regular code blocks and a slightly heavier option for emphasis within code. Expressive Code inherits this family via `--ec-codeFontFml`.

Exo 2 uses OpenType feature settings `"cv02", "cv03", "cv04", "cv11"` for the title weight - these activate alternate glyph forms that reduce ambiguity between similar characters.

Base line height is `1.6` (or `calc(1em + 0.6rem)` for a fluid implementation). Headings carry a tighter `1.2`–`1.3` for display impact.

Below the `label` token (0.875rem) sits `label-sm` (0.75rem / `text-xs`), used only for micro-UI chrome that must stay compact - image badges, tooltips, floating form labels, pagination hints. It is not a substitute for `label` in prose or metadata lines.

## Layout

Content-first, single-column primary reading path.

* **Content max-width:** `max-w-5xl` (1024px) for article bodies and primary content regions. Text lines stay within comfortable reading length.
* **CTA max-width:** `max-w-2xl` (672px) for call-to-action blocks, author bios, and narrower focused content.
* **Horizontal page padding:** `px-6` (24px) at all breakpoints. Does not expand with viewport - consistent breathing room.
* **Spacing scale:** Based on a 4px unit (`--spacing: 0.25rem`). Practical intervals: 4 / 8 / 16 / 24 / 32 / 64px. Vertical rhythm is built from these values; do not introduce intermediate steps.
* **Responsive strategy:** Mobile-first. Font sizes, reading widths, and layout density all scale up linearly via Tailwind breakpoint utilities (`sm`, `md`, `lg`, `xl`).

The layout does not use a columnar grid in the classical sense. Most pages are a single primary column with an optional sticky sidebar on large viewports.

## Elevation & Depth

Depth is achieved through **tonal contrast**, not shadows.

In light mode: the page surface is warm off-white (`surface`). Raised elements sit on the semantic `card` surface (`surface-raised`) when stronger separation is needed; quieter link-list cards can use a relative opacity overlay instead.

In dark mode: shadow-based elevation is replaced entirely with **subtle outlines and rings** rather than box-shadows.

**Article/feed cards (`Preview.astro`, `Tag.astro`, `CardLink.astro`) use theme-aware surfaces rather than independent grays.** `Preview.astro` uses the semantic `card` token in light mode (`bg-card text-card-foreground`) and the existing background-relative dark overlay (`dark:bg-black/20 dark:text-gray-200`). `Tag.astro` and `CardLink.astro` still use the older `bg-white/5` (light) / `dark:bg-black/20` (dark) opacity-overlay recipe until they get their own visual pass. `Preview.astro` adds `shadow-sm` in light mode and removes it in dark mode; `Preview.astro`/`Tag.astro` add a `ring-1 ring-gray-900/10 dark:ring-gray-100/10` for definition; `CardLink.astro` instead keeps a light-mode `shadow-sm` and swaps to `dark:outline dark:-outline-offset-1 dark:outline-white/10` in dark mode.

Hover states for interactive surfaces (cards, list items) use a small opacity step-up rather than shadow changes. Motion is handled by `transition-colors duration-300 ease-in-out`.

## Shapes

The shape language is **minimal and measured**.

* `rounded-sm` (2px): Not used for primary UI elements. Reserved for very small chips or micro-interactions if needed.
* `rounded-md` (6px): Source code link badges, form inputs, small UI chips. Just enough softness for inline elements.
* `rounded-lg` (8px): Cards, content blocks, the primary containment shape. The standard container radius.
* `rounded-xl` (12px): Thumbnail images within cards. Images get a slightly more generous rounding to feel photographic rather than clipped.
* `rounded-full` (9999px): Pills, avatar circles, and status indicators.

Do not mix `rounded-lg` and `rounded-xl` on the same container and its child - use `rounded-lg` on the outer container and `rounded-xl` only inside, where images live.

## Components

### Cards

Cards are the primary content container for blog post previews, link lists, and media items.

* Light: `bg-card`, `text-card-foreground`, `rounded-lg`, subtle `shadow-sm`, `hover:bg-white`
* Dark: `bg-black/20` (an opacity overlay of the page background, not a fixed color), `text-gray-200`, no shadow, `ring-gray-100/10`, `hover:bg-black/30`
* `Preview.astro` keeps its image corner radius derived from the outer card radius minus the card padding, so the image tracks the outer container cleanly
* See "Elevation & Depth" above for why dark-mode cards stay on a background-relative overlay rather than a picked gray/olive shade

### Sticky Header & Popover Chrome

The sticky header (`Header.astro`) and mobile nav dropdown are a frosted-glass overlay: `background-color: color-mix(in oklch, var(--background) var(--header-tint), transparent)` plus `backdrop-filter: blur(20px) saturate(1)`. `--header-tint` (`70%`) is a single CSS custom property shared by light and dark - it must never be given different values per theme, or the blur becomes invisible in whichever theme has the higher opacity.

The "Posts" nav dropdown panel uses the `--popover` token, which in dark mode is `color-mix(in oklch, var(--background) 88%, #ffffff 12%)` - a lightened tint of the actual background, not an independent gray.

### Breadcrumbs

A small pill, `bg-black/5 dark:bg-white/5 rounded-sm px-2 py-1` - same relative-overlay logic as cards, sized down for an inline chip.

### Form Fields (Inputs, Textareas)

Text inputs and textareas use the canonical shadcn/ui `Input`/`Textarea` recipes (`src/components/shadcn-ui/input.tsx`, `textarea.tsx`, installed via the `shadcn` CLI, not hand-written): `border-input bg-transparent dark:bg-input/30`, `focus-visible:border-ring focus-visible:ring-ring/50`, `placeholder:text-muted-foreground`. This is applied even to plain native `<input>`/`<textarea>` elements driven by vanilla `<script>` (the tags-filter box, the contact form) - the site has no React islands in production, so the shadcn `.tsx` components exist as the canonical source of the class recipe, and that same literal class string is copied onto native elements rather than hydrating them as React components.

Do not rely on `@tailwindcss/forms`' class-strategy names (for example
`form-input`). This project runs the plugin with `strategy: "base"` (see
`src/styles/theme.css`), which restyles raw `input`/`select`/`textarea`
elements directly and does **not** generate a `.form-input` utility class - a
stray `class="form-input"` does nothing and silently falls back to the
browser/plugin default (an unstyled white box in both themes).

### Source Code Link Badges

Used to reference source files from blog post frontmatter (see `SourceCodeLink.astro`).

Block mode (standalone): bordered chip with icon + mono filename label, `rounded-md`, `px-3 py-1.5`

Inline mode: underline-on-hover pattern, no border, fits within prose text

### Links (prose)

All inline links in prose content use the `link` color (`text-red-700`) shifting to `link-hover` (`text-orange-700`) on hover. The transition is `duration-300 ease-in-out`. Do not use the primary orange for links - that color is reserved for CTA buttons and the brand mark.

## Do's and Don'ts

* **Do** use `font-changa` only for headings and display text - never for body copy or code.
* **Do** apply the primary color exclusively to interactive primary actions (CTAs, hover states). One per screen is ideal.
* **Don't** add box-shadows in dark mode - use `outline outline-white/10` to define surfaces instead.
* **Do** maintain WCAG AA contrast (4.5:1 for normal text). The `on-surface` / `on-surface-dark` tokens are calibrated for this.
* **Don't** use `rounded-xl` on outer containers - it belongs only to images inside cards.
* **Don't** introduce font weights above 400 for Changa One - no bold weight exists in the loaded font file.
* **Do** use `transition-colors duration-300 ease-in-out` for all color-based hover transitions to maintain consistent motion rhythm.
* **Don't** add decorative gradient backgrounds or overlapping color layers to page sections - depth comes from tonal step-ups, not color mixing.
* **Do** respect `prefers-reduced-motion` - the LetterGlitch canvas animation and all keyframe animations must be gated behind the `no-preference` media query.
* **Do** prefix any temporary debugging class with `debug` (for example
  `debug-outline`) if one is ever needed, so it can't be mistaken for an
  intentional style and is easy to grep for before committing.
* **Do** derive tinted/frosted surfaces (header, popovers, breadcrumb pills) from `var(--background)` via `color-mix()` or a black/white opacity overlay - never pick an independent gray/olive shade for a "raised" or "frosted" look. See "Deriving tinted surfaces from `--background`" above.
* **Don't** give the same tinted surface a different opacity per theme (for
  example 70% light / 92% dark) - share one value via a custom property so light
  and dark can't drift apart.
* **Don't** extend the `olive` surface scale into structural neutrals - text, borders, and muted-foreground stay on `gray`. `olive` is reserved for `--background` and things derived from it.
* **Do** use the shadcn primitives in `src/components/shadcn-ui/` (`Input`, `Textarea`, `Button`, `Card`) as the canonical class recipe for form-like elements, even when the actual markup is a native, vanilla-JS-driven element rather than a hydrated React island.
* **Don't** rely on `@tailwindcss/forms`' class-strategy names like `form-input` - this project runs the plugin in `base` strategy, so that class doesn't exist and silently does nothing.
* **Don't** introduce off-brand accent hues (indigo, blue, etc.) left over from a copied template - map every interactive/active/focus state to the orange primary or red link pair.
