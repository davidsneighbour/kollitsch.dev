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
| `color` | `"gray" \| "red" \| "yellow"` | `"red"` | Colour theme |
| `bordered` | `boolean` | `false` | `true` renders a subtle inset-ring border; `false` renders a flat background |
| `href` | `string` | `undefined` | When set, renders as `<a href={href}>` with hover/focus-visible styling instead of a plain `<span>` |
| `class` | `string` | `""` | Extra classes appended after the variant classes |
| `title` | `string` | `undefined` | Applied as both `title` and `aria-label` |

## Usage

```astro
---
import Badge from '@components/shared/elements/Badge.astro';
---

<Badge color="yellow" bordered>Draft</Badge>
```

```astro
---
import Badge from '@components/shared/elements/Badge.astro';
---

<Badge color="red" href="/tags/astro/" title="View astro tag">astro</Badge>
```

## Behaviour

This component has no client-side behaviour. Colour/border/hover/focus classes are looked up from fixed per-colour class maps rather than built dynamically, so Tailwind's static class scanner can see every possible class. Hover and focus-visible classes are only applied when `href` is set, since they only make sense on an interactive element.
