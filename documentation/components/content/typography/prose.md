---
title: Prose
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a blog post's rendered Markdown content inside a typography wrapper.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/typography/Prose.astro` |
| Data | none (receives the post via the `post` prop) |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The blog post whose Markdown/MDX body should be rendered |

## Usage

```astro
---
import Prose from '@components/content/typography/Prose.astro';
---

<Prose post={post} />
```

## Behaviour

This component has no client-side behaviour. It calls Astro's `render(post)` to obtain the post's `<Content />` component, then renders it inside a `<div class="typography-reading">`, which applies the site's reading-mode typography styles.
