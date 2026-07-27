---
title: Tag
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a single pill-styled tag link with an optional icon, used as the building block for [`TagList`](tag-list.md).

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
| `icon` | `TagIcon \| string` | `undefined` | Icon name (string), or a `{ name, color }` object for a coloured icon |

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

<Tag href="/tags/astro/" label="astro (12)" dataLabel="astro" icon={{ name: "lucide:hash", color: "#f97316" }} />
```

## Behaviour

This component has no client-side behaviour. It renders an `<a>` with `data-label={dataLabel}`, optionally preceded by an icon (`iconConfig.color`, when present, is applied as an inline `style="color: ..."`). The pill styling (red-tinted background/text, hover states) is scoped to the component via a `<style>` block referencing `theme.css`.
