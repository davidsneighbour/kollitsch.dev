---
title: Article Images (PostImage)
tags: []
created: 2026-06-14T00:00:00+07:00
updated: 2026-06-14T00:00:00+07:00
---

`PostImage.astro` renders the cover media for a blog post or tag page. It handles images and YouTube videos differently, and adds an interactive caption overlay for images.

## Behaviour

### Images

* The full image is rendered inside a `<figure>` that acts as a CSS container (`@container`).
* A transparent background `<a>` (z-10) covers the entire figure and links to the post when a `link` prop is passed.
* A gradient caption overlay (z-20) sits at the bottom. It is invisible by default and fades in on hover (desktop) or on tap (mobile).
* Caption links are wrapped with `[&_a]:z-30` so they intercept clicks above the background link.
* On narrow images (< 22rem container width) only the caption text is shown. At 22 rem and wider the publishing date appears next to it.
* On touch/no-hover devices a small info icon appears in the bottom-right corner (z-30). Tapping it toggles the `.caption-visible` class on the `<figure>`, revealing the overlay without hover.
* Draft posts show an orange **DRAFT** badge (z-30) in the top-left corner at all times.

### Videos

Videos keep the existing layout: the caption appears below the player in a plain `<figcaption>`, with no overlay treatment. The draft badge still appears if the post is a draft.

## Adding a cover to a post

Set the `cover` field in frontmatter. The `resolveCover()` utility accepts:

```yaml
---
cover:
  image: ./cover.jpg          # relative path from the post directory
  alt: "Description for accessibility"
  title: "Caption shown in the overlay"  # optional, supports HTML
---
```

To use a YouTube video as the cover:

```yaml
---
cover:
  video:
    youtube: dQw4w9WgXcQ   # video ID only, not the full URL
    title: "Caption below the video"
    params:
      rel: 0
      modestbranding: 1
---
```

## Using the component

```astro
---
import PostImage from '@components/content/media/PostImage.astro';
---

<PostImage
  post={post}
  link={`/blog/${post.data.date.getFullYear()}/${post.id}/`}
/>
```

### Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog" \| "tags">` | required | The content entry |
| `link` | `string` | `undefined` | URL the image links to; omit to disable the background link |
| `classes` | `string` | `"w-full max-w-full h-auto"` | Tailwind classes applied to the `<img>` or `<Picture>` |
| `quality` | `"low" \| "medium" \| "high" \| "max" \| number` | `"high"` | Image quality (mapped to 30/60/82/95 or a raw 1-100 number) |
| `widths` | `number[]` | `[320, 640, 768, 1024]` | Srcset breakpoints in pixels |
| `formats` | `Array<"avif" \| "webp" \| "png" \| "jpeg">` | `["avif", "webp", "jpeg"]` | Output formats; ordered by preference |
| `sizes` | `string` | computed | `sizes` attribute for the `<picture>` element |
| `layout` | `"fixed" \| "constrained" \| "full-width"` | `"constrained"` | Astro `<Picture>` layout mode |

## Customising the caption

The `cover.title` field is rendered with `set:html`, so it accepts HTML markup. This lets you include links or emphasis:

```yaml
cover:
  title: 'Photo by <a href="https://unsplash.com/@example">Author</a> on Unsplash'
```

Links in the caption automatically receive `position: relative; z-index: 30` via the `[&_a]:z-30` selector chain on the caption `<span>`, ensuring they intercept clicks above the background image link at z-10.

## Overlay appearance

The caption overlay uses a dark gradient that fades from bottom to top:

```text
from-black/90   -- text area at the very bottom (~90% opacity)
via-black/60    -- mid-gradient
to-black/10     -- near the top of the overlay (~10% opacity)
```

This provides enough contrast for white text on any image. Adjust the opacity stops in the `figcaption` class list in `PostImage.astro` if you need more or less opacity for a specific theme.

## Z-index stacking

| Layer | z-index | Element |
| --- | --- | --- |
| Background link | 10 | `<a>` covering the figure |
| Caption overlay | 20 | `<figcaption>` |
| Caption links, draft badge, info button | 30 | `[&_a]` inside caption, `.draft-badge`, `[data-caption-toggle]` |

## Mobile tap behaviour

JS in the component's `<script>` block attaches a click listener to the `[data-caption-toggle]` button. The listener toggles `.caption-visible` on the parent `<figure data-postimage>`, which triggers the Tailwind variant `group-[.caption-visible]/postimg:opacity-100` on the figcaption.

The script is initialised on `astro:page-load` to handle view-transition navigations.

The toggle button is hidden by default (`hidden`) and switches to `flex` only on `@media (hover: none)` devices, so it is invisible on pointer (mouse/trackpad) devices.

## Rounded corners

Pass a `rounded-*` class inside the `classes` prop:

```astro
<PostImage post={post} classes="w-full max-w-full h-auto rounded-lg" />
```

The component extracts any `rounded-*` classes from `classes` and copies them onto the `<figure>` element so that `overflow-hidden` clips at the same corner radius as the image.
