---
title: FeedReader
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Promotional widget advertising the author's two curated RSS feeds ("Web, Tech & Development" and "This & That"), each rendered as a [`CardLink`](../../ui/card-link.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/features/feeds/FeedReader.astro` |
| Data | [`src/assets/images/interface/feed-web-tech-development.jpg`](../../../../src/assets/images/interface/feed-web-tech-development.jpg), [`src/assets/images/interface/feed-this-and-that.jpg`](../../../../src/assets/images/interface/feed-this-and-that.jpg) |
| Tests | [`src/components/features/feeds/FeedReader.test.ts`](../../../../src/components/features/feeds/FeedReader.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | `"Follower Feeds"` | Vertical sideways label shown on desktop |
| `description` | `string` | `"Read an eclectic selection of Patrick's reading"` | Screen-reader-only description associated with the label |
| `linkWebTech` | `string` | `"https://kollitsch.dev/dnb-webdev.rss.xml"` | URL for the Web, Tech & Development feed card |
| `linkThisAndThat` | `string` | `"https://kollitsch.dev/dnb-entertainment.rss.xml"` | URL for the This & That feed card |

## Usage

```astro
---
import FeedReader from '@components/features/feeds/FeedReader.astro';
---

<FeedReader />
```

## Behaviour

This component has no client-side behaviour. It renders a sideways-rotated heading label (horizontal on mobile, vertical on `md:` and up) followed by two hard-coded [`CardLink`](../../ui/card-link.md) cards, one per feed. `src/components/README.md` flags this as a "bespoke promotional component with hard coded defaults that likely deserves its own feature module" — a candidate for a future refactor into a data-driven list rather than two fixed cards.
