---
title: NotFoundLayout
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders the full-viewport 404 "Page not found" screen, with a background image, navigation links, and Matomo tracking for the miss.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/pages/NotFoundLayout.astro` |
| Data | none |
| Tests | none |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `backgroundSrc` | `string` | required | URL used as the full-bleed `background-image` |

## Usage

```astro
---
import NotFoundLayout from '@components/pages/NotFoundLayout.astro';
---

<NotFoundLayout backgroundSrc="/assets/images/404-background.jpg" />
```

## Behaviour

Renders a full-viewport (`height: 100vh`) section with a large "404" heading over the background image, an explanatory message, and three [`IconLink`](../shared/links/icon-link.md) navigation options: Go Back (`history.back()`), Home, and Contact Us. An inline `<script>` pushes a Matomo `trackEvent` (category `"Issue"`, action `"404 - Not Found"`, name is the current pathname) and sets a `404` custom dimension, both on initial load and once per view-transition navigation into a 404 route (via a one-time `astro:after-swap` listener).
