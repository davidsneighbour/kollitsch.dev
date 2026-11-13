---
title: Giscus
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-11-13T00:00:00+07:00
---

Lazy-loaded [Giscus](https://giscus.app/) comments widget for a blog post, loaded only once it scrolls near the viewport, and kept in sync with the site's light/dark theme toggle.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/features/comments/Giscus.astro` |
| Data | none |
| Tests | [`src/components/features/comments/Giscus.test.ts`](../../../../src/components/features/comments/Giscus.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | Supplies the discussion `term` (`post.data.title` or `post.id`) |
| `repo` | `string` | `"davidsneighbour/kollitsch.dev"` | Giscus repository |
| `repoId` | `string` | (fixed default) | Giscus repository id |
| `category` | `string` | `"Comments"` | Discussion category |
| `categoryId` | `string` | (fixed default) | Discussion category id |
| `lang` | `string` | `"en"` | Giscus UI language |
| `mapping` | `"pathname" \| "url" \| "title" \| "og:title" \| "specific"` | `"specific"` | How Giscus maps the page to a discussion |
| `reactionsEnabled` | `"0" \| "1"` | `"1"` | Whether reactions are shown |
| `emitMetadata` | `"0" \| "1"` | `"0"` | Whether Giscus emits discussion metadata via `postMessage` |
| `inputPosition` | `"top" \| "bottom"` | `"bottom"` | Where the comment box appears relative to existing comments |

## Usage

```astro
---
import Giscus from '@components/features/comments/Giscus.astro';
---

<Giscus post={post} />
```

## Behaviour

Renders a `<dnb-giscus>` custom element carrying its configuration as `data-*` attributes, including two theme stylesheet URLs (`giscus-light.css`/`giscus-dark.css`, always the production `kollitsch.dev` URL, since `giscus.app` fetches the theme cross-origin and cannot reach a LAN dev origin; bump the `themeVersion` constant when the theme CSS changes, to bust `giscus.app`'s own HTTP cache).

The `dnb-giscus` custom element (registered once, guarded by `customElements.get`):

- Uses a shared `IntersectionObserver` (rootMargin `200px` below viewport) to defer loading the real Giscus `<script>` until the widget is about to scroll into view. Safe to include multiple times per page — each instance loads independently and only once (`data-initialised` guard).
- Builds the Giscus client script's attributes from its own `data-*` attributes, validates that the required ones (`data-repo`, `data-repo-id`, `data-category`, `data-category-id`, `data-mapping`) are present, and logs (rather than throws) if any are missing.
- Listens for the site's `theme-changed` event (dispatched by [`ThemeSelector`](../../layout/header/theme/theme-selector.md)) and, once the Giscus iframe has loaded, pushes the resolved theme to it via `postMessage({ giscus: { setConfig: { theme } } })` targeted at `https://giscus.app`, so the comment widget follows the site's live theme toggle without a full reload.
- Re-observes any not-yet-initialised `dnb-giscus` elements on `astro:page-load`, so the lazy-load behaviour survives view-transition navigations.

## Theme stylesheet changes

The theme stylesheets live in `public/assets/styles/giscus-light.css` and `public/assets/styles/giscus-dark.css`. The Giscus iframe is served from `giscus.app`, a different origin, and it cannot reach a LAN or localhost dev origin. For that reason, `Giscus.astro` always points Giscus at the production URLs (`https://kollitsch.dev/assets/styles/giscus-{light,dark}.css`), also on a local dev server.

An edit to one of these files therefore changes nothing a browser can see until the file is deployed to `kollitsch.dev`. Reloading the local dev server does not show the change, and clearing the browser cache does not help: the stale copy is the live production file.

`giscus.app` also caches the theme stylesheet cross-origin, keyed by URL. `Giscus.astro` adds a `themeVersion` query string to both URLs:

```ts
const themeVersion = '<n>'; // current value: see Giscus.astro
const themeLight = `https://kollitsch.dev/assets/styles/giscus-light.css?v=${themeVersion}`;
const themeDark = `https://kollitsch.dev/assets/styles/giscus-dark.css?v=${themeVersion}`;
```

Bump `themeVersion` in the same change as every content change to a `giscus-*.css` file. Without the bump, `giscus.app` can serve its cached copy of the old CSS under the old URL indefinitely, even after the new file is live. This looks the same as a fix that did not work.

### Local preview before a deploy

The visitor's own browser fetches the theme stylesheet (Giscus inserts a `<link>` inside its iframe), not the `giscus.app` server. A `postMessage` that points at a reachable dev-server URL can therefore show a local preview:

```js
document
  .querySelector('iframe.giscus-frame')
  ?.contentWindow?.postMessage(
    {
      giscus: {
        setConfig: {
          theme: 'http://localhost:4321/assets/styles/giscus-light.css',
        },
      },
    },
    'https://giscus.app',
  );
```

This is the same call that `DnbGiscus.syncTheme()` makes in `Giscus.astro`, pointed at the dev server instead of production. It works only when the browser can resolve `localhost:4321`. That is normally true for a person who tests locally, but often not for an agent's sandboxed browser tools (Playwright or Chrome DevTools MCP). Use it as a quick manual check, not as a replacement for verification after the deploy.
