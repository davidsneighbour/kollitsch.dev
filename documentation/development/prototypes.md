---
title: Prototypes
tags: []
created: 2026-09-12T00:00:00+07:00
updated: 2026-09-12T00:00:00+07:00
---

Prototype routes are committed source files for design review, but they are preview-only output.

## File layout

Place prototype routes under `src/pages/prototypes/`.

Place reusable prototype components and notes under `src/prototypes/<prototype-name>/`.

Add each prototype to the list in `src/pages/prototypes/index.astro` so `/prototypes/` stays the discovery page for preview deploys.

Each prototype route should include:

- realistic surrounding context,
- a clear way to switch variants when it is a variant picker,
- `noindex, nofollow` robots metadata,
- local run instructions in `src/prototypes/<prototype-name>/README.md`.

## Local review

Use the normal development server on an allowed temporary port:

```bash
ASTRO_DEV_BACKGROUND=0 npx astro dev --port 4401 --host 127.0.0.1 --ignore-lock
```

Then open the prototype route, for example:

```text
https://127.0.0.1:4401/prototypes/dark-heading-links/
```

Use the overview page to browse all committed prototypes:

```text
https://127.0.0.1:4401/prototypes/
```

## Build behaviour

The normal production-safe build removes prototype output:

```bash
npm run build
```

During this build, `src/scripts/build/prune-prototypes.ts` deletes `dist/prototypes/` unless `KOLLITSCH_INCLUDE_PROTOTYPES=1` is set.

Use the prototype build only when the output is for preview review:

```bash
npm run build:prototypes
```

`build:prototypes` uses the same cache-preserving build path as `npm run build`. It only sets `KOLLITSCH_INCLUDE_PROTOTYPES=1` so `dist/prototypes/` remains in the output.

## Preview deployment

Use the prototype preview command when someone outside the local workstation needs to inspect prototype routes:

```bash
npm run deploy:preview:prototypes
```

This command:

- runs a cache-preserving prototype build,
- uploads the built `dist/` directory,
- passes `--no-build` to Netlify so the CLI does not build a second time,
- uses Netlify's `deploy-preview` context,
- does not pass `--prod`,
- does not run the release workflow,
- does not clean image caches.

## Production boundary

Never deploy prototypes with a production command.

Forbidden for prototype review:

- `npm run deploy`
- `netlify deploy --prod`
- `netlify deploy --prod-if-unlocked`
- `npm run build:clean`
- `npm run clean:build-caches`

Use `npm run build:clean` only when cached generated images are known to be stale and the clean rebuild was explicitly requested.
