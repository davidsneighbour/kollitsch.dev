---
title: IconLink
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders an icon paired with an optional label, as either a link or a button, with the icon positioned before or after the label.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/shared/links/IconLink.astro` |
| Data | none |
| Tests | [`src/components/shared/links/IconLink.test.ts`](../../../../src/components/shared/links/IconLink.test.ts) |

## Props

Extends `HTMLAttributes<"a">`.

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `icon` | `IconName` | required | Icon to render |
| `iconPosition` | `"prefix" \| "postfix"` | `"prefix"` | Icon placement relative to the label |
| `as` | `"link" \| "button"` | `"link"` | Renders an `<a>` or a `<button>` |
| `linkClass` | `string` | `""` | Classes for the outer `<a>`/`<button>` element |
| `class` | `string` | `""` | Classes for the icon itself |
| `translate` | `"yes" \| "no"` | `undefined` | Forwarded `translate` attribute (for machine-translation control) |
| `buttonType` | `HTMLAttributes<"button">["type"]` | `"button"` | HTML `type` when `as="button"` |

## Usage

```astro
---
import IconLink from '@components/shared/links/IconLink.astro';
---

<IconLink href="/blog/" icon="journal-text">Blog</IconLink>
```

```astro
---
import IconLink from '@components/shared/links/IconLink.astro';
---

<IconLink as="button" icon="chevron-right" iconPosition="postfix" buttonType="submit">
  Continue
</IconLink>
```

## Behaviour

This component has no client-side behaviour. When there is no default slot content, only the icon is rendered (no empty `<span>`), so `IconLink` also works as an icon-only control when given an `aria-label`. All non-listed props (for example `href`, `target`, `aria-*`) pass through to the rendered `<a>` or `<button>` via spread, cast per-element to avoid `type` prop conflicts between the two.
