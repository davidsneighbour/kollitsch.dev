# Build Cache

The normal production build is cache-preserving:

```bash
npm run build
```

It runs the image-index prebuild, `astro check`, `astro build`, removes the generated `dist/test/` route output, and refreshes API documentation. During `astro build`, the `dnb-prune-image-assets` integration removes image files in `dist/assets/` that are not referenced by any generated text output, so source originals emitted while creating responsive variants are not uploaded to Cloudflare. It does not delete `.astro`, `node_modules/.astro`, `.cache/image-index`, or `.cache/social-images`. Social/OG image generation is **not** part of the normal build — see "Social/OG images" below.

Use the clean build only when processed image output must be regenerated from source:

```bash
npm run build:clean
```

This first deletes `.astro`, `node_modules/.astro`, `.cache/image-index`, and `.cache/social-images`, then runs the normal build. `.cache/social-images` only holds the fingerprint manifest — deleting it makes the next `build:ogimages` run treat every image as needing a fingerprint recheck (it still won't rewrite files whose current fingerprint matches what gets recomputed).

`npm run build:image-index` writes `src/content/_generated/image-index.json`. The script scans `src/assets/images/` and merges Frontmatter CMS metadata from `.frontmatter/database/mediaDb.json`. Expensive per-image work, including dimension reads and LQIP generation, is cached in `.cache/image-index/cache.json` and reused while the source image size, modified time, format, and requested LQIP width are unchanged.

## Social/OG images

Blog post social/OG images live under `public/images/social/blog/<year>/<slug>.jpg`, plus a single `public/images/social/default.jpg` fallback — all tracked in Git, deterministic filenames, no content hashes. They are **pre-generated**, not built during `astro build` or rendered on demand in `astro dev`; see [OpenGraphImage.astro](../components/layout/head/open-graph-image.md) for how pages resolve them at request time.

Generate/update them with:

```bash
npm run build:ogimages                              # incremental: missing/stale only, prunes orphans
npm run build:ogimages -- --force                    # regenerate everything unconditionally
npm run build:ogimages -- --check                    # validate only, no writes; non-zero exit on problems
npm run build:ogimages -- --file="src/content/blog/2026/example/index.md"  # one or more specific posts
```

`--check` is wired into `npm run check` (via the `check:ogimages` wireit task), so a CI run that calls `npm run check` catches missing/stale/orphaned social images.

Staleness is tracked in a fingerprint manifest at `.cache/social-images/manifest.json` (not tracked in Git) rather than in the filename, since filenames are deterministic. The fingerprint covers title, publish/modified date, resolved background image, dimensions, format, and a `TEMPLATE_VERSION` constant in `src/utils/social-image/template.ts` — bump that constant after any visual change to invalidate every existing image.

lint-staged runs `build-og-images.ts --file=<staged post>` for staged `src/content/blog/**/*.{md,mdx}` changes and stages the resulting image additions/deletions (`git add public/images/social`) so the image ships in the same commit as the content change — including cleanup when a post is renamed or deleted.
