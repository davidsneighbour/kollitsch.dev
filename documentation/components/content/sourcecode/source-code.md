---
title: SourceCode
tags: []
created: 2026-07-28T00:00:00+07:00
updated: 2026-07-28T00:00:00+07:00
---

Renders one or more source-code links from a blog post's `sourcecode` frontmatter.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/sourcecode/SourceCode.astro` |
| Data | Blog post `sourcecode` frontmatter |
| Tests | [`src/components/content/sourcecode/SourceCode.test.ts`](../../../../src/components/content/sourcecode/SourceCode.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `sourcecode` | `Record<string, string \| SourceCodeEntry>` | required | Source links keyed by short slug |
| `class` | `string` | `""` | Extra classes for the wrapper |

`SourceCodeEntry` accepts `source`, `label`, `icon`, `line`, and `class`. A string value is treated as the `source` URL and uses the record key as the label.

## Usage

```yaml
sourcecode:
  component:
    source: https://github.com/davidsneighbour/kollitsch.dev/blob/main/src/components/example.astro
    label: Example component
    line: 12-24
```

Full blog posts render this block automatically when `sourcecode` is present.

## Behaviour

The component normalises each frontmatter entry and delegates rendering to [`SourceCodeLink`](source-code-link.md). It is intended for posts that discuss concrete project files or line ranges, where a consistent badge is clearer than ad hoc prose links.
