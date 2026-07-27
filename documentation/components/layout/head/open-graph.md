---
title: OpenGraph
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders the Open Graph and Twitter Card `<meta>` tags for a page, using a pre-resolved payload and the generated [`OpenGraphImage`](open-graph-image.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/head/OpenGraph.astro` |
| Data | none (receives its data via the `openGraph` prop) |
| Tests | [`src/components/layout/head/OpenGraph.test.ts`](../../../../src/components/layout/head/OpenGraph.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `openGraph` | `OpenGraphPayload` | required | Normalised Open Graph data, typically produced by `resolveOpenGraphPayload` in [`src/utils/content.ts`](../../../../src/utils/content.ts) |

## Usage

```astro
---
import OpenGraph from '@components/layout/head/OpenGraph.astro';
import { resolveOpenGraphPayload } from '@utils/content.ts';

const { payload } = resolveOpenGraphPayload(post, options);
---

<OpenGraph openGraph={payload} />
```

## Behaviour

This component has no client-side behaviour. It renders `og:title`, `og:type` (always `"website"`), `og:url`, and `og:description` from the payload, falling back to the literal string `"missing"` when title or description are empty. It then renders `<OpenGraphImage openGraph={openGraph} return="og" />` for the `og:image` tags, followed by `twitter:card` (`"summary_large_image"`), `twitter:title`, `twitter:description`, and `<OpenGraphImage openGraph={openGraph} return="twitter" />` for the `twitter:image` tags.
