---
title: FontsPreload
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Emits `preconnect` and `dns-prefetch` hints for the analytics origin, ahead of the analytics script loading elsewhere on the page.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/head/FontsPreload.astro` |
| Data | none |
| Tests | [`src/components/layout/head/FontsPreload.test.ts`](../../../../src/components/layout/head/FontsPreload.test.ts) |

## Props

This component accepts no props.

## Usage

```astro
---
import FontsPreload from '@components/layout/head/FontsPreload.astro';
---

<FontsPreload />
```

## Behaviour

This component has no client-side behaviour. It renders a `preconnect` and a `dns-prefetch` `<link>` for `https://analytics.dnbhub.xyz`. Font `preload` links for the Changa, Exo, and JetBrains Mono webfonts are present in the source but commented out, since Changa Italic does not need preloading; the other weights are currently self-hosted through `@fontsource` and preloaded implicitly.

## Extending

To restore explicit font preloading, uncomment and adjust the commented `<link rel="preload" as="font">` block in the component source.
