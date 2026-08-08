---
title: Deployment
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

## Production Deployment

Production deployment is orchestrated through `wireit` in `package.json`.

`npm run deploy` runs the deployment pipeline in this order:

1. `npm run check`
2. `npm run release`
3. `npm run build`
4. `netlify deploy --prod --open`

The final Netlify command only runs after the local checks, release step, and
production build have completed successfully.

`npm run build` preserves local processed-image caches. Use
`npm run build:clean` only when Astro image output, generated OG images, or the
image-index LQIP cache must be rebuilt from source.
