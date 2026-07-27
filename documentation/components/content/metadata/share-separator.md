---
title: ShareSeparator
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders the large, brand-coloured share button row shown at the end of a blog post, built from every network in `social.json` that defines a `share` URL template.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/metadata/ShareSeparator.astro` |
| Data | [`src/content/social.json`](../../../../src/content/social.json) (filtered to entries with a `share` template) |
| Tests | [`src/components/content/metadata/ShareSeparator.test.ts`](../../../../src/components/content/metadata/ShareSeparator.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | required | Page/post title, substituted into each network's share URL template |
| `description` | `string` | required | Page/post description, substituted into each network's share URL template |
| `via` | `string` | `undefined` | Reserved for networks whose share template references a `via` handle; not currently consumed by any entry in `social.json` |

## Usage

```astro
---
import ShareSeparator from '@components/content/metadata/ShareSeparator.astro';
---

<ShareSeparator title={post.data.title} description={post.data.description} />
```

## Behaviour

This component has no client-side behaviour. For each network in `social.json` with a `share` field, it substitutes `${url}`, `${title}`, and `${description}` placeholders (URL-encoded, with encoded spaces normalised to `+`) into the template using the current `Astro.request.url` and the `title`/`description` props. Each resulting link opens in a new tab (`target="_blank" rel="noopener noreferrer"`) and is styled in the network's own `fill`/`background` classes from `social.json`, grayscale and dimmed by default and revealed in full colour on hover of the shared parent group (`group-hover:grayscale-0`). The known limitation noted in the source: the share URL always reflects the page currently being rendered, which is correct for post pages but may not be for other page types this component is placed on.

## Extending

To add a new share network, add an entry with a `share` URL template (using `${url}`, `${title}`, `${description}` placeholders) and `fill`/`background`/`icon`/`label` fields to [`social.json`](../../../../src/content/social.json); no component code changes are needed.
