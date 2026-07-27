---
title: OpenGraphImage
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Generates, caches, and serves a per-page Open Graph image, or emits the matching `<meta>`/`<img>` output for it, using Satori, Resvg, and Sharp.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/head/OpenGraphImage.astro` |
| Data | none (receives its data via the `openGraph` prop); reads fonts from `node_modules/@fontsource/changa-one` and `node_modules/@fontsource/exo-2` |
| Tests | [`src/components/layout/head/OpenGraphImage.test.ts`](../../../../src/components/layout/head/OpenGraphImage.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `openGraph` | `OpenGraphPayload` | required | Normalised Open Graph data (title, URL, cover image reference) |
| `width` | `number` | `1200` | Output image width in pixels |
| `height` | `number` | `630` (`675` when `return="twitter"`) | Output image height in pixels |
| `alt` | `string` | `openGraph.title` | Alt text used when `return="tag"` or `return="twitter"` |
| `return` | `"og" \| "twitter" \| "path" \| "url" \| "tag"` | `"og"` | What the component emits: full OG meta tags, Twitter image meta tags, a site-relative web path, an absolute URL, or an `<img>` tag |
| `format` | `"png" \| "jpeg" \| "webp"` | `"jpeg"` | Output raster format |

## Usage

```astro
---
import OpenGraphImage from '@components/layout/head/OpenGraphImage.astro';
---

<OpenGraphImage openGraph={openGraph} return="og" />
```

```astro
---
import OpenGraphImage from '@components/layout/head/OpenGraphImage.astro';
---

<OpenGraphImage openGraph={openGraph} return="tag" width={1200} height={630} format="webp" alt="Custom alt text" />
```

## Behaviour

### Rendering pipeline

1. Builds a small HTML tree with `satori-html`, including the resolved cover image as a CSS background.
2. Renders that tree to SVG with `satori`, using the Changa and Exo 2 fonts embedded once at module load.
3. Rasterises the SVG to PNG with `Resvg`.
4. Transcodes/optimises the PNG into the requested `format` with `sharp`.
5. Writes the result to `public/og_image/<hash>.<ext>` (and mirrors it to a persistent `.cache/og_image/` directory) and returns its metadata.

### Caching and de-duplication

The output filename is a SHA-256 hash of the title, publish date, dimensions, format, background image key, author, site title, and a `TEMPLATE_VERSION` constant, so any relevant change produces a new file and unchanged pages reuse the existing one. Concurrent requests for the same content share a single in-flight render promise (`inFlight` map) instead of racing to render duplicates. If a persistent cache copy exists but the build's `public/og_image/` output does not (for example, after a clean build), the cached file is restored instead of being regenerated.

### Background image resolution

The cover image key is resolved from `openGraph.image` (falling back through a site default and a global OG fallback key). Remote URLs (`http(s)://`) are fetched and resized with `sharp`; local files are read from disk and resized. Both paths produce a base64 JPEG data URL sized to the exact output dimensions, keeping Satori's memory usage bounded. If no candidate resolves, the image renders with a solid dark overlay only, and a warning is logged.

### Output modes (`return` prop)

- `"og"` (default): full set of `og:image`, `og:image:type`, `og:image:width`, `og:image:height`, and `og:image:alt` meta tags.
- `"twitter"`: `twitter:image` and `twitter:image:alt` meta tags.
- `"path"`: the site-relative web path (for example `/og_image/abc123.jpg`).
- `"url"`: the absolute URL, resolved against `openGraph.url` or `Astro.url`.
- `"tag"`: a plain `<img>` tag with `width`/`height` set.

## Extending

To change the rendered image layout (typography, colours, spacing), edit the `markup()` function's `satori-html` template. Bump `TEMPLATE_VERSION` after any visual change so the content hash changes and stale cached images are not served. Remember the note in the source: whenever a Tailwind `leading-*` utility is used in Satori markup, an explicit `text-*` size must also be set on the same node, or Satori misrenders line height.
