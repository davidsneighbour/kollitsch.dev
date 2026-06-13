---
version: alpha
name: kollitsch.dev
description: Digital garden, blog, and web-development reference for Patrick Kollitsch
colors:
  # Primary / brand — the single interactive accent hue
  primary: "oklch(64.6% 0.222 41.116deg)"
  primary-hover: "oklch(55.3% 0.195 38.402deg)"
  # Link pair — deep red shifts toward orange on hover
  link: "oklch(50.5% 0.213 27.518deg)"
  link-hover: "oklch(64.6% 0.222 41.116deg)"
  # Surfaces (light / dark)
  surface: "oklch(98.6% 0.002 67.8deg)"
  surface-dark: "oklch(14.7% 0.004 49.3deg)"
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
---

# kollitsch.dev Design System

## Overview

**Technical editorial** with a restrained personality. The site serves as a developer's digital garden — half personal blog, half living web-development reference — aimed at an audience that appreciates density, precision, and the occasional bit of wit. It is built from Koh Samui, Thailand, and the design echoes that contradiction: deeply technical but unhurried.

The visual language is built around three constraints:

1. A **warm, near-neutral gray palette** as the base — not cool, not clinical.
2. A **single accent pair** (a burnt-orange primary shifting to a darker tone on hover) that signals every interactive element without overwhelming the content.
3. **Variable-weight typography** that can express both the weight of a technical headline and the lightness of body prose without switching families.

The overriding aesthetic is **engineered lightness**: generous line heights, minimal corner radii, no decorative shadows — hierarchy is achieved through tone, scale, and spacing rather than visual ornament.

## Colors

The palette keeps its emotional range narrow on purpose. A wide range of grays covers structure, text, and surface; a single accent hue covers everything interactive.

* **Primary (`oklch(64.6% 0.222 41.116deg)`):** A burnt orange — "Koh Samui Dusk". Used exclusively for primary CTAs, inline links on hover, and the brand asterisk in the site title. One accent, used consistently.
* **Primary Hover (`oklch(55.3% 0.195 38.402deg)`):** A shade darker than primary, shifting toward deep orange-red — enough movement to confirm activation without a color-family jump.
* **Link (`oklch(50.5% 0.213 27.518deg)`):** Deep red for inline prose links. Distinct from the orange primary so links read as navigational, not primary-action.
* **Link Hover (`oklch(64.6% 0.222 41.116deg)`):** Shifts to the primary orange on hover — the brand hue arrives when the user reaches for the link.
* **Surface / Surface Dark:** Warm off-white (`oklch(98.6%)`) in light mode, near-black (`oklch(14.7%)`) in dark mode. The warmth is intentional — pure white and pure black feel too harsh for long-form reading.
* **On-Surface / On-Surface Dark:** `oklch(43.8%)` mid-gray for light mode body text; `oklch(92.2%)` for dark mode. Both pass WCAG AA against their respective surfaces.
* **Border:** A whisper-light `oklch(92.2%)` in light mode and `oklch(36.7%)` in dark mode. Borders define without asserting.
* **Code Highlight:** Red-500 at 10% opacity (`oklch(63.7%)`) as the inline code chip background — visually distinct from prose without introducing a new color family.

The full gray scale (50–950) and an orange scale (50–950) are defined as Tailwind design tokens in `src/styles/theme.css`. Only the semantic roles above should be referenced in components.

## Typography

Three families, three roles. No substitutions.

* **Changa One** (`--font-changa`): Headlines only. A condensed display face with strong weight presence at large sizes. Only the 400 weight is available — let the letterforms do the work. Applied to all h1–h6, the site title, and any large display text.
* **Exo 2 Variable** (`--font-exo2`): Body text, UI copy, captions. Used at `font-light` (300) for reading; 400 for labels and metadata. The variable axis allows subtle weight shifts for emphasis. Responsive sizing: 14px (mobile) → 16px → 20px → 24px (large desktop) using Tailwind's `text-sm/base/xl/2xl` scale.
* **JetBrains Mono Variable** (`--font-jetbrainsmono`): Code, inline code, and technical labels. The variable weight axis provides both regular code blocks and a slightly heavier option for emphasis within code. Expressive Code inherits this family via `--ec-codeFontFml`.

Exo 2 uses OpenType feature settings `"cv02", "cv03", "cv04", "cv11"` for the title weight — these activate alternate glyph forms that reduce ambiguity between similar characters.

Base line height is `1.6` (or `calc(1em + 0.6rem)` for a fluid implementation). Headings carry a tighter `1.2`–`1.3` for display impact.

