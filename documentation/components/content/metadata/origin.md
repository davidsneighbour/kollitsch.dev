---
title: Origin
tags: []
created: 2026-09-12T00:00:00+07:00
updated: 2026-09-12T00:00:00+07:00
---

Renders a quiet provenance line on posts promoted from an external source, currently only Mastodon: "Originally posted in the stream on \<date\>", linking to `/stream/` and to the original Mastodon post. Renders nothing when the post has no `origin` frontmatter.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/metadata/Origin.astro` |
| Data | `post.data.origin`; see [Frontmatter](../../../content/frontmatter.md) and [Stream](../../../content/stream.md) |
| Tests | [`src/components/content/metadata/Origin.test.ts`](../../../../src/components/content/metadata/Origin.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The post whose `origin` frontmatter, if any, should be rendered |

## Usage

```astro
---
import Origin from '@components/content/metadata/Origin.astro';
---

<Origin post={post} />
```

## Behaviour

This component has no client-side behaviour and renders nothing unless `post.data.origin?.type === "mastodon"`. It is rendered from [`PostMeta`](post-meta.md) directly after [`PublishData`](publish-data.md), so provenance sits close to the rest of the post's publication metadata.
