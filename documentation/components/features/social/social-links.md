---
title: SocialLinks
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-11-13T00:00:00+07:00
---

Renders a list of social media profile links (icon plus label) from the [social media setup](../../../content/social-setup.md). The footer no longer uses it (it renders its own ranked list); no page uses it at the moment.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/features/social/SocialLinks.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (`social` section, read through `src/data/social.ts`) |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `container` | `"ul" \| "ol" \| "div" \| "menu"` | `"ul"` | Outer container tag; each item renders as `<li>` unless `container="div"`, in which case items render as `<span>` |
| `containerClass` | `string` | `"flex flex-row flex-wrap justify-center gap-2 lg:justify-end"` | Classes applied to the container |
| `items` | `readonly SocialMediaNetwork[]` | networks with `show.footer` | Networks to render |
| `target` | `string` | `social.defaults.target` | `target` applied to every link |

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

This component has no client-side behaviour. It renders one [`IconLink`](../../shared/links/icon-link.md) per item, sized `size-6` plus the network's `classes.fill` class, with `profile.title` as the link `title`. `rel` is `social.defaults.rel` (`noopener noreferrer me`; the `me` token supports [IndieAuth-style rel=me verification](https://indieweb.org/rel-me)) merged with the network's `profile.rel` tokens, without repeats.

`src/components/README.md` flags this component, alongside [`ShareToMastodon`](../../../../scratch/obsolete-components.md), as a social integration that should be audited for consistency and localisation in a future pass.

## Extending

To add, remove, or reorder links, edit the `social` section of [`setup.json`](../../../../src/data/setup.json); see [Social media setup](../../../content/social-setup.md). No component code changes are needed.
