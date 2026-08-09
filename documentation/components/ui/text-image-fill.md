---
title: TextImageFill
tags: []
created: 2026-07-26T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Renders text whose glyphs are filled with a background image (via `background-clip: text`), with an optional flat colour tint layered over the image and a solid fallback colour for browsers without background-clip support.

## File locations

| Field | Value |
| --- | --- |
| Component | [`src/components/ui/TextImageFill.astro`](../../../src/components/ui/TextImageFill.astro) |
| Data | none |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `as` | `"span" \| "div" \| "p" \| "strong" \| "em" \| "h1" \| "h2" \| "h3" \| "h4" \| "h5" \| "h6"` | `"span"` | HTML tag rendered for the element |
| `imageUrl` | `string` | required | URL of the image used as the text fill |
| `size` | `string` | `undefined` | Font size applied via the `--text-fill-font-size` custom property |
| `position` | `string` | `"center"` | CSS `background-position` for the fill image |
| `backgroundSize` | `string` | `"cover"` | CSS `background-size` for the fill image |
| `backgroundAttachment` | `"scroll" \| "fixed" \| "local"` | `"scroll"` | CSS `background-attachment` for the fill image |
| `classes` | `string` | `""` | Additional classes applied to the tag |
| `class` | `string` | `undefined` | Normal Astro/HTML class value, merged with `classes` |
| `fallbackColor` | `string` | `"currentColor"` | Solid colour shown where background-clip-based text fill is unsupported, and used as the element's `color` |
| `tintColor` | `string` | `undefined` | Optional flat colour layered over the fill image via a double linear-gradient trick |
| `tintOpacity` | `number` (0 to 1) | `0` | Opacity of `tintColor` over the fill image |

## Usage

```astro
---
import TextImageFill from '@components/ui/TextImageFill.astro';
---

<TextImageFill as="h1" imageUrl="/headline.jpg" size="4rem" fallbackColor="var(--color-orange-500)">
  Headline text
</TextImageFill>
```

With a colour tint over the image:

```astro
<TextImageFill
  as="span"
  imageUrl="/headline.jpg"
  size="clamp(50px, 13vw, 250px)"
  fallbackColor="var(--color-orange-500)"
  tintColor="var(--color-red-800)"
  tintOpacity={0.1}
  backgroundSize="100vw auto"
>
  Site Title
</TextImageFill>
```

## Behaviour

All configurable values are passed through as inline CSS custom properties (`--text-fill-image`, `--text-fill-position`, `--text-fill-size`, `--text-fill-attachment`, `--text-fill-fallback`, `--text-fill-tint-opacity`, and optionally `--text-fill-font-size` and `--text-fill-tint-color`) rather than hard-coded styles, so each instance can override them independently. Normal span-compatible attributes are forwarded to the rendered element.

The element's `background-image` stacks two layers: a flat `tintColor` rendered twice as a solid-to-solid `linear-gradient` (using the `rgb(from ...)` colour function to apply `tintOpacity`), on top of the `imageUrl` image. `background-clip: text` (with the `-webkit-` prefix for Safari) clips this combined background to the glyph shapes.

Where `background-clip: text` is supported, the element's text `color` is forced to `transparent` inside an `@supports` block so the underlying background shows through the glyphs; otherwise the `fallbackColor` is used as a plain text colour.

## Extending

Consumers that need to animate the fill colour (for example, a hover state) should target the `.text-image-fill` class and either transition `color` directly or set the `--text-fill-active-color` custom property, which controls the colour used inside the `@supports` block. See [`SiteTitle`](../layout/header/title/site-title.md) for an example that transitions the colour on hover.
