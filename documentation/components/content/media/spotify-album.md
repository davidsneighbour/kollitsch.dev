---
title: SpotifyAlbum
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Renders a lazy-loading Spotify album embed from a Spotify album id. Blog posts use this component instead of raw Spotify `<iframe>` markup.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/media/SpotifyAlbum.astro` |
| Data | none |
| Tests | [`src/components/content/media/SpotifyAlbum.test.ts`](../../../../src/components/content/media/SpotifyAlbum.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | required | Spotify album id only; full URLs and malformed values fail the build |
| `title` | `string` | `"Spotify album player"` | Accessible title for the embedded player |
| `class` | `string` | `""` | Extra classes on the wrapper element |

## Usage

```mdx
import SpotifyAlbum from '@components/content/media/SpotifyAlbum.astro';

<SpotifyAlbum id="40hWUhttLF6j8feHjbF0g7" />
```

## Behaviour

`SpotifyAlbum` trims and validates the `id` prop before rendering the iframe URL `https://open.spotify.com/embed/album/{id}`. It keeps Spotify's standard album embed height of `352`, uses `loading="lazy"`, and preserves the required `allow` permissions for playback, clipboard, encrypted media, fullscreen, and picture-in-picture.

The wrapper uses the existing `{rounded.xl}` design token via `rounded-xl`, matching the previous `12px` Spotify embed radius without adding a new design value.
