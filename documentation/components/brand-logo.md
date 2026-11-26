# Brand logo

The KOLLITSCH.dev logo comes from one source: `src/brand/kollitsch-brand/`. Read `logo-design-reference.md` there before changing anything about the logo.

| File | Purpose |
| --- | --- |
| `logo.master.svg` | Geometry source of truth, with the named groups `iconmark` (`frame`, `wildcard`) and `wordmark` (`surname`, `domain-extension`) |
| `palette.json` | Light and dark colour roles (`background`, `foreground`, `muted`, `primary`) |
| `mark-bounds.json` | `viewBox` values of the combination mark, wordmark, and iconmark |
| `dist/` | Pre-generated reference assets from `generate.py`; the site does not use them directly |

## Where the marks are used

| Place | Mark | Implementation |
| --- | --- | --- |
| Large header title | Combination mark | `SiteTitle.astro` |
| Sticky navigation brand | Combination mark (decorative) | `Header.astro` |
| `<wordmark/>` in Markdown | Combination mark | `src/utils/markdown-typography.ts` |
| Favicons, manifest, feed icons | Iconmark on an opaque background | `src/assets/favicon/regenerate.ts` |

## Rendering

`src/utils/brand-logo.ts` reads the master SVG at build time and extracts its groups. It never redraws them.

- `renderBrandSvg(mark, { class, decorative })` returns an inline `<svg>` for `combination-mark`, `wordmark`, or `iconmark`. It has `role="img"` and `aria-label="KOLLITSCH.dev"`, or `aria-hidden="true"` when `decorative` is set.
- `renderFaviconSvg(variant)` returns the self-contained favicon: `adaptive` (dark palette, light palette when the system prefers a light scheme), or `light` or `dark` with literal colours for rasterisers.

`src/components/ui/BrandLogo.astro` wraps `renderBrandSvg` for Astro templates:

```astro
---
import BrandLogo from '@components/ui/BrandLogo.astro';
---

<BrandLogo class="h-8 w-auto" />
<BrandLogo mark="iconmark" decorative />
```

Size the logo by one dimension and leave the other at `auto`.

## Colours

The master paints with `var(--logo-foreground)`, `var(--logo-muted)`, and `var(--logo-primary)`. `src/styles/theme.css` sets these per theme from `palette.json` (light in `:root`, dark in `[data-theme="dark"]`). Keep both in step when the palette changes, and validate the contrast as the guide describes (section 7). Outside the site CSS, foreground and muted fall back to the inherited text colour and primary to the light primary.

## Markdown shorthand

Write `<wordmark/>` in a post. The remark plugin `remarkDnbTypography` replaces it with the inline combination mark (class `brand-logo-inline`), sized to 1.5em and shifted so the surname sits on the text baseline:

```markdown
Hello, this is <wordmark/> and welcome.
```

## Favicons and feed icons

`npm run build:favicons` (also run on `postinstall`) runs `src/assets/favicon/regenerate.ts`. It writes:

- `src/assets/favicon/favicon.svg` (tracked, adaptive palette),
- `src/assets/favicon/favicon.png` (512 px, dark, gitignored; source for the Apple touch icon and the manifest icons),
- `public/favicon.ico` (16, 32, 48, and 64 px, gitignored),
- `public/icon-512.png` (gitignored; the `icon` and `logo` of the Atom, RSS, and JSON feeds).

Do not edit these files by hand.

The commit hook does not run the image optimiser on `src/brand/` or on `favicon.svg` (see `.lintstagedrc.ts`): SVGO would round the master geometry and move the favicon colours into an inline style, which stops the light palette from applying.
