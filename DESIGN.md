---
version: alpha
name: KOLLITSCH.dev*
description: Digital garden, blog, and web-development reference for Patrick Kollitsch
colors:
  # Primary / brand - the single interactive accent hue (green-based `primary-*` scale)
  primary: "oklch(72.3% 0.219 149.579deg)"
  primary-hover: "oklch(52.7% 0.154 150.069deg)"
  # Link pair - dark green shifts toward brighter green on hover
  link: "oklch(52.7% 0.154 150.069deg)"
  link-hover: "oklch(62.7% 0.194 149.214deg)"
  # Dark-mode link pair - brighter greens for AA contrast on dark surfaces
  link-dark: "oklch(62.7% 0.194 149.214deg)"
  link-dark-hover: "oklch(79.2% 0.209 151.711deg)"
  # Surfaces (light / dark) - Tailwind's `olive` scale (v4.2+), not `gray`
  surface: "oklch(98.8% 0.003 106.5deg)"
  surface-dark: "oklch(15.3% 0.006 107.1deg)"
  surface-raised: "#ffffff"
  surface-raised-dark: "oklch(27.5% 0.011 216.9deg)"
  # Text - `grey-*` scale (sourced from Tailwind's `mist`, a blue-leaning
  # neutral), mapped once for both light and dark mode - not redefined per theme
  on-surface: "oklch(45% 0.017 213.2deg)"
  on-surface-dark: "oklch(92.5% 0.005 214.3deg)"
  on-surface-muted: "oklch(56% 0.021 213.5deg)"
  heading-dark: "oklch(72.3% 0.219 149.579deg)"
  heading-link-underline-dark: "oklch(52.7% 0.154 150.069deg)"
  # Structural
  border: "oklch(92.5% 0.005 214.3deg)"
  border-dark: "oklch(37.8% 0.015 216deg)"
  # Semantic
  error: "oklch(57.7% 0.245 27.325deg)"
  # Semantic state tokens (danger/warning/success/information) - independent
  # of the primary/grey palette, used for feedback UI (alerts, validation)
  danger: "oklch(57.7% 0.245 27.325deg)"
  danger-dark: "oklch(63.7% 0.237 25.331deg)"
  warning: "oklch(66.6% 0.179 58.318deg)"
  warning-dark: "oklch(82.8% 0.189 84.429deg)"
  success: "oklch(62.7% 0.194 149.214deg)"
  success-dark: "oklch(79.2% 0.209 151.711deg)"
  information: "oklch(58.8% 0.158 241.966deg)"
  information-dark: "oklch(74.6% 0.16 232.661deg)"
  code-highlight: "oklch(72.3% 0.219 149.579deg)"
  draft-badge-background: "oklch(44.8% 0.119 151.328deg)"
  tag-badge-green-50: "oklch(98.2% 0.018 155.826deg)"
  tag-badge-green-100: "oklch(96.2% 0.044 156.743deg)"
  tag-badge-green-300: "oklch(87.1% 0.15 154.449deg)"
  tag-badge-green-400: "oklch(79.2% 0.209 151.711deg)"
  tag-badge-green-600: "oklch(62.7% 0.194 149.214deg)"
  tag-badge-green-700: "oklch(52.7% 0.154 150.069deg)"
  tag-badge-green-950: "oklch(26.6% 0.065 152.934deg)"
  pagination-inactive-dark: "oklch(87.2% 0.007 219.6deg)"
  colophon-watermark: "oklch(96.6% 0.005 106.5deg)"
  colophon-watermark-hover: "oklch(93% 0.007 106.5deg)"
  colophon-watermark-dark: "oklch(22.8% 0.013 107.4deg)"
  colophon-watermark-dark-hover: "oklch(28.6% 0.016 107.4deg)"
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
  none: 0px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 64px
  content-max: 1024px
  cta-max: 672px
  page-px: 24px
  header-mobile-height: 56px
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
  prose-link-dark:
    textColor: "{colors.link-dark}"
  prose-link-dark-hover:
    textColor: "{colors.link-dark-hover}"
  pagination-inactive:
    textColor: "{colors.on-surface-muted}"
  pagination-inactive-dark:
    textColor: "{colors.pagination-inactive-dark}"
  prose-heading:
    textColor: "inherit"
  heading-dark:
    textColor: "{colors.heading-dark}"
  heading-link-dark:
    textColor: "{colors.heading-dark}"
  heading-link-dark-hover:
    textColor: "{colors.heading-link-underline-dark}"
  card:
    backgroundColor: "{colors.surface-raised}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-dark:
    backgroundColor: "{colors.surface-raised-dark}"
    rounded: "{rounded.lg}"
    padding: 24px
  card-image:
    rounded: "{rounded.lg}"
    padding: "{spacing.none}"
  caption:
    textColor: "{colors.on-surface-muted}"
    typography: "{typography.label}"
  color-grid:
    backgroundColor: "{colors.surface-raised}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  color-grid-dark:
    backgroundColor: "{colors.surface-raised-dark}"
    textColor: "{colors.on-surface-dark}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  colophon-watermark:
    textColor: "{colors.colophon-watermark}"
    typography: "{typography.h1}"
  colophon-watermark-hover:
    textColor: "{colors.colophon-watermark-hover}"
  colophon-watermark-dark:
    textColor: "{colors.colophon-watermark-dark}"
    typography: "{typography.h1}"
  colophon-watermark-dark-hover:
    textColor: "{colors.colophon-watermark-dark-hover}"
  draft-badge:
    backgroundColor: "{colors.draft-badge-background}"
    textColor: "{colors.surface}"
    rounded: "{rounded.sm}"
    typography: "{typography.label-sm}"
  tag-badge:
    rounded: "{rounded.md}"
    typography: "{typography.label-sm}"
  tag-badge-green:
    backgroundColor: "{colors.tag-badge-green-50}"
    textColor: "{colors.tag-badge-green-700}"
    rounded: "{rounded.md}"
    typography: "{typography.label-sm}"
  tag-badge-green-hover:
    backgroundColor: "{colors.tag-badge-green-100}"
  tag-badge-green-focus:
    textColor: "{colors.tag-badge-green-600}"
  tag-badge-green-dark:
    backgroundColor: "{colors.tag-badge-green-950}"
    textColor: "{colors.tag-badge-green-300}"
    rounded: "{rounded.md}"
    typography: "{typography.label-sm}"
  tag-badge-green-dark-focus:
    textColor: "{colors.tag-badge-green-400}"
  inline-code:
    backgroundColor: "{colors.code-highlight}"
    rounded: "{rounded.sm}"
    typography: "{typography.code-sm}"
  input-error:
    textColor: "{colors.error}"
  state-danger:
    textColor: "{colors.danger}"
  state-danger-dark:
    textColor: "{colors.danger-dark}"
  state-warning:
    textColor: "{colors.warning}"
  state-warning-dark:
    textColor: "{colors.warning-dark}"
  state-success:
    textColor: "{colors.success}"
  state-success-dark:
    textColor: "{colors.success-dark}"
  state-information:
    textColor: "{colors.information}"
  state-information-dark:
    textColor: "{colors.information-dark}"
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
  post-preview-transition:
    duration: "420ms"
    easing: "cubic-bezier(0.19, 1, 0.22, 1)"
    rounded: "{rounded.lg}"
  nav-search-panel-transition:
    duration: "300ms"
    easing: "cubic-bezier(0.19, 1, 0.22, 1)"
  scrollbar:
    thumbColor: "{colors.primary}"
    thumbHoverColor: "{colors.link}"
  documentation-sidebar-nested-list:
    padding: "{spacing.documentation-nav-indent}"
  documentation-sidebar-deep-nested-list:
    padding: "{spacing.documentation-nav-deep-indent}"
  footer-author-avatar:
    rounded: "0 {rounded.full} {rounded.full} 0"
  video-embed-play-button:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-dark}"
    rounded: "{rounded.xl}"
  theme-toggle-corner:
    width: "8rem"
    height: "8rem"
    size: "1.5rem"
    padding: "1.75rem"
    rounded: "{rounded.full}"
  animated-rule:
    thickness: "2px"
    startScale: 0.4
    duration: "600ms"
    easing: "cubic-bezier(0.165, 0.84, 0.44, 1)"
