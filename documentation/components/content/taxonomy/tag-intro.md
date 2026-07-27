---
title: TagIntro
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders an introductory section for a tag archive page: an optional hero image, a heading, and a description.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/taxonomy/TagIntro.astro` |
| Data | none |
| Tests | [`src/components/content/taxonomy/TagIntro.test.ts`](../../../../src/components/content/taxonomy/TagIntro.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | required | Heading text |
| `description` | `string` | `undefined` | Optional paragraph shown below the heading |
| `image` | `{ src: string; alt?: string; width?: number; height?: number }` | `undefined` | Optional hero image; `alt` falls back to `title`, `width`/`height` default to `1200`/`600` |

## Usage

```astro
---
import TagIntro from '@components/content/taxonomy/TagIntro.astro';
---

<TagIntro title="astro" description="Posts about Astro." />
```

```astro
---
import TagIntro from '@components/content/taxonomy/TagIntro.astro';
---

<TagIntro
  title="astro"
  description="Posts about Astro."
  image={{ src: '/tags/astro.jpg', width: 1200, height: 600 }}
/>
```

## Behaviour

This component has no client-side behaviour. It renders an optional `loading="lazy"` `<img>`, a level-1 [`Heading`](../typography/heading.md), and an optional description paragraph, in that order.
