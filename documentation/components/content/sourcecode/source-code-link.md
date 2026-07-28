---
title: SourceCodeLink
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Renders a single external source-code badge link.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/sourcecode/SourceCodeLink.astro` |
| Data | none |
| Tests | [`src/components/content/sourcecode/SourceCodeLink.test.ts`](../../../../src/components/content/sourcecode/SourceCodeLink.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `url` | `string` | required | Full external source URL |
| `label` | `string` | derived from `url` | Display label |
| `icon` | `string` | `simple-icons:github` | Iconify icon name |
| `class` | `string` | `""` | Extra classes on the link |
| `line` | `number \| string` | `undefined` | Single line or `start-end` range appended as a GitHub/GitLab-style anchor |
| `inline` | `boolean` | `false` | Renders an inline prose-style link instead of a badge |

## Usage

```astro
---
import SourceCodeLink from '@components/content/sourcecode/SourceCodeLink.astro';
---

<SourceCodeLink
  url="https://github.com/davidsneighbour/kollitsch.dev/blob/main/src/components/example.astro"
  line="12-24"
/>
```

## Behaviour

When `line` is supplied and the URL has no existing fragment, the component appends GitHub/GitLab-compatible `#L...` anchors. If `label` is omitted, it derives a readable file path from GitHub and GitLab blob URLs, falling back to the final URL path segment.