---

# KOLLITSCH.dev* Design System

## Overview

**Technical editorial** with a restrained personality. The site serves as a developer's digital garden - half personal blog, half living web-development reference - aimed at an audience that appreciates density, precision, and the occasional bit of wit. It is built from Koh Samui, Thailand, and the design echoes that contradiction: deeply technical but unhurried.

The visual language is built around three constraints:

1. A **single, blue-leaning neutral grey palette** (`grey-*`, sourced from Tailwind's `mist` scale) as the base for text, borders, and structural chrome - one scale for both light and dark mode, not a separate warm/cool pair.
2. A **single accent pair** (a green primary shifting to a darker or lighter tone on hover, depending on theme) that signals every interactive element without overwhelming the content.
3. **Variable-weight typography** that can express both the weight of a technical headline and the lightness of body prose without switching families.

The overriding aesthetic is **engineered lightness**: generous line heights, minimal corner radii, no decorative shadows - hierarchy is achieved through tone, scale, and spacing rather than visual ornament.

## Colors

The palette keeps its emotional range narrow on purpose. Two token families cover everything: `primary-*` (green, brand/interactive) and `grey-*` (blue-leaning neutral, structure and text). Every component reaches for one of these two semantic families - never a raw Tailwind color name, and never orange or red as an accent.

Local visual decisions stay local. Global design decisions are tokens. Use `primary-*` and `grey-*` directly at the lowest practical component or element level. Create an additional semantic token only when the value represents a genuinely site-wide semantic role, is deliberately shared by multiple independent consumers, or must cross a boundary where Tailwind classes cannot be used. Do not create a global CSS variable merely to avoid writing a Tailwind utility in a component.

* **Primary (`oklch(72.3% 0.219 149.579deg)`, `primary-500`):** A saturated green. Used for primary CTAs (as `primary-800`, a darker/stronger fill against either surface), inline links on hover, and the brand asterisk in the site title. One accent, used consistently.
* **Primary Hover (`oklch(52.7% 0.154 150.069deg)`, `primary-700`):** A darker shade than the light-mode link/primary rest colour, giving a visible but subtle shift on hover without a color-family jump.
* **Link (`oklch(52.7% 0.154 150.069deg)`, `primary-700`):** Darker green for inline prose links, dark enough to read against the light surface without needing a separate hue from the brand primary.
* **Link Hover (`oklch(62.7% 0.194 149.214deg)`, `primary-600`):** Shifts to a brighter green on hover - lighter and more vivid than the rest state.
* **Link Dark (`oklch(62.7% 0.194 149.214deg)`, `primary-600`):** Brighter green for links on dark surfaces. The light-mode link colour is intentionally too dark for `surface-dark`, so dark mode uses this AA-safe pair instead of inheriting the global light-mode colour.
* **Link Dark Hover (`oklch(79.2% 0.209 151.711deg)`, `primary-400`):** Brighter green hover for links on dark surfaces, preserving contrast in dark mode.
* **Surface / Surface Dark:** Warm off-white (`oklch(98.8%)`) in light mode, near-black (`oklch(15.3%)`) in dark mode - Tailwind's `olive` scale. The warmth is intentional - pure white and pure black feel too harsh for long-form reading.
* **On-Surface / On-Surface Dark:** `oklch(45%)` mid-grey for light mode body text; `oklch(92.5%)` for dark mode - both `grey-*` steps sourced from `mist`. Both pass WCAG AA against their respective surfaces.
* **Border:** A whisper-light `oklch(92.5%)` in light mode and `oklch(37.8%)` in dark mode, both `grey-*`/`mist` steps. Borders define without asserting.
* **Code Highlight:** Primary-500 at 10% opacity (`oklch(72.3%)`) as the inline code chip background - visually distinct from prose without introducing a new color family, and the same value in both themes since it's a self-contained tint rather than page-background text.
* **Draft Badge Background (`oklch(44.8% 0.119 151.328deg)`, `primary-800`):** Dark green for editorial status badges. It keeps the badge in the accent family while giving small uppercase text enough contrast; same value in both themes since it's a filled badge, not text on the page surface.
* **Pagination Inactive Dark (`oklch(87.2% 0.007 219.6deg)`):** `grey-300` (`mist-300`) for inactive or disabled pagination labels in dark mode. This is visible navigational state and must remain readable.
* **Colophon Watermark:** Uses surface-adjacent olive tones (`olive-100` / `olive-200` in light mode, `olive-900` / `olive-800` in dark mode). It is a cosmetic background gimmick, hidden from assistive technology and deliberately below accessible contrast. Do not "fix" it to meet contrast thresholds.
* **Danger / Warning / Success / Information:** Independent semantic state tokens for feedback UI (form validation, alerts) - `danger` (red), `warning` (amber), `success` (green), `information` (sky/blue). These are deliberately decoupled from `primary` even though `success` happens to also be green today - see `--danger`/`--warning`/`--success`/`--information` in `src/styles/theme.css`. They exist for validation/alert copy only and are never used as a page accent.

The full `grey` scale (50–950, sourced from `mist`) and the green-based `primary` scale (50–950) are defined as Tailwind design tokens in `src/styles/theme.css`. Components should use those scale utilities directly unless a value has earned a semantic token under the local/global rule above. The raw `red` Tailwind scale exists as a token and remains correct for genuinely semantic, theme-independent uses - `destructive`/error/`danger` states, the named `red` Badge variant, YouTube's own brand red - but is never used as this site's brand accent. The raw `orange` scale is **unused legacy** - it appears only in devtools debug tooling (`ColorScheme.astro`) and retired design prototypes under `src/prototypes/`, never in a live component, and must not be introduced anywhere else.

Legacy `--color-black` and `--color-white` aliases resolve to the olive surface endpoints (`olive-950` and `olive-50`) rather than the structural grey endpoints. This keeps any unavoidable endpoint usage warm and slightly quieter against the page surface.

### Two neutral families: `grey` (structural) vs. `olive` (surface)

Tailwind v4.2 added `mauve`, `olive`, `mist`, and `taupe` as stock neutral palettes alongside the classic `slate`/`gray`/`zinc`/`neutral`/`stone` lineup. This site's `grey`/`gray-*` scale (`src/styles/theme.css`) is a direct alias of Tailwind's stock `mist` - a blue-leaning neutral - mapped once in the shared `@theme inline` block so light and dark mode read from the exact same scale (only the lightness *step* used differs by theme, never the hue). There is no separate light-mode-only neutral scale; the project previously used a warm `taupe`-based scale for light mode with a dark-mode-only override to `mist`, but that split has been removed - `grey` is `mist`, full stop, in both themes.

`olive` is a second, deliberate neutral family reserved specifically for **`--background`** (page surface, light and dark) and anything that derives its tint from `--background`. It sits at nearly the same lightness steps as `grey` but keeps its own warm-neutral hue, so the page surface can read as warm while text/borders stay on the cooler `grey` family.

**Do not** extend this into a blanket "replace all greys with olive" refactor - only `--background`-derived surfaces should use `olive`. Text, borders, and muted-foreground colors stay on `grey` for legibility.

**Do not** reintroduce a per-theme override of `--color-gray-*`/`--color-grey-*` - the mapping to `mist` lives once, in the shared `@theme inline` block, not inside `[data-theme="dark"]`. A future neutral swap only needs to change that one block.

### Deriving tinted surfaces from `--background`

Any UI chrome that needs to read as "a tint of whatever the page background is" - the sticky header, the nav dropdown popover, breadcrumb pills - should be expressed as a `color-mix()` or black/white opacity overlay of `var(--background)`, never as an independently chosen gray/olive shade. This was the actual bug behind several rounds of "doesn't look themed" fixes this session:

* The sticky header's dark-mode tint was hardcoded to 92% opacity while light mode used 70% - nearly opaque, which hid the backdrop blur entirely. Fixed by sharing one `--header-tint: 70%` custom property between both themes (`src/components/layout/header/Header.astro`).
* The nav dropdown's `--popover` (dark) was a fixed `--color-gray-800`, unrelated in hue to the new olive background. Fixed to `color-mix(in oklch, var(--background) 88%, #ffffff 12%)` - a lightened tint of the actual background, not a separate palette pick.
* Breadcrumb pills, previously `bg-gray-100 dark:bg-gray-900`, became `bg-black/5 dark:bg-white/5` - a relative overlay that reads correctly against any background lightness.

The payoff: if `--background` changes again later, these surfaces update automatically instead of needing another pass of manual fixes.

`primary-700` is the light-mode `link` token's underlying color and is reused deliberately across components (link text, `Badge.astro`, `Button.astro`, scrollbar thumb, and `text-primary-700` on the header's search/close icons in `Header.astro`) - it is not a leftover debugging class wherever it appears. In dark mode, equivalent interactive text uses `primary-600` with `primary-400` hover so links retain AA contrast on `surface-dark` and dark overlay cards. See the debug-class naming convention in Do's and Don'ts.

