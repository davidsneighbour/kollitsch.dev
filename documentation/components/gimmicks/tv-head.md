---
title: TvHead
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-08-10T21:43:00+07:00
---

Composites a [`Youtube`](../content/media/youtube.md) embed into the "screen" region of an overlay image (for example, a photo of a television), with optional background image, crop, zoom, and blend-mode effects layered around it.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/gimmicks/TvHead.astro` |
| Data | resolves images from `src/assets/images/interface/**` via `import.meta.glob` |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | `"tvhead-<videoId>"` | Root element id |
| `x`, `y`, `width`, `height` | `number` | required | Pixel rectangle of the "screen" area within the overlay image, in the overlay image's native pixel coordinates |
| `videoId` | `string` | required | YouTube video id, forwarded to [`Youtube`](../content/media/youtube.md) |
| `imageSrc` | `string` | required | Overlay (foreground) image path, resolved under `src/assets/images/interface/` |
| `backgroundSrc` | `string` | `undefined` | Optional background image path, same resolution rules as `imageSrc` |
| `backgroundClass` / `backgroundEffectClass` / `foregroundEffectClass` | `string` | `""` | Extra classes for the background image, background effect overlay, and optional foreground effect overlay |
| `backgroundGlitch` | `boolean` | `true` | Enables the Canvas UI [`Glitch`](./glitch.md) island around the background image when `backgroundSrc` is present |
| `backgroundGlitchOptions` | `GlitchOptions` | `{}` | Optional Canvas UI Glitch tuning values, forwarded to [`Glitch`](./glitch.md) |
| `cropTop` / `cropRight` / `cropBottom` / `cropLeft` | `number` | `0` | Pixels to expand the video's crop box beyond the screen rectangle on each side |
| `borderRadius` | `string` | `"0px"` | Border radius applied to the screen area |
| `title` | `string` | `"Play video"` | Forwarded to `Youtube`'s `label` |
| `params` | `YouTubePlayerParamsInput \| string` | `"controls=0&modestbranding=1&rel=0&playsinline=1"` | YouTube player parameters; accepts either an object or a query-string |
| `class` | `string` | `""` | Extra classes on the root element |
| `scaleMode` | `"contain" \| "cover"` | `"contain"` | How the video fills its crop box |
| `videoAspectRatio` | `number` | `16 / 9` | Used to compute the cover-mode scale factor |
| `backgroundZoom` / `foregroundZoom` | `number` | `1` | CSS `scale()` applied to the background/foreground layers |
| `backgroundZoomOrigin` / `foregroundZoomOrigin` | `string` | `"center center"` | `transform-origin` for the zoom |
| `imageSizes` / `backgroundSizes` | `string` | `"100vw"` | `sizes` attribute forwarded to each `<Image>` |

## Usage

```astro
---
import TvHead from '@components/gimmicks/TvHead.astro';
---

<TvHead
  x={120}
  y={80}
  width={400}
  height={260}
  videoId="dQw4w9WgXcQ"
  imageSrc="tv-001.png"
/>
```

## Behaviour

At build/SSR time, `resolveInterfaceImage()` looks up `imageSrc`/`backgroundSrc` in a glob of `src/assets/images/interface/**/*.{png,jpg,jpeg,webp,avif,gif}`, accepting several equivalent path forms (bare filename, `folder/file.png`, `assets/images/interface/...`, `src/assets/images/interface/...`) and throwing a descriptive error if the image can't be resolved.

The `x`/`y`/`width`/`height` screen rectangle (in the overlay image's native pixel space) is converted to percentages so the video's position and size scale with the image responsively. The crop box (screen rectangle expanded by `cropTop`/`cropRight`/`cropBottom`/`cropLeft`) determines how much of the video is visible inside the screen area versus clipped, and `scaleMode` (`contain` vs `cover`, using `videoAspectRatio`) determines whether the video is letterboxed or filled/cropped within that box.

The final markup layers, back to front: an optional plain background `<Image>` (`z-index: 0`), the Canvas UI [`Glitch`](./glitch.md) island as an enhancement with `mix-blend-mode: multiply` over a duplicate background image source when `backgroundGlitch` is enabled (`z-index: 1`), an optional background effect overlay (`z-index: 2`), the cropped video screen (`z-index: 3`), an optional foreground effect (`z-index: 4`), and the overlay `<Image>` on top (`z-index: 5`, `pointer-events: none`, so all interaction goes to the video beneath it). The Glitch island is scoped to the background layer only, so its WebGL output never captures or distorts the YouTube embed or foreground overlay image. The plain background image remains visible even if the Glitch canvas cannot paint. Zoom and effect parameters are exposed as CSS custom properties (`--tvhead-*`) so they can be tuned without editing the component. A built-in `.tv-head-effect-static` class (opt-in via `backgroundEffectClass`) renders an animated CRT static/noise texture using layered gradients and keyframe animations.

## Extending

To add a new built-in effect class alongside `tv-head-effect-static`/`tv-head-effect-static-soft`/`tv-head-effect-tint-blue`/`tv-head-effect-tint-green`, add its selector and `@keyframes` (if animated) to the component's global `<style>` block, then pass its class name via `backgroundEffectClass` or `foregroundEffectClass`. Use `backgroundGlitchOptions` for Glitch shader tuning instead of adding one-off CSS filters to the background image.
