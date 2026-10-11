# Embedding YouTube videos in blog posts

Read this when adding or changing a YouTube video in a blog post.

YouTube videos in blog posts MUST use the `Youtube` Astro component (`src/components/content/media/Youtube.astro`). Raw `<lite-youtube>` elements are not allowed (markdownlint MD033 does not allow them), and `options.head.components: ["lite-youtube"]` frontmatter is a removed legacy mechanism; the component registers its custom element itself.

## Requirements

- The post file MUST be `.mdx`, not `.md`. When converting, use `git mv index.md index.mdx`.
- The import MUST come after the frontmatter closing `---` and before any prose.
- Both `video` and `label` props are required.

```mdx
---
title: My Post
date: 2025-01-01T00:00:00+07:00
---

import Youtube from "@components/content/media/Youtube.astro";

Post content goes here.

<Youtube video="dQw4w9WgXcQ" label="Rick Astley - Never Gonna Give You Up" />
```

## Props

| Prop | Type | Required | Description |
| --- | --- | --- | --- |
| `video` | `string` | yes | Exact 11-character YouTube video id (the `v=` value of the URL). The component throws a build error for anything not matching `[A-Za-z0-9_-]{11}`. |
| `label` | `string` | yes | Accessible play-button label read by screen readers. Describe the video content, not only its title. |
| `params` | `object` | no | YouTube iframe player parameters (see `YouTubePlayerParamsInput`). |
| `classes` | `string` | no | Extra CSS classes on the embed element. |
| `style` | `string` | no | Inline style string on the embed element. |

Good labels: `"A laundry machine ripping itself apart to Study no. 21 by Conlon Nancarrow"`, `"The Pentaverate - Official Trailer"`. Avoid `"Watch video"` or `"Click to play"`.
