---
title: WebComponents
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Conditionally loads vendored JavaScript for optional interactive widgets (date-diff, lite YouTube embed) that a blog post opts into via frontmatter.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/layout/footer/WebComponents.astro` |
| Data | none (reads `options.head.components` from the `post` prop's frontmatter) |
| Tests | [`src/components/layout/footer/WebComponents.test.ts`](../../../../src/components/layout/footer/WebComponents.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog"> \| MarkdownInstance<Record<string, unknown>>` | `undefined` | The current post entry; its frontmatter is inspected for `options.head.components` |

## Usage

```astro
---
import WebComponents from '@components/layout/footer/WebComponents.astro';
---

<WebComponents post={post} />
```

## Behaviour

Reads `post.data.options.head.components` (an array of component identifier strings) from the post's frontmatter, defensively narrowing at each level and treating anything malformed as "no components requested". For each identifier present in that list, it emits an `async` `<script>` tag pointing at the matching vendored script:

| Identifier | Script |
| --- | --- |
| `date-diff` | `/vendor/datediff.js` |
| `lite-youtube` | `/vendor/lite-youtube-embed/lite-yt-embed.js` |

## Extending

To add a new opt-in widget, add an entry to the `SCRIPTS` map in `WebComponents.astro` and reference its identifier from a post's `options.head.components` frontmatter array.
