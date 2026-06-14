---
title: Favicon
tags: []
created: 2026-06-14T00:00:00+07:00
updated: 2026-06-14T00:00:00+07:00
---

The favicon system converts a single SVG source file into every icon format browsers and native apps expect. Generation happens in two distinct phases: a pre-build script creates static files before Astro runs, then Astro itself processes the same PNG source during build to produce hash-versioned assets for the web manifest and the Apple Touch Icon link tag.

## File locations

| Purpose | Path |
| --- | --- |
| SVG source (master artwork) | [`src/assets/favicon/favicon.svg`](../src/assets/favicon/favicon.svg) |
| Intermediate PNG (generated) | [`src/assets/favicon/favicon.png`](../src/assets/favicon/favicon.png) |
| Generation script | [`src/assets/favicon/regenerate.ts`](../src/assets/favicon/regenerate.ts) |
| Generation tests | [`src/assets/favicon/regenerate.test.ts`](../src/assets/favicon/regenerate.test.ts) |
| Static ICO output | [`public/favicon.ico`](../public/favicon.ico) |
| HTML head injector | [`src/components/layout/head/Favicon.astro`](../src/components/layout/head/Favicon.astro) |
| Web manifest generator | [`src/pages/manifest.json.ts`](../src/pages/manifest.json.ts) |
| Head composer (uses Favicon) | [`src/components/layout/head/Head.astro`](../src/components/layout/head/Head.astro) |

## Pipeline overview

```text
src/assets/favicon/favicon.svg
        │
        ├─[regenerate.ts, runs at npm install]──────────────────────────────┐
        │   sharp (density 300) → PNG 512×512  → src/assets/favicon/        │
        │   sharp (density 300) → ICO 16/32/48/64 → public/favicon.ico      │
        │                                                                    │
        └─[Astro build, via Favicon.astro + manifest.json.ts]               │
            getImage() → PNG 192×192 (manifest icon)                        │
            getImage() → PNG 512×512 (manifest icon + maskable)             │
            getImage() → PNG (apple-touch-icon, currently not resized ①)   │
            getImage() → SVG (passthrough, hash-versioned)                  │
```