Tag chips use the same link text pairs (`primary-700`/`primary-600` in light mode,
`primary-600`/`primary-400` in dark mode) over low-opacity backgrounds. The
background is decorative only; the readable text colour is the token contract.
Named colour variants (`Badge.astro`'s `red`/`green`/`gray`, `destructive`)
keep their own literal hue in both themes - only the generic, unnamed variants
moved to `primary`.

Colour grids use the existing card surface pair (`surface-raised` /
`surface-raised-dark`) and `rounded-lg`, with mono labels in body text colours.
The swatch itself is user-provided content colour; the surrounding component
must stay neutral so the colour value remains inspectable.

Pagination controls use muted gray in light mode and `gray-300` in dark mode
for inactive or disabled labels; hover states shift to the link hover primary
shade for that theme. Disabled pagination text still needs normal text
contrast because it is visible navigational state, not purely decorative chrome.

For icons that paint via `stroke="currentColor"` (Lucide) or `fill="currentColor"` (Bootstrap Icons in `src/icons/`), use `text-*` to set the color, not `stroke-*`/`fill-*` - the presentation attribute resolves against the CSS `color` property, and a literal `stroke`/`fill` property on an ancestor does not override it.

Video embed play buttons use the shared interactive accent rather than each
platform's brand colour. This keeps lazy YouTube and Vimeo facades visually
part of the site while the video poster still carries the platform content.

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
* `rounded-xl` (12px): Available for large standalone media where the image is not clipped by an outer card or article surface.
* `rounded-full` (9999px): Pills, avatar circles, and status indicators.

Do not mix `rounded-lg` and `rounded-xl` on the same container and its child. Article and article-card cover images are clipped by their outer `rounded-lg`/card surface and use the matching top radius instead of an inset inner radius.

## Components

### Cards

Cards are the primary content container for blog post previews, link lists, and media items.

* Light: `bg-card`, `text-card-foreground`, `rounded-lg`, subtle `shadow-sm`, `hover:bg-white`
* Dark: `bg-black/20` (an opacity overlay of the page background, not a fixed color), `text-gray-200`, no shadow, `ring-gray-100/10`, `hover:bg-black/30`
* `Preview.astro` and `Tag.astro` render cover media edge-to-edge inside the card surface; text and button regions carry their own padding
* Full post covers in `Post.astro` break out to the article surface edge while the article body keeps its normal internal padding
* Blog previews and their destination posts share the `post-preview-transition` motion token only inside `prefers-reduced-motion: no-preference`: a 420ms strong ease-out shared-element morph with the standard `rounded-lg` card radius and clipped overflow. Cover media uses a separate `post-preview-media` transition class with `object-fit: cover` so image snapshots crop rather than stretch while the card shell changes size.
* See "Elevation & Depth" above for why dark-mode cards stay on a background-relative overlay rather than a picked gray/olive shade

### Sticky Header & Popover Chrome

The sticky header (`Header.astro`) and mobile nav dropdown are a frosted-glass overlay: `background-color: color-mix(in oklch, var(--background) var(--header-tint), transparent)` plus `backdrop-filter: blur(20px) saturate(1)`. `--header-tint` (`70%`) is a single CSS custom property shared by light and dark - it must never be given different values per theme, or the blur becomes invisible in whichever theme has the higher opacity.

On mobile, the nav dropdown is fixed to the viewport below the sticky header at `{spacing.header-mobile-height}` rather than absolutely positioned inside the centre navigation slot. The centre slot may shrink to zero width when the brand and action buttons fill the row, so it must not be the containing block for the mobile panel.

The reading-progress bar is drawn inside the sticky header's bottom edge as an absolutely positioned overlay. It must not add height, padding, or margin to the navigation layout. The overlay is pointer-transparent (`pointer-events: none`) so hover, mouseover, and click hit-testing continue to reach the header/navigation area underneath it.

The fixed theme toggle keeps an 8rem top-right corner shell for the hover and focus halo. The `.theme-toggle` button deliberately fills that shell, while `clip-path` keeps the resting visible and clickable area to a small 1.4rem radial field around the 1.5rem icon, inset 1.75rem from the viewport corner. On hover or focus, the same radial field expands to 4.5rem and may widen into the header. This is intentional: the toggle is only visible at the top of the page while the animated title is already visible, and the radial fade is a wanted part of the header interaction rather than an accessibility defect.

The "Posts" nav dropdown panel uses the `--popover` token, which in dark mode is `color-mix(in oklch, var(--background) 88%, #ffffff 12%)` - a lightened tint of the actual background, not an independent gray.

The header search panel (`NavSearch.astro`) opens and closes on the `nav-search-panel-transition` token: `300ms`, `cubic-bezier(0.19, 1, 0.22, 1)` on `opacity`/`scale`. This is the same strong ease-out curve as `post-preview-transition`, just at a shorter duration suited to the panel's smaller size. The site no longer uses any overshoot/bounce easing anywhere.

### Wordmark Typography

Inline wordmarks are typographic text, not artwork crops. They render with the semantic wordmark font, `var(--font-wordmark, var(--font-title))`, stay inline with surrounding prose, and inherit the surrounding text colour through normal `currentColor` behaviour.

The large header title remains the only wordmark-scale surface that uses the image-fill artwork contract from `src/data/brand-artwork.ts`. The configured source image is `src/assets/images/headline/<date>.jpg` (currently `20260913.jpg`; the file swaps periodically), optimised through Astro's asset pipeline and rendered as glyph fill with `background-clip: text`. The shared header sizing is `100vw auto` with centred positioning.

`wordmarkArtwork.headerFill`'s tint is not a fixed palette value: `src/utils/hero-tint.ts` samples the configured header image's own darkest/lightest luminance regions (5th/95th percentile, not the average - a photo can be mostly near-black with only small lighter patches) at build/dev-server start-up via `sharp`, then solves the minimum tint opacity, per theme, that clears a 5.5:1 WCAG contrast ratio (4.5 plus headroom for the softening `background-clip: text` and webp re-encoding add) against that theme's `--background`. This keeps the wordmark readable in both themes without a manual tint value to update every time the header image changes. The light-theme tint uses `--color-primary-800` (dark, against the light page); the dark-theme tint uses `--color-primary-200` (light, against the dark page) - see `src/components/ui/TextImageFill.astro`'s `tintColorDark`/`tintOpacityDark` props for how the two are threaded to the element and switched under `[data-theme="dark"]`.

Inline wordmarks must not set `background-image`, `background-clip: text`, tint layers, shadows, or fallback brand colours. Their job is to provide the proper wordmark font while preserving inherited size, weight, line height, decoration, opacity, and colour.

### Breadcrumbs

A small pill, `bg-black/5 dark:bg-white/5 rounded-sm px-2 py-1` - same relative-overlay logic as cards, sized down for an inline chip.

On blog post breadcrumbs, the year segment and the post (last) segment each expand into a year/post switcher (`BreadcrumbSwitcher.astro`) when siblings exist. It deliberately avoids the conventional dropdown/popover look: no card border, no box shadow, no gap between trigger and panel, no arrow. The sibling list reuses the same breadcrumb-pill surface (`bg-black/5 dark:bg-white/5 rounded-sm`) rather than the heavier `bg-header-glass`/`--popover` treatment used by the nav dropdown, since this is a small inline extension of the breadcrumb rather than a standalone popover. The active item never moves: it stays exactly where the ordinary breadcrumb link already is, and the two sibling lists are positioned directly above (`bottom-full`) and below (`top-full`) it, so there is no active-item duplication or position measurement to get wrong. Entrance is a short opacity/translateY settle on `duration-200 ease-out`, reduced to `transition-duration: 0.01ms` with the translate dropped entirely under `prefers-reduced-motion: reduce` (the same convention as the header/search/theme-toggle transitions, not the `motion-reduce:` Tailwind variant).

### Form Fields (Inputs, Textareas)

Text inputs and textareas use the canonical shadcn/ui `Input`/`Textarea` recipes (`src/components/forms/input.tsx`, `textarea.tsx`, installed via the `shadcn` CLI, not hand-written): `border-input bg-transparent dark:bg-input/30`, `focus-visible:border-ring focus-visible:ring-ring/50`, `placeholder:text-muted-foreground`. This is applied even to plain native `<input>`/`<textarea>` elements driven by vanilla `<script>` (the tags-filter box, the contact form), so these shadcn `.tsx` components exist as the canonical source of the class recipe, and that same literal class string is copied onto native elements rather than hydrating them as React components.

Do not rely on `@tailwindcss/forms`' class-strategy names (for example
`form-input`). This project runs the plugin with `strategy: "base"` (see
`src/styles/theme.css`), which restyles raw `input`/`select`/`textarea`
elements directly and does **not** generate a `.form-input` utility class - a
stray `class="form-input"` does nothing and silently falls back to the
browser/plugin default (an unstyled white box in both themes).

