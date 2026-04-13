# TvHead

`TvHead.astro` renders a responsive TV-style video block with layered visuals.

The component is designed for editorial/gimmick use inside pages or posts where a video should appear behind a transparent area in an overlay image such as a TV frame.

## Location

* Component: `src/components/gimmicks/TvHead.astro`
* Video script: `src/scripts/vendor/lite-youtube.ts`

The lite YouTube vendored files stay as they are. Component-specific CSS stays inside `TvHead.astro`.

## Layer model

The component renders these layers from back to front:

1. background zoom wrapper
   * background image
   * background effect layer
2. foreground zoom wrapper
   * video/screen
   * foreground effect layer
   * overlay image

This means you can independently zoom:

* the background group
* the foreground group

## Asset expectations

`imageSrc` and `backgroundSrc` are resolved from:

* `src/assets/images/interface/`

Supported input styles:

* `tv-001.png`
* `folder/tv-001.png`
* `assets/images/interface/tv-001.png`
* `src/assets/images/interface/tv-001.png`

The component resolves the string internally via `import.meta.glob()` and uses Astro image metadata for intrinsic dimensions.

## Purpose

The component lets you:

* place a YouTube video behind a transparent screen area inside an image
* keep the whole composition responsive
* use original source-image pixel measurements for placement
* optionally add a background image behind the video
* optionally add a background effect layer
* optionally add a foreground effect layer
* switch between:
  * modern full-frame behaviour (`contain`)
  * old TV cropped-fill behaviour (`cover`)
* zoom the background group and foreground group independently

## Props

```ts
type TvHeadProps = {
  id?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  videoId: string;
  imageSrc: string;
  backgroundSrc?: string;
  backgroundClass?: string;
  backgroundEffectClass?: string;
  foregroundEffectClass?: string;
  cropTop?: number;
  cropRight?: number;
  cropBottom?: number;
  cropLeft?: number;
  borderRadius?: string;
  title?: string;
  params?: string;
  class?: string;
  scaleMode?: 'contain' | 'cover';
  videoAspectRatio?: number;
  backgroundZoom?: number;
  backgroundZoomOrigin?: string;
  foregroundZoom?: number;
  foregroundZoomOrigin?: string;
};
````

## Required props

### `x`

Top-left X coordinate of the video screen area in source-image pixels.

### `y`

Top-left Y coordinate of the video screen area in source-image pixels.

### `width`

Width of the video screen area in source-image pixels.

### `height`

Height of the video screen area in source-image pixels.

### `videoId`

YouTube video ID, for example:

```text
RgDKpgUI3To
```

### `imageSrc`

Foreground overlay image path, resolved from `src/assets/images/interface/`.

This is the frame image that sits above the video.

## Optional props

### `id`

HTML `id` attribute for the outer component wrapper.

Default:

```text
tvhead-${videoId}
```

Important restriction:

* If the same `videoId` is used more than once on the same page, the default ID will repeat.
* The component does not auto-generate unique counters for repeated instances.
* If you reuse the same video more than once on a page, set `id` manually.

Recommended rule:

* always provide an explicit `id` when there is any chance that the same `videoId` appears multiple times on one page

### `backgroundSrc`

Optional background image path, resolved from `src/assets/images/interface/`.

If provided, it is rendered behind the video and overlay.

If omitted, no background layer is rendered.

### `backgroundClass`

Optional classes applied to the background image element.

Use this for per-instance styling such as:

* rounded corners
* opacity
* blur
* gradients via utility classes
* filters
* transforms

### `backgroundEffectClass`

Optional classes applied to the dedicated background effect layer.

This layer sits:

* above the background image
* below the video layer

Use it for things such as:

* static noise
* tint
* blur
* gradient overlays
* blend modes
* animated interference
* future JS hooks

Example:

```text
tv-head-effect-static
```

### `foregroundEffectClass`

Optional classes applied to the dedicated foreground effect layer.

This layer sits:

* above the video layer
* below the overlay image

Use it for things such as:

* glare
* scan overlays
* subtle tints
* future JS hooks
* experiment layers without changing the component structure

### `cropTop`, `cropRight`, `cropBottom`, `cropLeft`

Crop adjustments in source-image pixels.

These values expand and offset the internal player area relative to the visible screen box.

Use them to hide:

* black bars
* player chrome
* extra top/bottom spacing
* unwanted edges

These are pixel values, not percentages.

### `borderRadius`

Applied to the visible screen viewport.

Useful for slightly curved or rounded screens.

Examples:

```text
0px
1rem
12% / 8%
```

### `title`

Accessible title / play label for the lite YouTube player.

Default:

```text
Play video
```

### `params`

Extra YouTube player query parameters.

Default:

```text
controls=0&modestbranding=1&rel=0&playsinline=1
```

### `class`

Classes applied to the outer wrapper element.

### `scaleMode`

Controls how the video fits into the defined screen box.

Supported values:

* `contain`
* `cover`

Default:

```text
contain
```

#### `contain`

Modern behaviour.

* full video remains visible
* black bars may appear
* no forced cropping beyond your manual crop settings

#### `cover`

Old TV behaviour.

* viewport is fully filled
* overflow is cropped
* black bars are avoided where possible
* left/right or top/bottom may be clipped depending on aspect ratio

### `videoAspectRatio`

Aspect ratio used for `scaleMode="cover"` calculations.

Default:

```ts
16 / 9
```

Examples:

* landscape YouTube: `16 / 9`
* old TV / archive footage: `4 / 3`
* portrait / reels: `9 / 16`

### `backgroundZoom`

Scales the background group.

Default:

```text
1
```

This affects:

* background image
* background effect layer

The outer wrapper size stays fixed. Overflow is clipped.

### `backgroundZoomOrigin`

CSS transform origin for the background zoom wrapper.

Default:

```text
center center
```

Examples:

* `center center`
* `center top`
* `left center`

### `foregroundZoom`

Scales the foreground group.

Default:

```text
1
```

This affects:

* video/screen
* foreground effect layer
* overlay image

The outer wrapper size stays fixed. Overflow is clipped.

This is the main control for making the visible screen opening appear larger on the page.

### `foregroundZoomOrigin`

CSS transform origin for the foreground zoom wrapper.

Default:

```text
center center
```

Examples:

* `center center`
* `center top`
* `left center`

## Coordinate system

The component expects source-image pixel coordinates measured from the top-left corner of the overlay image.

That means:

* origin = top-left
* X increases to the right
* Y increases downward

Example:

```text
x = 556
y = 138
width = 435
height = 357
```

The component converts these pixel values into percentages internally so the final output scales responsively with the image.

## Responsiveness

The component uses the intrinsic dimensions of the overlay image to set the wrapper aspect ratio.

This means:

* width is fluid
* height follows automatically
* overlay, background, and video remain aligned as the component scales

## Built-in background effect classes

The component currently includes these built-in effect helper classes inside its own CSS:

* `tv-head-effect-static`
* `tv-head-effect-static-soft`
* `tv-head-effect-tint-blue`
* `tv-head-effect-tint-green`

These are intentionally scoped to the component.

Example:

```astro
<TvHead
  x={556}
  y={138}
  width={435}
  height={357}
  videoId="RgDKpgUI3To"
  imageSrc="tv-002.png"
  backgroundSrc="tv-002-bg.png"
  backgroundEffectClass="tv-head-effect-static tv-head-effect-static-soft"
