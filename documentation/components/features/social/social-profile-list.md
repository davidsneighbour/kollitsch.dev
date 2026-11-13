---
title: SocialProfileList
tags: []
created: 2026-11-13T00:00:00+07:00
updated: 2026-11-13T00:00:00+07:00
---

Renders the list of social media profiles on the `/connect/` page, with each network's handle and call to action from the [social media setup](../../../content/social-setup.md).

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/features/social/SocialProfileList.astro` |
| Data | [`src/data/setup.json`](../../../../src/data/setup.json) (`social` section, networks with `show.connect`) |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `readonly SocialMediaNetwork[]` | networks with `show.connect` | Networks to list |
| `class` | `string` | `""` | Extra classes for the `<ul>` |

## Usage

```astro
---
import SocialProfileList from '@components/features/social/SocialProfileList.astro';
---

<SocialProfileList />
```

## Behaviour

This component has no client-side behaviour. It renders one list item per network: an [`IconLink`](../../shared/links/icon-link.md) to `profile.url` with the text `label: handle` (or only `label` when `profile.handle` is `null`), and `profile.title` as a short description below it. Links use `social.defaults.target` and `social.defaults.rel` merged with `profile.rel`. `src/layouts/ContentPageConnect.astro` renders it below the page content.