### Gimmick Effects

`TvHead.astro` may use the generated Canvas UI `Glitch` React island (`src/components/gimmicks/glitch.tsx`) for background-image treatment. The plain background image must remain the base layer at `z-index: 0`; the Glitch island is an enhancement with `mix-blend-mode: multiply` at `z-index: 1` that uses a duplicate hidden image source, so a blank or white canvas cannot replace the background image. The Glitch island must not wrap the YouTube player or foreground overlay image. Additional CSS overlays such as `tv-head-effect-static` and tint classes stay in the separate background-effect layer above the Glitch output.

### Source Code Link Badges

Used to reference source files from blog post frontmatter (see `SourceCodeLink.astro`).

Block mode (standalone): bordered chip with icon + mono filename label, `rounded-md`, `px-3 py-1.5`

Inline mode: underline-on-hover pattern, no border, fits within prose text

### Links (prose)

All links site-wide (not just prose) use the `link` color (`text-primary-700`) shifting to `link-hover` (`text-primary-600`) on hover, `link-dark`/`link-dark-hover` in dark mode; the transition is `150ms cubic-bezier(0.25, 0.46, 0.45, 0.94)`. Do not use the CTA/brand primary shade (`primary-800`) for ordinary inline links - that shade is reserved for filled CTA buttons and the brand mark.

