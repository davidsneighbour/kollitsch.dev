---
title: SocialLinks
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders a list of social media/profile links (icon plus label) from `social.json`, used in the footer and elsewhere on the site.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/features/social/SocialLinks.astro` |
| Data | [`src/content/social.json`](../../../../src/content/social.json) (default `items`) |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `"ul" \| "ol" \| "div" \| "menu"` | `"ul"` | Outer container tag; each item renders as `<li>` unless `container="div"`, in which case items render as `<span>` |
| `containerClass` | `string` | `"flex flex-row flex-wrap justify-center gap-2 lg:justify-end"` | Classes applied to the container |
| `items` | `SocialMediaItem[]` | `social.json`'s contents | Items to render; each needs `id`, `label`, `icon`, and typically `url` |
| `target` | `string` | `"_blank"` | `target` applied to every link |

## Usage

```astro
---
import SocialLinks from '@components/features/social/SocialLinks.astro';
---

<SocialLinks />
```

```astro
---
import SocialLinks from '@components/features/social/SocialLinks.astro';
---

<SocialLinks container="div" containerClass="flex gap-4" target="_self" />
```

## Behaviour

This component has no client-side behaviour. It renders one [`IconLink`](../../shared/links/icon-link.md) per item, sized `size-6` plus each item's own `fill` class. `rel` is always seeded with `noopener noreferrer me` (the `me` token supports [IndieAuth-style rel=me verification](https://indieweb.org/rel-me)), with any item-specific `rel` tokens merged in (deduplicated) rather than replacing the defaults.

`src/components/README.md` flags this component, alongside [`ShareToMastodon`](../../../../scratch/obsolete-components.md), as a social integration that should be audited for consistency and localisation in a future pass.

## Extending

To add or reorder social links, edit [`social.json`](../../../../src/content/social.json) directly; no component code changes are needed.
