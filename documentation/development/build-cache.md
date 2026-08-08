# Build Cache

The normal production build is cache-preserving:

```bash
npm run build
```

It runs the image-index prebuild, `astro check`, `astro build`, removes the generated `dist/test/` route output, and refreshes API documentation. It does not delete `.astro`, `node_modules/.astro`, `.cache/og_image`, `.cache/image-index`, or `public/og_image`.

Use the clean build only when processed image output must be regenerated from source:

```bash
npm run build:clean
```

This first deletes `.astro`, `node_modules/.astro`, `public/og_image`, `.cache/og_image`, and `.cache/image-index`, then runs the normal build.

`npm run build:image-index` writes `src/content/_generated/image-index.json`. The script scans `src/assets/images/` and merges Frontmatter CMS metadata from `.frontmatter/database/mediaDb.json`. Expensive per-image work, including dimension reads and LQIP generation, is cached in `.cache/image-index/cache.json` and reused while the source image size, modified time, format, and requested LQIP width are unchanged.
