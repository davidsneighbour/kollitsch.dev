---
title: PublishData
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a post's publish date, an optional last-modified date, and (development only) a link to open the post's source file in VS Code.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/metadata/PublishData.astro` |
| Data | none; formats dates via [`src/utils/content.ts`](../../../../src/utils/content.ts) |
| Tests | [`src/components/content/metadata/PublishData.test.ts`](../../../../src/components/content/metadata/PublishData.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The post whose publish/modified dates should be rendered |

## Usage

```astro
---
import PublishData from '@components/content/metadata/PublishData.astro';
---

<PublishData post={post} />
```

## Behaviour

This component has no client-side behaviour. It formats `post.data.date` with `formatDate()` for display, and also emits a machine-readable `data-pagefind-meta="date:YYYY-MM-DD"` attribute on the wrapper so Pagefind can index and filter by publish date. `post.data.lastModified`, when present, is shown alongside the publish date. In `import.meta.env.DEV`, an [`IconLink`](../../shared/links/icon-link.md) pointing at `getVSCodeUrlById(post.id)` is appended, letting the author jump straight to the source file; this link is omitted in production builds.
