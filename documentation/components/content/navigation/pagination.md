---
title: Pagination
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders numbered pagination controls (Prev/Next plus a page-number strip with gap spacers) for any paginated listing.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/navigation/Pagination.astro` |
| Data | none |
| Tests | [`src/components/content/navigation/Pagination.test.ts`](../../../../src/components/content/navigation/Pagination.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `basePath` | `string` | required | Base path before any pagination segment, for example `"/blog/"` |
| `pagingPartial` | `string` | `""` | Optional lowercase URL segment inserted between the base and the page number, for example `"page"`; throws if it contains an uppercase character |
| `currentPage` | `number` | required | The currently active page (1-indexed) |
| `totalPages` | `number` | required | Total number of pages |
| `spacer` | `string` | `"…"` | Text shown for a gap between non-adjacent page numbers |
| `range` | `number` | `2` | Number of page numbers shown on each side of the current page |
| `showFirst` | `boolean` | `true` | Show page 1 even when it falls outside `range` |
| `showLast` | `boolean` | `true` | Show the last page even when it falls outside `range` |
| `edgeMode` | `"hide" \| "disable"` | `"disable"` | When on the first/last page, `"hide"` omits the Prev/Next control entirely; `"disable"` renders it as inert, styled text |

## Usage

```astro
---
import Pagination from '@components/content/navigation/Pagination.astro';
---

<Pagination basePath="/blog/" pagingPartial="page" currentPage={currentPage} totalPages={totalPages} />
```

## Behaviour

This component has no client-side behaviour. It renders nothing when `totalPages <= 1`. `pageLink(n)` builds each page's URL: page 1 always links to `basePath/`, other pages link to `basePath/[pagingPartial/]n/`. `generatePagination()` produces the visible page-number sequence: a contiguous run of `range` pages on either side of `currentPage`, with `1` and/or `totalPages` prepended/appended (and a `spacer` inserted) when `showFirst`/`showLast` are true and they fall outside that run.
