---
title: Link
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

A minimal, unstyled `<a>` wrapper that exists purely so links can be composed and swapped consistently across the codebase.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/shared/links/Link.astro` |
| Data | none |
| Tests | [`src/components/shared/links/Link.test.ts`](../../../../src/components/shared/links/Link.test.ts) |

## Props

Extends `HTMLAttributes<"a">` (all standard anchor attributes, most notably `href`).

## Usage

```astro
---
import Link from '@components/shared/links/Link.astro';
---

<Link href="/rss.xml">RSS</Link>
```

## Behaviour

This component has no client-side behaviour. It renders an `<a href={href}>` with every other prop spread onto it, and the slot as its content. It carries no default styling of its own — callers apply classes via the spread `class` attribute.