Hover also lifts the underline away from the text: `text-underline-offset` animates `2px → 4px` on the same transition, alongside the color shift. This is the site's one deliberate link-hover motion - restrained, and paired with color so hover is legible even for readers who don't perceive the color change.

**The Unlayered Hover Rule.** The base `a`/`a:hover` color rules live in `src/styles/theme.css`'s default `@apply hover:*`/`dark:*`/`dark:hover:*` chains do not compile when `@apply`-ed onto a bare tag selector (confirmed on Tailwind 4.3.3 - they are silently dropped, no build error) - write the variant as literal CSS instead. Separately, the hover *color* rule must live in `@layer utilities`, not `@layer base`: `.typography-reading`'s inlined `prose` styles (`@layer components`) set a fixed, non-hover `color` on every link inside article body text, and `@layer components` always outranks `@layer base` regardless of selector specificity. Only `@layer utilities` reliably wins.

In dark mode, headings across the site use `heading-dark` (`text-primary-500`) so article pages, post cards, taxonomy pages, and non-blog content pages keep one consistent heading colour. Linked headings keep that same green text at rest, but add a straight underline using `heading-link-underline-dark` (`text-primary-700`), `0.056em` thickness, `0.14em` underline offset, and `text-decoration-skip-ink: auto`; on hover, the heading text and underline both brighten to `primary-300` and the offset increases to `0.18em`. This makes "heading" and "link" visible without relying on colour alone. Light mode has no equivalent heading tint - headings there inherit the ordinary `on-surface` text colour.