① See [Optimization opportunities](#optimization-opportunities).

## Stage 1: Pre-build icon generation

`src/assets/favicon/regenerate.ts` is a standalone Node.js/TypeScript script that runs before Astro sees any files. It is triggered automatically on `npm install` (via `postinstall:favicons`) and can be re-run manually with `npm run build:favicons`.

**What it does:**

1. Reads `favicon.svg` into a buffer.
2. Passes the buffer through `sharp` at 300 DPI density to retain SVG precision.
3. Resizes to 512×512 and writes the result to `src/assets/favicon/favicon.png`. Astro consumes this file during the main build.
4. Generates four PNG buffers (16×16, 32×32, 48×48, 64×64) from the same SVG source.
5. Packs those buffers into a single multi-resolution ICO file via `png-to-ico` and writes it to `public/favicon.ico`.

**Configuration block inside the script:**

```ts
const config: FaviconOptions = {
  icoPath: resolve(__dirname, '../../../public/favicon.ico'),
  icoSizes: [16, 32, 48, 64],
  pngPath: resolve(__dirname, 'favicon.png'),
  pngSize: 512,
  svgPath: resolve(__dirname, 'favicon.svg'),
};
```

All sizes and paths are hardcoded here; there is no shared config with the other stages.

**npm scripts:**

| Script | Command | When it runs |
| --- | --- | --- |
| `npm run build:favicons` | `node src/assets/favicon/regenerate.ts` | Manual trigger |
| `postinstall:favicons` | `node ./src/assets/favicon/regenerate.ts` | After every `npm install` |

**Dependencies:**

* `sharp`: SVG to PNG rasterisation with density control
* `png-to-ico`: packs PNG buffers into a multi-size ICO

## Stage 2: Astro image processing

During the Astro build, two components process `favicon.png` through Astro's `getImage()` pipeline. This pipeline applies hash-versioning and optional transforms, and writes the results to `dist/assets/`.

### `Favicon.astro`

`src/components/layout/head/Favicon.astro` calls `getImage()` twice and emits four `<link>` tags:

```ts
// SVG passthrough (hash-versioned, no transform)
const faviconSvg = await getImage({ format: "svg", src: faviconSvgSrc });

// PNG for apple-touch-icon (see note below about sizing bug)
const appleTouchIcon = await getImage({
  attributes: { height: 180, width: 180 },
  format: "png",
  src: faviconSrc,
});
```

Output HTML:

```html
<link rel="icon" href="/favicon.ico" sizes="32x32" />
<link rel="icon" sizes="any" href="/assets/favicon.<hash>.svg" type="image/svg+xml" />
<link rel="manifest" href="/manifest.json" />
<link rel="apple-touch-icon" href="/assets/favicon.<hash>.png" />
```

The SVG link with `sizes="any"` is preferred by all modern browsers and supports the embedded `prefers-color-scheme` media query in the SVG source. The ICO link serves as a fallback for legacy browsers without SVG favicon support.

### `manifest.json.ts`

`src/pages/manifest.json.ts` is an Astro API route that generates `/manifest.json` at build time. It processes `favicon.png` at each size listed in `faviconPngSizes` and adds an extra maskable variant at the largest size:

```ts
const faviconPngSizes = [192, 512];
// Produces icons: 192×192, 512×512 (maskable), 512×512
```

The maskable icon reuses the 512×512 image. The SVG source has sufficient safe-zone padding for the 409×409 maskable circle, but this has not been formally verified.

Manifest fields are sourced from `src/data/setup.json`:

| Manifest field | Source |
| --- | --- |
| `name` | `setup.title` |
| `description` | `setup.description` |
| `id` | `setup.id` |
| `start_url` | hardcoded `"/"` |
| `display` | hardcoded `"standalone"` |

## Stage 3: Runtime HTML injection

`Head.astro` composes the full `<head>` and includes `<Favicon />` unconditionally on every page. It also emits two `theme-color` meta tags read from `setup.json`:

```astro
<meta name="theme-color" media="(prefers-color-scheme: light)" content={themeLight} />
<meta name="theme-color" media="(prefers-color-scheme: dark)" content={themeDark} />
```

The values `themeColorLight` and `themeColorDark` are read from `setup.json → head`. Neither key is currently set, so the defaults `#ffffff` (light) and `#000000` (dark) apply.

## The SVG source

`favicon.svg` contains a single "K" letterform (135.47×135.47 viewBox) rendered as an SVG `<path>` on a `<rect>` background. It uses an embedded `<style>` block with a `@media (prefers-color-scheme: dark)` rule so the same file serves both colour schemes when referenced as a `<link rel="icon" type="image/svg+xml">`:

| Colour scheme | Background |
| --- | --- |
| Light | `oklch(14.7% 0.004 49.25)` (very dark warm grey) |
| Dark | `oklch(14.1% 0.005 285.823)` (very dark cool grey) |
| Both | `#ff0000` path (red K letterform) |

The dark-mode rule in the SVG applies only when the SVG is rendered as a favicon; it does **not** respond to the site's `data-theme` attribute because browsers render favicons in their own context.

## Optimization opportunities

### High priority

**1. Apple Touch Icon is not resized.**
`Favicon.astro` passes `width` and `height` inside the `attributes` object instead of as top-level `getImage()` options. Astro's `attributes` are HTML element attributes, not image transform parameters, so no resize is applied and the browser downloads the full 512×512 PNG for the 180×180 slot. Fix:

```ts
// Before (no resize applied):
const appleTouchIcon = await getImage({
  attributes: { height: 180, width: 180 },
  format: "png",
  src: faviconSrc,
});

// After (actually resizes to 180×180):
const appleTouchIcon = await getImage({
  format: "png",
  height: 180,
  src: faviconSrc,
  width: 180,
});
```

**2. `favicon.png` is a generated artefact committed to the repository.**
`src/assets/favicon/favicon.png` is produced by `regenerate.ts` and then imported by Astro components. Because it is in `src/` (not `public/`), Astro treats it as a source asset. It should either be excluded from version control (added to `.gitignore`) and guaranteed to exist before the Astro build runs, or the Astro components should import the SVG directly and let `sharp` / Astro handle resizing at build time. The current arrangement risks the committed PNG diverging from the SVG source.

### Medium priority

**3. Sizes are defined in three separate places.**
`icoSizes` and `pngSize` live in `regenerate.ts`, `faviconPngSizes` lives in `manifest.json.ts`, and the apple-touch-icon size (180) is in `Favicon.astro`. A single `src/assets/favicon/config.ts` shared by all three would make a size change a one-line edit.

**4. Manifest is missing common fields.**
`manifest.json.ts` omits `short_name`, `background_color`, `theme_color`, `display_override`, and `orientation`. These are not required but improve the install experience on Android and iOS PWA prompts.

**5. No SVG icon in the manifest.**
The Web App Manifest spec supports SVG icons (`"type": "image/svg+xml"`). Adding the hash-versioned SVG alongside the PNG icons would allow browsers that support SVG favicons to use the smaller file.

### Low priority

**6. `regenerate.ts` is called with `node`, not `npx tsx`.**
`package.json` calls `node src/assets/favicon/regenerate.ts` directly. This relies on Node.js ≥ 22.6 native TypeScript stripping. The project convention (per `CLAUDE.md`) is `npx tsx` for all TypeScript scripts. Aligning would make the script consistent with other scripts and avoid a silent failure on older Node versions.

**7. ICO includes 48×48 and 64×64 sizes.**
Modern guidelines (including the Evil Martians favicon reference linked in `manifest.json.ts`) recommend a 32×32-only ICO. The 48×48 and 64×64 frames add ~18 KB to `favicon.ico` without benefit for current browsers.

**8. Maskable icon needs padding verification.**
The SVG letterform fills the full 135×135 viewBox. Maskable icons require the important content to fit inside a 409×409 circle within a 512×512 canvas (roughly 80% safe zone). The current artwork likely clips at the corners when applied as a maskable icon on Android. A separate `favicon-maskable.svg` with additional padding should be created and used only for the maskable entry.
