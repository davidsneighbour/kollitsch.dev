---
title: Tag
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a single badge-styled tag link with optional badge metadata and icon
placement, used as the building block for [`TagList`](tag-list.md) and
[`TagCloud`](tag-cloud.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/taxonomy/Tag.astro` |
| Data | none |
| Tests | [`src/components/content/taxonomy/Tag.test.ts`](../../../../src/components/content/taxonomy/Tag.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `href` | `string` | required | URL the tag links to |
| `label` | `string` | required | Visible tag text |
| `dataLabel` | `string` | required | Lowercase label written to `data-label`, read by the client-side filter script in [`TagFilter`](tag-filter.md)/[`TagList`](tag-list.md) |
| `badge` | `TagBadge` | `undefined` | Badge presentation metadata from `src/content/tags/*.md` |
| `icon` | `TagIcon \| string` | `undefined` | Legacy icon name or icon object; `badge.icon` takes precedence |

## Usage

```astro
---
import Tag from '@components/content/taxonomy/Tag.astro';
---

<Tag href="/tags/astro/" label="astro" dataLabel="astro" />
```

```astro
---
import Tag from '@components/content/taxonomy/Tag.astro';
---

<Tag
  href="/tags/astro/"
  label="astro (12)"
  dataLabel="astro"
  badge={{
    variant: "green",
    icon: { name: "lucide:hash", position: "inline-end" },
  }}
/>
```

## Behaviour

This component has no client-side behaviour. It renders the shared
[`Badge`](../../shared/elements/badge.md) component as an `<a>` with
`data-label={dataLabel}`. `badge.icon.position` controls whether the icon is
placed at `inline-start` or `inline-end`; `badge.icon.color`, when present, is
applied as an inline `style="color: ..."`.