In light mode, prose headings inherit the surrounding reading colour instead of forcing an independent accent, white, or black. The Changa display face already carries enough hierarchy; colour should come from the parent context unless a component has a specific semantic reason to override it.

### Animated Rule (heading underlines & `<hr>`)

Every heading (`h1`–`h6`, site-wide, not just prose) and every prose `<hr>` draws a hairline rule using the `animated-rule` token: `{components.animated-rule.thickness}` thick, `gray-300` in light mode / `gray-700` in dark mode - the same neutral already used for `<hr>` before this system existed, kept deliberately quiet rather than tinted with `primary`. This replaces the old hand-placed `border-b` dividers on the footer's About/Navigation/Connect headings and `BlogHeading.astro`'s title section - do not re-add a manual border next to a heading or `<hr>`, the animated rule already provides it.

The rule ships pre-drawn at `{components.animated-rule.startScale}` (40%) of its final length so the page never looks unfinished before JavaScript runs or before the element is in view. The first time it scrolls into the viewport (`IntersectionObserver`, `src/layouts/Site.astro`), it grows to full length over `{components.animated-rule.duration}` `{components.animated-rule.easing}` - the same curve as `--ease-out-quart` - and does not repeat.

The growth direction always reads as "from the text, outward": a left-aligned heading grows left-to-right, a right-aligned heading grows right-to-left, and a centered heading (or an `<hr>`, which has no text to anchor to) grows from the middle toward both edges at once. Alignment is read from the heading's *computed* `text-align` at runtime, not from a class on the heading itself, so a heading that only inherits centering from an ancestor (for example `BlogHeading.astro`'s centered `<section>`) still resolves correctly.

