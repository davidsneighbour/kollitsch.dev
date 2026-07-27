---
title: Youtube
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a lightweight, lazy-loading YouTube embed (a `<lite-youtube>` custom element) that only loads the full YouTube iframe API after the user interacts with it.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/media/Youtube.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (`video.params` default player parameters) |
| Tests | [`src/components/content/media/Youtube.test.ts`](../../../../src/components/content/media/Youtube.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `video` | `string` | required | An exact 11-character YouTube video id; anything else fails the build with a thrown error |
| `label` | `string` | required | Accessible label for the embed's play button |
| `classes` | `string` | `undefined` | Classes applied to the `<lite-youtube>` element |
| `style` | `string` | `undefined` | Inline style applied to the `<lite-youtube>` element |
| `params` | `YouTubePlayerParamsInput` | `undefined` | Sanitised and merged over `setup.video.params`, then serialised onto the element |

## Usage

```astro
---
import Youtube from '@components/content/media/Youtube.astro';
---

<Youtube video="dQw4w9WgXcQ" label="Rick Astley - Never Gonna Give You Up" />
```

```astro
---
import Youtube from '@components/content/media/Youtube.astro';
---

<Youtube video="dQw4w9WgXcQ" label="Rick Astley - Never Gonna Give You Up" params={{ controls: 0, rel: 0 }} />
```

## Behaviour

`parseYouTubeId()` validates that `video` is exactly an 11-character YouTube id; anything else (a full URL, a malformed id) throws at build/SSR time rather than rendering a broken embed. Player parameters from `params` are sanitised via `sanitizeYouTubePlayerParams()` and merged over the site-wide defaults from `setup.video.params`, then serialised onto the element's `params` attribute.

The heavy lifting happens in an inline, vendored [lite-youtube-embed](https://github.com/paulirish/lite-youtube-embed)-derived custom element (`<lite-youtube>`), registered once via `customElements.define`:

- Shows a poster thumbnail (`hqdefault.jpg`, later upgraded in the background to a higher-resolution `maxresdefault.webp` if available) and a play button, with no iframe loaded yet.
- On `pointerover`/`focusin`, preconnects to `youtube-nocookie.com`, `google.com`, and the DoubleClick ad domains, warming up the connections likely needed once the user activates the embed.
- On click (or Enter/Space on the fake button), swaps in either a basic `<iframe>` (`youtube-nocookie.com`, autoplaying), or, on Safari/mobile (where autoplay-via-click isn't reliably tracked), loads the full YouTube IFrame Player API and creates a `YT.Player` instead.
- Also renders a `<noscript>` iframe fallback for indexability when JavaScript is unavailable.

## Extending

`setup.video.params` in [`setup.json`](../../../../src/data/setup.json) controls the site-wide default YouTube player parameters (for example, disabling related videos); per-embed `params` override those defaults rather than replacing them.
