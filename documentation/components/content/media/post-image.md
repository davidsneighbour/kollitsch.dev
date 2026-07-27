---
title: PostImage
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a post's or tag's cover, resolving it to either a responsive `<Picture>`, a plain `<img>` fallback, or a [`Youtube`](youtube.md) embed, with optional draft badge, caption overlay, and background link.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/media/PostImage.astro` |
| Data | none; resolves the cover via `resolveCover()` in [`src/utils/cover.ts`](../../../../src/utils/cover.ts) |
| Tests | [`src/components/content/media/PostImage.test.ts`](../../../../src/components/content/media/PostImage.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog" \| "tags">` | required | The entry whose `data.cover` should be rendered |
| `link` | `string` | `undefined` | When set, wraps the image in a full-bleed background link (image type only) |
| `classes` | `string` | `"w-full max-w-full h-auto"` | Classes applied to the rendered image; any `rounded*` classes are also copied onto the `<figure>` so `overflow-hidden` clips at the same corner radius |
| `quality` | `"low" \| "medium" \| "high" \| "max" \| number` | `"high"` | Mapped to a Sharp quality value (30/60/82/95), or used directly as a 1-100 number |
| `widths` | `number[]` | `[320, 640, 768, 1024]` | Candidate widths for the responsive `<Picture>`, capped at the source image's actual width |
| `formats` | `Array<"avif" \| "webp" \| "png" \| "jpeg">` | `["avif", "webp", "jpeg"]` | Formats generated for the `<Picture>` |
| `sizes` | `string` | computed via `getTailwindSizes({ base: 3, maxContentWidth: 1280, md: 2, sm: 1 })` | `sizes` attribute for the `<Picture>` |
| `layout` | `"fixed" \| "constrained" \| "full-width"` | `"constrained"` | Layout mode forwarded to `<Picture>` |

## Usage

```astro
---
import PostImage from '@components/content/media/PostImage.astro';
---

<PostImage post={post} link={`/blog/${post.id}/`} />
```

```astro
---
import PostImage from '@components/content/media/PostImage.astro';
---

<PostImage
  post={post}
  link={`/blog/${post.id}/`}
  classes="max-w-full aspect-2/1 object-cover rounded-t-4xl"
  widths={[640, 896, 1024, 1280, 1536, 1792, 2048]}
  sizes="(min-width: 1536px) 1024px, (min-width: 1024px) 896px, 100vw"
/>
```

## Behaviour

`resolveCover()` returns one of three cover types, each rendered differently:

- **`video`** — renders a [`Youtube`](youtube.md) embed at a `2:1` aspect ratio, with the video's own caption below it (not overlaid, since captions don't apply to media players). A `DRAFT` badge still shows for unpublished blog posts.
- **`image`** — renders a responsive `<Picture>` when image metadata is available (locally-imported images), or a plain `<img loading="eager">` fallback otherwise (for example, remote cover URLs). `widths` are capped to the source image's actual width so upscaled variants are never generated. An optional `link` renders as an absolutely positioned background `<a>` (not wrapping the image) so the image itself stays a plain `<img>`/`<Picture>`. A `DRAFT` badge shows for unpublished blog posts. When `cover.title` is set, a caption overlay fades in on hover (desktop) via `group-hover/postimg:opacity-100`, or toggles via a mobile-only info button (`@media (hover: none)`) that adds a `.caption-visible` class.
- **no cover** (`cover.type` is neither) — renders nothing.

An inline `<script>` wires up the mobile caption-toggle button: on `astro:page-load`, it finds every un-initialised `[data-postimage]` figure, guards against re-initialising it via a `data-caption-init` marker, and toggles `.caption-visible` plus `aria-expanded` on click.

`src/components/README.md` flags this component as embedding YouTube fallbacks and cover-image lookups, and asks that all edge cases be re-verified after any future move.