/>
```

## Example usage

```astro
---
import TvHead from '@components/gimmicks/TvHead.astro';
---

<TvHead
  id="tvhead-demo-001"
  x={556}
  y={138}
  width={435}
  height={357}
  videoId="RgDKpgUI3To"
  imageSrc="tv-002.png"
  backgroundSrc="tv-002-bg.png"
  backgroundClass="opacity-90"
  backgroundEffectClass="tv-head-effect-static tv-head-effect-static-soft"
  cropTop={24}
  cropRight={60}
  cropBottom={48}
  cropLeft={60}
  borderRadius="1.25rem"
  scaleMode="cover"
  foregroundZoom={1.08}
  foregroundZoomOrigin="center center"
  title="Play video on TV"
/>
```

## Example usage with repeated video IDs

If the same YouTube video is used twice on one page, set explicit IDs:

```astro
<TvHead
  id="tvhead-intro"
  x={556}
  y={138}
  width={435}
  height={357}
  videoId="RgDKpgUI3To"
  imageSrc="tv-002.png"
/>

<TvHead
  id="tvhead-footer"
  x={468}
  y={403}
  width={498}
  height={394}
  videoId="RgDKpgUI3To"
  imageSrc="tv-001.png"
/>
```

Do not rely on the default generated ID in that case.

## Behaviour notes

### Overlay click-through

The overlay image uses:

```css
pointer-events: none;
```

This allows clicks and taps to reach the video player underneath.

### Background layer behaviour

The background image is a full-component layer behind the video and overlay.

It is not clipped to the video screen area.

This is intentional so that overlay transparency outside the screen opening can reveal the background image too.

### Zoom behaviour

The outer wrapper always keeps the same size.

Zooming happens inside fixed-size clipped wrappers.

This means:

* zooming can intentionally crop the image/frame/video
* this is expected
* overly aggressive zoom values can clip too much of the composition
* that is considered configuration responsibility, not a component bug

### Lite YouTube

The component uses a local vendored lite YouTube implementation instead of a package or CDN import.

Reasons:

* lower initial load cost
* click-to-load behaviour
* simpler local control
* easier Astro/ESM integration
* easier customisation inside this project

## Current restrictions

### ID uniqueness

The component does not detect duplicate instances of the same `videoId` on a page.

Restriction:

* default IDs are not guaranteed to be unique if the same `videoId` is reused

Workaround:

* set `id` manually whenever reuse is possible

### No automatic video metadata lookup

The component does not call the YouTube API to fetch dimensions or metadata.

Aspect handling is controlled by:

* `scaleMode`
* `videoAspectRatio`
* crop values

This keeps the component simple and avoids unnecessary runtime complexity.

### Rectangular viewport only

The visible video area is currently a rectangle with optional `borderRadius`.

Not yet supported:

* arbitrary masks
* perspective mapping
* four-point skewing
* non-rectangular clipping paths

## Recommended usage pattern

This component is best used as an editorial gimmick between content sections, such as:

* between blog posts
* between text sections
* as a visual break with embedded media

It is not currently intended as a general-purpose media gallery component.

## Future ideas

Not currently required, but possible later:

* masked or irregular screen shapes
* 4-point perspective support
* local video sources
* custom play button overlays
* preset registry for recurring TV layouts
* crop/debug visualisation mode
