---
title: OpenGraphImage
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-09-19T00:00:00+07:00
---

Resolves the pre-generated social/OG image for a page and emits the matching `<meta>`/`<img>` output for it. Performs no image rendering itself — generation happens ahead of time via `npm run build:ogimages` (see [social-image build script](../../development/build-cache.md)).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/head/OpenGraphImage.astro` |
| Path resolver | `src/utils/social-image/paths.ts` (`getBlogSocialImagePath`, `getDefaultSocialImagePath`) |
| Generator (offline) | `src/scripts/build/build-og-images.ts` and `src/utils/social-image/*` |
| Data | none (receives its data via the `openGraph` prop) |
| Tests | [`src/components/layout/head/OpenGraphImage.test.ts`](../../../../src/components/layout/head/OpenGraphImage.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `openGraph` | `OpenGraphPayload` | required | Normalised Open Graph data (title, URL, cover image reference) |
| `alt` | `string` | `openGraph.title` | Alt text used when `return="tag"` or `return="twitter"` |
| `return` | `"og" \| "twitter" \| "path" \| "url" \| "tag"` | `"og"` | What the component emits: full OG meta tags, Twitter image meta tags, a site-relative web path, an absolute URL, or an `<img>` tag |

Every generated social image is a fixed 1200×630 JPEG (`SOCIAL_IMAGE_WIDTH`/`SOCIAL_IMAGE_HEIGHT` in `paths.ts`); there is no per-call width/height/format override, since the component only resolves an already-generated static file.

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

<OpenGraphImage openGraph={openGraph} return="tag" alt="Custom alt text" />
```

## Behaviour

### Path resolution (no runtime rendering)

1. If `openGraph.image.id` is present, computes the expected path via `getBlogSocialImagePath(id)` → `/images/social/blog/<year>/<slug>.jpg`.
2. Checks whether that file exists under `public/`.
3. If it exists, uses it. Otherwise falls back to `/images/social/default.jpg` (`getDefaultSocialImagePath()`), and in `astro dev` logs a warning naming the missing post and pointing at `npm run build:ogimages`.
4. Emits metadata pointing at the resolved path — `og`, `twitter`, `path`, `url`, or `tag` per the `return` prop.

A missing generated image never breaks `astro dev`, preview, or production builds — it only means the page falls back to the site default image until the next `build:ogimages` run.

### Output modes (`return` prop)

- `"og"` (default): full set of `og:image`, `og:image:type`, `og:image:width`, `og:image:height`, and `og:image:alt` meta tags.
- `"twitter"`: `twitter:image` and `twitter:image:alt` meta tags (the same image as `og:image` — there is only one generated file per post).
- `"path"`: the site-relative web path (for example `/images/social/blog/2026/example-post.jpg`).
- `"url"`: the absolute URL, resolved against `openGraph.url` or `Astro.url`.
- `"tag"`: a plain `<img>` tag with `width`/`height` set.

## Generating images

See `npm run build:ogimages` (normal/`--force`/`--check`/`--file=` modes), documented in [build-cache.md](../../development/build-cache.md). In short:

- `npm run build:ogimages` — incremental: generates missing/stale images, prunes orphans, ensures `default.jpg` exists.
- `npm run build:ogimages -- --force` — regenerates everything unconditionally (run this after changing the rendering template).
- `npm run build:ogimages -- --check` — validates only, writes nothing, exits non-zero on problems (wired into `npm run check`).
- Staged blog posts trigger incremental generation automatically via lint-staged, which also stages the resulting image additions/deletions in the same commit.

## Extending the rendered layout

To change the image layout (typography, colours, spacing), edit `markup()` in `src/utils/social-image/template.ts`. Bump `TEMPLATE_VERSION` in that same file after any visual change, so `build-og-images.ts`'s fingerprint check treats every existing image as stale and regenerates it on the next run. Remember: whenever a Tailwind `leading-*` utility is used in the Satori markup, an explicit `text-*` size must also be set on the same node, or Satori misrenders line height.
