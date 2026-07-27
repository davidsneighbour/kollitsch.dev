---
title: ColorScheme
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a full swatch grid of every design-token colour and shade, for visually auditing the palette in light and dark mode.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/devtools/ColorScheme.astro` |
| Data | none; reads CSS custom properties (`--color-<name>-<step>`) defined in [`theme.css`](../../../src/styles/theme.css) |
| Tests | [`src/components/devtools/ColorScheme.test.ts`](../../../src/components/devtools/ColorScheme.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import ColorScheme from '@components/devtools/ColorScheme.astro';
---

<ColorScheme />
```

## Behaviour

This component has no client-side behaviour. It renders two stacked grids (one on a light background, one on a dark background) so every colour can be checked against both. Each grid has a sticky header row listing the shade steps (`50` through `950`) and one row per colour name (`gray`, `gray2`, `gray3`, `gray4`, `cyan`, `green`, `yellow`, `orange`, `red`, `pink`, `purple`, `brown`), rendering a swatch button per `--color-<name>-<step>` custom property.

## Extending

To audit an additional colour or shade step, add it to the `allColors` or `steps` array; no other changes are needed, since each swatch reads its background directly from the matching `--color-<name>-<step>` CSS custom property.
