---
title: ColorGrid
tags: []
created: 2026-08-08T00:00:00+07:00
updated: 2026-08-08T00:00:00+07:00
---

`ColorGrid` renders a compact swatch grid for colour values inside MDX posts.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/ColorGrid.astro` |
| Tests | [`src/components/content/ColorGrid.test.ts`](../../../src/components/content/ColorGrid.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `colors` | `string[]` | required | CSS colour values to render as labelled swatches. |

## Usage

```mdx
import ColorGrid from "@components/content/ColorGrid.astro";

<ColorGrid colors={["#ffbe98", "rgb(255, 190, 152)", "hsl(22deg, 100%, 80%)"]} />
```

## Behaviour

The component renders one `<figure>` per colour value. Each figure contains a
visual swatch and a mono label showing the exact source value. It does not load
client-side JavaScript and does not require `options.head.components`.
