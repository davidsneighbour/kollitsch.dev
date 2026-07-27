---
title: CardLink
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a card-styled external link with an optional thumbnail image and a title, used by [`FeedReader`](../features/feeds/feed-reader.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/ui/CardLink.astro` |
| Data | none |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | required | Target URL |
| `title` | `string` | required | Visible title text |
| `image` | `ImageMetadata` | `undefined` | Optional thumbnail image |
| `alt` | `string` | `undefined` | Alt text; required (throws at build time) when `image` is provided |
| `target` | `string` | `"_blank"` | Link `target` |
| `rel` | `string` | `"noopener noreferrer"` | Link `rel` |
| `classes` | `string` | `""` | Extra classes on the outer `<a>` |
| `titleClasses` | `string` | `""` | Extra classes on the title `<span>` |
| `imageWrapperClasses` | `string` | `""` | Extra classes on the image wrapper |

## Usage

```astro
---
import CardLink from '@components/ui/CardLink.astro';
---

<CardLink href="https://example.com/feed.xml" title="Example Feed" image={feedImage} alt="Example feed" />
```

```astro
---
import CardLink from '@components/ui/CardLink.astro';
---

<CardLink href="https://example.com/" title="No thumbnail" />
```

## Behaviour

This component has no client-side behaviour. It renders a single `<a>` card: with `image` set, a `24`/`32` (mobile/`sm:`) square thumbnail sits beside the title; without it, the title alone fills the card. `src/components/README.md` notes `ui/` is unrelated to shadcn/ui — see [`shadcn-ui/Button`](../shadcn-ui/button.md) and [`shadcn-ui/Card`](../shadcn-ui/card.md) for the generated shadcn components, kept in a separate directory.