Respects `prefers-reduced-motion`: the rule renders fully extended immediately, with no transition and no observer attached.

### Footer Author Avatar

The footer author avatar keeps the full circular radius on its right edge and squared corners on its left edge: `0 {rounded.full} {rounded.full} 0`. It retains the standard structural border colours in light and dark mode.

### Footer Colophon Watermark

The oversized footer colophon in `src/components/layout/footer/Colophon.astro`
is decorative display texture, not content. It must stay `aria-hidden="true"`
and carry `data-dnb-design-exception="decorative-low-contrast"`. It must stay
visually low contrast: `text-olive-100 hover:text-olive-200` in light mode,
`dark:text-olive-900 dark:hover:text-olive-800` in dark mode. This is an
intentional exception to the site's general text contrast rule, so assistants
must not replace it with accessible text colours. The outer wrapper uses a
height derived from `--colophon-title-size` and clips overflow, while the word
itself is absolutely anchored slightly below the frame's bottom edge. This keeps
the watermark visibly cut off instead of sitting fully inside the document flow.

## Do's and Don'ts

* **Do** use `font-changa` only for headings and display text - never for body copy or code.
* **Do** apply the primary color exclusively to interactive primary actions (CTAs, hover states). One per screen is ideal.
* **Don't** add box-shadows in dark mode - use `outline outline-white/10` to define surfaces instead.
* **Do** maintain WCAG AA contrast (4.5:1 for normal text). The `on-surface` / `on-surface-dark` tokens are calibrated for this.
* **Don't** apply the contrast rule to elements marked `data-dnb-design-exception="decorative-low-contrast"` - they are hidden from assistive technology and intentionally fail contrast as decorative background texture.
* **Don't** use `rounded-xl` on outer containers - it belongs only to images inside cards.
* **Don't** introduce font weights above 400 for Changa One - no bold weight exists in the loaded font file.
* **Do** use `transition-colors duration-300 ease-in-out` for all color-based hover transitions to maintain consistent motion rhythm.
* **Don't** add decorative gradient backgrounds or overlapping color layers to page sections - depth comes from tonal step-ups, not color mixing.
* **Do** respect `prefers-reduced-motion` - the LetterGlitch canvas animation, view transitions, all keyframe animations, and the Lenis smooth-scroll instance (`src/layouts/Site.astro`) must be gated behind the `no-preference` media query. Under `reduce`, Lenis is not constructed at all and the page falls back to the native `scroll-smooth` class already on `<html>`.
* **Do** prefix any temporary debugging class with `debug` (for example
  `debug-outline`) if one is ever needed, so it can't be mistaken for an
  intentional style and is easy to grep for before committing.
