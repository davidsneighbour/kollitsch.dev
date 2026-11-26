---
title: TableOfContents
tags: []
created: 2026-11-26T00:00:00+07:00
updated: 2026-11-26T00:00:00+07:00
---

Renders a collapsible "On this page" list of a long post's `h2` and `h3` headings, so readers can see the structure and jump to a section.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/navigation/TableOfContents.astro` |
| Data | selects entries via `getTocHeadings()` in [`src/utils/table-of-contents.ts`](../../../../src/utils/table-of-contents.ts) |
| Tests | [`table-of-contents.test.ts`](../../../../src/utils/table-of-contents.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `headings` | `MarkdownHeading[]` | required | The headings Astro's `render()` returns for the post |

## Usage

```astro
---
const { Content, headings } = await render(post);
---

<TableOfContents headings={headings} />
```

## Behaviour

The component renders nothing unless the post has at least `TOC_MIN_SECTIONS` (4) `h2` headings. When it renders, it is a `<details>` element, closed by default, with the summary "On this page" and a `nav` labelled "On this page". Each entry links to the heading's `id`; `h3` entries are indented and one step smaller. It has no client-side script. [`Prose`](../typography/prose.md) renders it directly above the post body.

The heading ids come from Astro's `rehypeHeadingIds`, which `astro.config.ts` runs before `src/utils/rehype-heading-anchors.ts`. That plugin adds an empty `a.heading-anchor` link to every `h2` to `h4`; the `#` is drawn in CSS, so the anchor does not change the heading text listed here.
