---
id: instructions-systems-kollitsch-dev-youtube-embed
title: "kollitsch.dev: Embedding YouTube videos in blog posts"
description: How to embed YouTube videos in kollitsch.dev blog posts using the Youtube Astro component via MDX.
---

YouTube videos in blog posts MUST use the `Youtube` Astro component (`src/components/content/media/Youtube.astro`). Raw `<lite-youtube>` custom elements in Markdown are no longer allowed.

## Requirements

* The post file MUST have a `.mdx` extension, not `.md`.
* The import MUST appear after the frontmatter closing `---` and before any prose.
* Both `video` and `label` props are required.

## Adding a YouTube embed to a new post

1. Name the file `index.mdx` (not `index.md`).
2. Add the import immediately after the frontmatter:

```mdx
---
title: My Post
date: 2025-01-01T00:00:00+07:00
---

import Youtube from "@components/content/media/Youtube.astro";

Post content goes here.

<Youtube video="dQw4w9WgXcQ" label="Rick Astley - Never Gonna Give You Up" />
```

## Converting an existing `.md` post

1. Rename the file: `git mv index.md index.mdx`
2. Remove `options.head.components: ["lite-youtube"]` from frontmatter (the component self-registers the custom element via its bundled `<script>`).
3. Add the import after the frontmatter.
4. Replace each `<lite-youtube videoid="...">` with `<Youtube video="..." label="...">`.

## Props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `video` | `string` | yes | Exact 11-character YouTube video id. |
| `label` | `string` | yes | Accessible play-button label. Describe the video content, not just its title. |
| `params` | `object` | no | YouTube iframe player parameters (see `YouTubePlayerParamsInput`). |
| `classes` | `string` | no | Extra CSS classes applied to the embed element. |
| `style` | `string` | no | Inline style string applied to the embed element. |

## Finding the video id

The video id is the 11-character string after `v=` in a YouTube URL:

```text
https://www.youtube.com/watch?v=dQw4w9WgXcQ
                                ^^^^^^^^^^^
```

The component rejects anything that is not exactly 11 characters matching `[A-Za-z0-9_-]` and throws a build error.

## Writing a good label

The `label` value is read aloud by screen readers as the play-button text. Prefer a short, descriptive phrase over the bare video title:

* Good: `"A laundry machine ripping itself apart to Study no. 21 by Conlon Nancarrow"`
* Good: `"The Pentaverate - Official Trailer"`
* Avoid: `"Watch video"`, `"Click to play"`

## What to avoid

* Do not use `<lite-youtube videoid="...">` directly in Markdown or MDX. MD033 no longer whitelists this element.
* Do not add `options.head.components: ["lite-youtube"]` to frontmatter. This mechanism is a legacy workaround; the `Youtube` component handles script registration internally.
* Do not keep a post as `.md` if it contains a `<Youtube>` import — MDX syntax is only processed in `.mdx` files.
