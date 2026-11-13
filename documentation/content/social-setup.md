---
title: Social media setup
tags: []
created: 2026-11-13T00:00:00+07:00
updated: 2026-11-13T00:00:00+07:00
---

All social media configuration is in the `social` section of [`src/data/setup.json`](../../src/data/setup.json). No other file holds profile URLs, handles, share templates, or brand classes.

## Where the networks appear

| Placement (`show` key) | Where | Links to |
| --- | --- | --- |
| `footer` | Footer "Connect" column ([`SocialLinks`](../components/features/social/social-links.md)) | profile |
| `connect` | `/connect/` page list ([`SocialProfileList`](../components/features/social/social-profile-list.md)) | profile |
| `shareBar` | Share button row below each post ([`ShareSeparator`](../components/content/metadata/share-separator.md)) | share intent |
| `shareMeta` | "Share:" row in the post meta block ([`Share`](../components/content/metadata/share.md)) | share intent |
| `socialspec` | `/.well-known/about.md` and `/.well-known/contact.vcf` ([SocialSpec](socialspec.md)) | profile |

Each placement lists the networks in the order of the `networks` array.

The Mastodon entry has two more uses:

* `src/components/layout/head/Meta.astro` publishes its `profile.handle` as the `fediverse:creator` meta tag.
* `src/pages/.well-known/webfinger.ts` builds the WebFinger response from its `profile.handle` and `profile.url`. The avatar link points to the site avatar `/.well-known/avatar`.

## Structure

```json
{
  "social": {
    "defaults": {
      "rel": ["noopener", "noreferrer", "me"],
      "target": "_blank"
    },
    "networks": [
      {
        "id": "bluesky",
        "label": "Bluesky",
        "icon": "simple-icons:bluesky",
        "profile": {
          "url": "https://bsky.app/profile/davidsneighbour.dev",
          "handle": "@davidsneighbour.dev",
          "title": "Follow me on Bluesky",
          "rel": ["atproto"]
        },
        "share": {
          "url": "https://bsky.app/intent/compose?text={title}%20{url}"
        },
        "classes": {
          "fill": "hover:text-[#0085ff]",
          "background": "group-hover:bg-[#0085ff]/10 hover:bg-[#0085ff]/20 hover:shadow-[#0085ff]"
        },
        "show": {
          "footer": true,
          "connect": true,
          "shareBar": true,
          "shareMeta": false,
          "socialspec": true
        }
      }
    ]
  }
}
```

## Fields

Every network entry has every field. Use `null`, an empty string, an empty array, or `false` to switch a feature off; do not leave a field out.

| Field | Type | Description |
| --- | --- | --- |
| `social.defaults.rel` | `string[]` | `rel` tokens on every profile link. `me` supports [rel=me verification](https://indieweb.org/rel-me). |
| `social.defaults.target` | `string` | `target` on every profile link. |
| `id` | `string` | Unique id, lowercase `a-z`, `0-9`, and `-`. Code looks up networks by id (for example `mastodon`). |
| `label` | `string` | Network name as shown to visitors. |
| `icon` | `string` | Icon name from the registry in `src/utils/icon-names.ts`. |
| `profile.url` | `string` | Profile URL, or a site path for a contact channel (`email` uses `/connect/`). |
| `profile.handle` | `string` or `null` | Account name as shown on the network. Mastodon needs the full `@user@host` form. `null` if there is no handle. |
| `profile.title` | `string` | Short call to action. Used as the link `title` in the footer and as the description on `/connect/`. |
| `profile.rel` | `string[]` | Extra `rel` tokens, merged with `social.defaults.rel`. |
| `share` | object or `null` | Share intent. `null` if the network has no share intent. |
| `share.url` | `string` | Share URL template. Placeholders: `{url}`, `{title}`, `{description}`. Each value is URL-encoded. |
| `classes.fill` | `string` | Tailwind classes for the icon colour on hover. Empty string for none. |
| `classes.background` | `string` | Tailwind classes for the share button background. Empty string for none. |
| `show.footer`, `show.connect`, `show.shareBar`, `show.shareMeta`, `show.socialspec` | `boolean` | Placements, see the table above. |

The brand colours in `classes` are full Tailwind class strings, so Tailwind finds them when it scans `setup.json`. Do not build these classes from parts in code.

## Rules

* Never publish an email address. The `email` entry links to `/connect/`, and its share template is an address-less `mailto:?subject=...` link.
* `show.shareBar` and `show.shareMeta` need a `share` object.
* Discord links to the server invite, because Discord profile links need a numeric user ID. The `profile.title` tells visitors to look up the handle on the server.

`validateSocialConfig()` in [`src/utils/social.pure.ts`](../../src/utils/social.pure.ts) checks these rules when the config loads, so a broken entry fails the build. [`src/data/social.test.ts`](../../src/data/social.test.ts) checks that all entries have the same keys, that the icons exist, and that no email address is in the config.

## Code

* [`src/data/social.ts`](../../src/data/social.ts) loads and validates the config. Use `socialNetworksFor(placement)` and `getSocialNetwork(id)`; do not import the JSON for social data.
* [`src/utils/social.pure.ts`](../../src/utils/social.pure.ts) has the types and pure helpers: `buildShareUrl()`, `mergeRel()`, `parseFediverseHandle()`, `buildWebfinger()`.

## Add or change a network

1. Add or edit the entry in `social.networks` with all fields.
2. If the icon is new, register it in `src/utils/icon-names.ts`.
3. Run `npx vitest run src/data/social.test.ts src/utils/social.pure.test.ts`.
