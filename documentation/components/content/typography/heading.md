---
title: Heading
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a semantic `<h1>`-`<h6>` element for a given nesting level, optionally wrapping the content in a link or injecting raw HTML instead of using the slot.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/typography/Heading.astro` |
| Data | none |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `level` | `number` | `1` | Heading level; clamped to the 1-6 range and used to pick the rendered tag (`h1`-`h6`) |
| `description` | `string` | `""` | When set, rendered as the element's `title` attribute |
| `link` | `string` | `""` | When set, wraps the heading content in an `<a href={link}>` |
| `class` | `string` | `""` | Classes applied to the heading element |
| `html` | `string` | `""` | Raw HTML string rendered via `set:html` instead of the default slot |
| `transitionName` | `string` | `""` | When set, applied as the `transition:name` attribute for view transitions |

## Usage

```astro
---
import Heading from '@components/content/typography/Heading.astro';
---

<Heading level={2}>Section title</Heading>
```

```astro
---
import Heading from '@components/content/typography/Heading.astro';
---

<Heading level={1} link="/blog/" description="Go to the blog" transitionName="page-title">
  Blog
</Heading>
```

## Behaviour

This component has no client-side behaviour. `level` is clamped with `Math.min(6, Math.max(1, Number(level)))` before being used to build the tag name, so out-of-range values fall back to `h1` or `h6` rather than producing an invalid tag. When both `link` and `html` are set, the raw HTML is rendered inside the link; when only `html` is set, it replaces the slot content entirely.

## Extending

`html` exists for content sources that hand back pre-rendered markup (for example a Markdown-rendered string) where using the default slot is not practical. Prefer the slot for anything else, since `set:html` bypasses Astro's usual escaping.