## Layout

Content-first, single-column primary reading path.

* **Content max-width:** `max-w-5xl` (1024px) for article bodies and primary content regions. Text lines stay within comfortable reading length.
* **CTA max-width:** `max-w-2xl` (672px) for call-to-action blocks, author bios, and narrower focused content.
* **Horizontal page padding:** `px-6` (24px) at all breakpoints. Does not expand with viewport — consistent breathing room.
* **Spacing scale:** Based on a 4px unit (`--spacing: 0.25rem`). Practical intervals: 4 / 8 / 16 / 24 / 32 / 64px. Vertical rhythm is built from these values; do not introduce intermediate steps.
* **Responsive strategy:** Mobile-first. Font sizes, reading widths, and layout density all scale up linearly via Tailwind breakpoint utilities (`sm`, `md`, `lg`, `xl`).

The layout does not use a columnar grid in the classical sense. Most pages are a single primary column with an optional sticky sidebar on large viewports.

## Elevation & Depth

Depth is achieved through **tonal contrast**, not shadows.

In light mode: the page surface is warm off-white (`surface`). Raised elements like cards sit on pure white (`surface-raised`). The color step is small — enough to group content visually without creating harsh boundaries.

In dark mode: shadow-based elevation is replaced entirely with **subtle outlines**. Cards use `dark:outline dark:-outline-offset-1 dark:outline-white/10` — a faint white border at 10% opacity. No box-shadows appear in dark mode.

Hover states for interactive surfaces (cards, list items) use a 5–10% opacity tonal shift (`hover:bg-gray-50/50` in light, `hover:bg-gray-800/70` in dark) rather than shadow changes. Motion is handled by `transition-colors duration-300 ease-in-out`.

## Shapes

The shape language is **minimal and measured**.

* `rounded-sm` (2px): Not used for primary UI elements. Reserved for very small chips or micro-interactions if needed.
* `rounded-md` (6px): Source code link badges, form inputs, small UI chips. Just enough softness for inline elements.
* `rounded-lg` (8px): Cards, content blocks, the primary containment shape. The standard container radius.
* `rounded-xl` (12px): Thumbnail images within cards. Images get a slightly more generous rounding to feel photographic rather than clipped.
* `rounded-full` (9999px): Pills, avatar circles, and status indicators.

Do not mix `rounded-lg` and `rounded-xl` on the same container and its child — use `rounded-lg` on the outer container and `rounded-xl` only inside, where images live.

## Components

### Cards

Cards are the primary content container for blog post previews, link lists, and media items.

* Light: white background, `rounded-lg`, `px-4 py-5` (or `sm:p-6`), subtle `shadow-sm`, `hover:bg-gray-50/50`
* Dark: `bg-gray-800/50` (semi-transparent), no shadow, `outline outline-white/10`, `hover:bg-gray-800/70`
* Images within cards use `rounded-xl overflow-hidden` to contain the photo without interfering with the card's own radius

### Source Code Link Badges

Used to reference source files from blog post frontmatter (see `SourceCodeLink.astro`).

Block mode (standalone): bordered chip with icon + mono filename label, `rounded-md`, `px-3 py-1.5`

Inline mode: underline-on-hover pattern, no border, fits within prose text

### Links (prose)

All inline links in prose content use the `link` color (`text-red-700`) shifting to `link-hover` (`text-orange-700`) on hover. The transition is `duration-300 ease-in-out`. Do not use the primary orange for links — that color is reserved for CTA buttons and the brand mark.

## Do's and Don'ts

* **Do** use `font-changa` only for headings and display text — never for body copy or code.
* **Do** apply the primary color exclusively to interactive primary actions (CTAs, hover states). One per screen is ideal.
* **Don't** add box-shadows in dark mode — use `outline outline-white/10` to define surfaces instead.
* **Do** maintain WCAG AA contrast (4.5:1 for normal text). The `on-surface` / `on-surface-dark` tokens are calibrated for this.
* **Don't** use `rounded-xl` on outer containers — it belongs only to images inside cards.
* **Don't** introduce font weights above 400 for Changa One — no bold weight exists in the loaded font file.
* **Do** use `transition-colors duration-300 ease-in-out` for all color-based hover transitions to maintain consistent motion rhythm.
* **Don't** add decorative gradient backgrounds or overlapping color layers to page sections — depth comes from tonal step-ups, not color mixing.
* **Do** respect `prefers-reduced-motion` — the LetterGlitch canvas animation and all keyframe animations must be gated behind the `no-preference` media query.