* **Do** derive tinted/frosted surfaces (header, popovers, breadcrumb pills) from `var(--background)` via `color-mix()` or a black/white opacity overlay - never pick an independent gray/olive shade for a "raised" or "frosted" look. See "Deriving tinted surfaces from `--background`" above.
* **Don't** give the same tinted surface a different opacity per theme (for
  example 70% light / 92% dark) - share one value via a custom property so light
  and dark can't drift apart.
* **Don't** extend the `olive` surface scale into structural neutrals - text, borders, and muted-foreground stay on `gray`. `olive` is reserved for `--background` and things derived from it.
* **Do** use the shadcn primitives (`Input`/`Textarea` in `src/components/forms/`, `Button`/`Card` in `src/components/shared/elements/`) as the canonical class recipe for form-like elements, even when the actual markup is a native, vanilla-JS-driven element rather than a hydrated React island.
* **Don't** rely on `@tailwindcss/forms`' class-strategy names like `form-input` - this project runs the plugin in `base` strategy, so that class doesn't exist and silently does nothing.
* **Don't** introduce off-brand accent hues (indigo, blue, etc.) left over from a copied template - map every interactive/active/focus state to the primary CTA shade or the green link pair.
* **Don't** use `orange` for anything - it is unused legacy, present only in devtools tooling and retired prototypes. **Don't** use `red` as an accent or brand colour either - it is reserved for `destructive`/`danger`/error states only.
* **Don't** reintroduce a per-theme override of the `grey`/`gray-*` scale - it maps to `mist` once, in the shared `@theme inline` block in `src/styles/theme.css`, and must stay identical in light and dark mode.
