---
title: PostDateline
tags: []
created: 2026-10-12T00:00:00+07:00
updated: 2026-10-12T00:00:00+07:00
---

Renders the quiet dateline above a post title: the publish date, plus the last modification when it falls on a later day, for example "12 October 2026 · updated 3 March 2027".

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/metadata/PostDateline.astro` |
| Helper | `getDateline()` in `src/utils/datetime.ts` |
| Tests | [`src/components/content/metadata/PostDateline.test.ts`](../../../../src/components/content/metadata/PostDateline.test.ts), [`src/utils/datetime.test.ts`](../../../../src/utils/datetime.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The post whose `date` and optional `lastModified` are shown |
| `class` | `string` | `""` | Extra classes for spacing in the calling layout |

## Usage

```astro
---
import PostDateline from '@components/content/metadata/PostDateline.astro';
---

<PostDateline post={post} class="mt-4 mb-0" />
```

## Behaviour

Dates are formatted in British order ("12 October 2026") in the site timezone (`setup.timezone`). Each date is a `<time>` element with an ISO day in `datetime`. The update is shown only when `lastModified` falls on a later day than `date`. The separator dot is hidden from assistive technology.

The text uses the muted grey of other meta text and scales with the reading size (`text-sm`, `lg:text-base`, `xl:text-lg`). On single post pages, [`Post`](../article/post.md) places it between the cover and the title, with a 4 px gap to the title so both read as one block. The full publish data stays in [`PublishData`](publish-data.md) at the end of the article.
