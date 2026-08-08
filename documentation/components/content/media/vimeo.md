---
title: Vimeo
tags: []
created: 2026-08-08T00:00:00+07:00
updated: 2026-08-08T00:00:00+07:00
---

Renders a lightweight, lazy-loading Vimeo embed (`<lite-vimeo>`) that fetches
only oEmbed poster metadata up front and creates the full Vimeo iframe after
the visitor interacts with the player.

## File Locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/media/Vimeo.astro` |
| Tests | `src/components/content/media/Vimeo.test.ts` |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `video` | `string` | required | Numeric Vimeo video id |
| `label` | `string` | required | Accessible play-button and iframe label |
| `hash` | `string` | `undefined` | Optional unlisted-video hash, mapped to Vimeo's `h` query parameter |
| `startAt` | `string` | `undefined` | Optional start offset, used as the iframe `#t=` fragment |
| `classes` | `string` | `undefined` | Extra classes applied to the host element |
| `style` | `string` | `undefined` | Inline style applied to the host element |

## Usage

```astro
---
import Vimeo from '@components/content/media/Vimeo.astro';
---

<Vimeo video="1094958124" label="100 Years of Meisterstück" />
```

For a cover video, use the frontmatter shape documented in
[`Article Images`](../../content/article-images.md).

## Behaviour

`parseVimeoId()` validates that `video` is a numeric Vimeo id. Invalid input
throws at build time instead of rendering a broken embed.

The component fetches `https://vimeo.com/api/oembed.json` to find the poster
thumbnail, warms Vimeo connections on hover or focus, and creates the iframe
only after click. The iframe always sets Vimeo's `dnt=1` player parameter.
