---
title: ShareSeparator
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-11-14T17:00:00+07:00
---

Renders the large, brand-coloured share button row shown at the end of a blog post, built from every network with `show.shareBar` in the [social media setup](../../../content/social-setup.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/metadata/ShareSeparator.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (`social` section, networks with `show.shareBar`) |
| Tests | [`src/components/content/metadata/ShareSeparator.test.ts`](../../../../src/components/content/metadata/ShareSeparator.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | required | Page/post title, substituted into each network's share URL template |
| `description` | `string` | required | Page/post description, substituted into each network's share URL template |

## Usage

```astro
---
import ShareSeparator from '@components/content/metadata/ShareSeparator.astro';
---

<ShareSeparator title={post.data.title} description={post.data.description} />
```

## Behaviour

Static networks keep normal links. Instance-aware networks use [`ShareIntentLink`](../../features/social/share-intent-link.md), whose handler loads only after a click and pre-fills the saved server. For each network with `show.shareBar`, `buildShareUrl()` fills the `{url}`, `{title}`, and `{description}` placeholders of `share.url` (each value URL-encoded) with the current `Astro.request.url` and the `title`/`description` props. Each resulting link opens in a new tab (`target="_blank" rel="noopener noreferrer"`) and is styled with the network's `classes.fill` and `classes.background`, grayscale and dimmed by default and revealed in full colour on hover of the shared parent group (`group-hover:grayscale-0`). The known limitation noted in the source: the share URL always reflects the page currently being rendered, which is correct for post pages but may not be for other page types this component is placed on.

## Extending

To add a share network, set `share.url` and `show.shareBar` on its entry in [`setup.json`](../../../../src/data/setup.json); see [Social media setup](../../../content/social-setup.md). No component code changes are needed.

Instance-aware configuration and fallback behaviour are described in [Social media setup](../../../content/social-setup.md#instance-aware-sharing).
