---
title: Badge
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a small coloured badge/pill, either as a `<span>` or, when `href` is set, as an `<a>` with hover and focus-visible states.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/shared/elements/Badge.astro` |
| Data | none |
| Tests | [`src/components/shared/elements/Badge.test.ts`](../../../../src/components/shared/elements/Badge.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `variant` | `"default" \| "secondary" \| "destructive" \| "outline" \| "ghost" \| "link" \| "green" \| "gray" \| "red"` | `"default"` | shadcn-style badge variant |
| `color` | `"gray" \| "red" \| "yellow"` | `undefined` | Legacy colour theme; `yellow` maps to the green variant |
| `bordered` | `boolean` | `false` | Legacy border flag; with legacy colours, renders the bordered version where available |
| `href` | `string` | `undefined` | When set, renders as `<a href={href}>` with hover/focus-visible styling instead of a plain `<span>` |
| `class` | `string` | `""` | Extra classes appended after the variant classes |
| `title` | `string` | `undefined` | Applied as both `title` and `aria-label` |

## Usage

```astro
---
import Badge from '@components/shared/elements/Badge.astro';
---

<Badge variant="green">100 Days To Offload</Badge>
```

```astro
---
import Badge from '@components/shared/elements/Badge.astro';
---

<Badge variant="outline" href="/tags/astro/" title="View astro tag">astro</Badge>
```

## Behaviour

This component has no client-side behaviour. Variant, hover, and focus classes
are looked up from fixed class maps rather than built dynamically, so Tailwind's
static class scanner can see every possible class. Hover and focus-visible
classes are only applied when `href` is set, since they only make sense on an
interactive element. Icons may be placed in the slot by callers; icon elements
with `data-icon="inline-start"` or `data-icon="inline-end"` receive the badge
icon sizing rules.
