---
title: Tags
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a post's tag list as a row of badge links to each tag's archive page.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/metadata/Tags.astro` |
| Data | `src/content/tags/*.md` metadata resolved from `post.data.tags` |
| Tests | [`src/components/content/metadata/Tags.test.ts`](../../../../src/components/content/metadata/Tags.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The post whose `data.tags` should be rendered |

## Usage

```astro
---
import Tags from '@components/content/metadata/Tags.astro';
---

<Tags post={post} />
```

## Behaviour

This component has no client-side behaviour. It renders nothing when
`post.data.tags` is empty or absent. Otherwise it resolves each tag through
`src/utils/tags.ts` and renders one [`Tag`](../taxonomy/tag.md) badge link per
canonical tag, including any configured `badge` metadata.
