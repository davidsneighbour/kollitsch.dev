---
title: ShareIntentLink
tags: []
created: 2026-11-14T17:00:00+07:00
updated: 2026-11-14T17:00:00+07:00
---

Renders a configured share link with optional click-triggered server selection for federated networks.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/features/social/ShareIntentLink.astro` |
| Data | `src/data/setup.json`, through `src/data/social.ts` |
| Tests | `src/components/features/social/ShareIntentLink.test.ts`, `src/components/features/social/ShareIntentClient.test.ts`, `src/components/content/metadata/ShareSeparator.test.ts`, and `src/test/features/social/share-intent.spec.ts` |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `share` | `SocialShare` | required | URL template and optional instance settings. |
| `values` | `ShareValues` | required | Shared title, description, and URL. |
| `icon` | `IconName` | none | Optional icon, rendered through the shared icon-link component. |
| Other attributes | `HTMLAttributes<'a'>` | none | Classes and standard anchor attributes. |

## Usage

```astro
---
import ShareIntentLink from '@components/features/social/ShareIntentLink.astro';
import { getSocialNetwork } from '@data/social.ts';
const network = getSocialNetwork('mastodon');
---

<ShareIntentLink share={network.share!} values={{ title: 'Example', url: Astro.url.toString() }}>
  Share to Mastodon
</ShareIntentLink>
```

## Behaviour

The default slot supplies the visible or accessible link label. Static destinations are rendered on the server. Instance-aware links carry a valid fallback URL and a small delegated click listener. The optional handler is dynamically imported only after activation, then reads the saved server and opens a native prompt with that value pre-filled. Visitors can change or cancel their choice. A valid domain is saved under the configured key and used with the shared URL builder. Blocked local storage does not prevent sharing, and blocked popups fall back to the current tab. No server lists, probes, or preference reads run on page load or scroll. See [Social media setup](../../../content/social-setup.md#instance-aware-sharing).
