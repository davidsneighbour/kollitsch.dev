---
applyTo: "public/assets/styles/**/*.css"
---

# Giscus theme CSS: must-deploy-before-test

## Why these files can't be verified locally

`src/components/features/comments/Giscus.astro` always points Giscus at the
**production** URL for its theme stylesheets
(`https://kollitsch.dev/assets/styles/giscus-{light,dark}.css`), even when the
site itself is running on a local dev server. This is not a bug or an
oversight: the Giscus iframe is served from `giscus.app` (a different
origin), and it cannot reach a LAN/localhost dev origin to fetch a theme
file from there.

The practical consequence: **editing a file under `public/assets/styles/`
changes nothing a browser can see until that file is deployed to
`kollitsch.dev`.** Running `npm run dev` and reloading the page will not
show the new colors—the comment widget is still pulling the old, live file
over the network, not the one just edited on disk. Clearing the browser
cache does not help either; the stale copy being served is the production
file itself, not a cached local response.

## The cache-busting contract

Giscus (running on `giscus.app`) also caches the theme stylesheet
cross-origin, keyed by URL. `Giscus.astro` works around this with a
`themeVersion` query-string constant:

```ts
const themeVersion = '4';
const themeLight = `https://kollitsch.dev/assets/styles/giscus-light.css?v=${themeVersion}`;
const themeDark = `https://kollitsch.dev/assets/styles/giscus-dark.css?v=${themeVersion}`;
```

**Whenever a file under `public/assets/styles/giscus-*.css` changes content,
bump `themeVersion` in `Giscus.astro` in the same change.** Without a version
bump, `giscus.app` may keep serving its own cached copy of the old CSS under
the old URL indefinitely, even after the new file is live on
`kollitsch.dev` — this looks identical to "the fix didn't work," but is
purely a stale cross-origin cache.

## What to tell the user

If asked to fix a color/style issue in one of these files, make the edit,
then say explicitly that the result **cannot be verified until the branch is
deployed** — do not attempt to "debug" the live behavior locally as if it
were a normal Astro component; there is nothing broken to find until the
file is actually live. Confirm the `themeVersion` bump was made in the same
change.

## Faking a local test (optional, cheap fallback)

A live-ish preview is possible without a real deploy, because the theme
stylesheet is fetched by the *visitor's own browser* (client-side, via a
`<link>` tag Giscus inserts inside its iframe), not fetched server-side by
giscus.app. That means a `postMessage` pointed at a reachable dev-server URL
should work, since it's the browser—not giscus.app's backend—doing the
fetch:

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

This mirrors exactly what `DnbGiscus.syncTheme()` already does in
`Giscus.astro`, just pointed at the dev server instead of production. It
only works if the browser running the test can actually resolve
`localhost:4321` — fine for a human testing locally, but not reachable by an
agent's own sandboxed browser tooling (Playwright/Chrome DevTools MCP)
unless the dev server and the browser session are on the same host and the
port is reachable from it. Treat this as a quick manual sanity check to hand
to the user, not a substitute for actually confirming behavior after
deploy — reserve real verification (via Chrome DevTools MCP/Playwright) for
after `themeVersion` and the CSS are live.
