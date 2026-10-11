# Build, deploy, and hosting

Read this when working on the build pipeline, generated assets, environment variables, Cloudflare hosting, or deployment.

## Build pipeline

1. **Pre-build**: `npm run build:image-index` (`src/scripts/build/build-image-index.ts`) generates the LQIP image index at `src/content/_generated/image-index.json`. The normal build keeps `.cache/image-index/cache.json`; `npm run build:clean` drops this and other processed-image caches. `src/utils/opengraph.ts` resolves cover image keys against the index.
2. **Astro build hooks** (`src/scripts/build/build-hooks.ts`) run as Astro integrations:
   - `generateFeedsIntegration`: FreshRSS-gated RSS feeds on `astro:build:start`.
   - `generateHeadersIntegration`: writes `dist/_headers` on `astro:build:done` from the rules in `src/data/headers.ts`. `Expires` is build time plus one year. Do not edit `dist/_headers`; `public/_headers` is gitignored.
   - `pagefindIntegration` (`src/scripts/build/integrations/pagefind.ts`): Pagefind search index on `astro:build:done`.
3. **Build**: `npm run build` is orchestrated by `wireit` and runs `astro check` before `astro build`.

Do not run `npm run build` in sandboxed environments without API tokens. The pre-build step can fail there; use `npm run check` for type checking.

## Social (OG) images

OG images are pre-generated, not rendered at request time. `npm run build:ogimages` (`src/scripts/build/build-og-images.ts`; `--force`, `--check`, `--file=`) renders through `satori-html`, Satori, Resvg, and Sharp (`src/utils/social-image/*`) into Git-tracked files under `public/images/social/blog/<year>/<slug>.jpg`, plus `public/images/social/default.jpg`. `OpenGraphImage.astro` only resolves the static path and falls back to the default image. lint-staged regenerates images for staged blog posts. See `documentation/development/build-cache.md`.

## Environment variables

Set in `.env` (gitignored):

| Variable | Required for |
| --- | --- |
| `YOUTUBE_API_KEY` | YouTube-related build scripts; use `fake_key_for_testing` for local development |
| `FRESHRSS_BASE_URL`, `FRESHRSS_USERNAME`, `FRESHRSS_API_PASSWORD` | RSS follower feed generation in `build-hooks.ts` |
| `GH_TOKEN` / `GITHUB_TOKEN` | GitHub release and repository scripts |

Worker secrets (`RESEND_API_KEY`, `RESEND_FROM`, `RESEND_TO`) are declared in `wrangler.jsonc` and set in Cloudflare.

## Cloudflare hosting

- `wrangler.jsonc` configures the `kollitsch-dev` Worker (`src/worker.ts`) with Static Assets from `dist/`.
- `assets.html_handling = "auto-trailing-slash"` keeps Astro's directory-style URLs.
- `assets.run_worker_first` is `true`: the Worker sees every request, redirects `www.kollitsch.dev` to `kollitsch.dev` (301), handles `/api/send-email`, and passes everything else to the `ASSETS` binding.
- Cloudflare DNS hosts the zone. Keep `kollitsch.dev` and `www.kollitsch.dev` attached to the Worker through Cloudflare Domains & Routes, so routine deploys do not reconcile DNS.
- Cloudflare provides agent-readable documentation at [https://developers.cloudflare.com/docs-for-agents/](https://developers.cloudflare.com/docs-for-agents/). Use the installed Cloudflare skills for hosting tasks.

## Deployment

Deployment is local-first with Wrangler, not GitHub Actions. From a workstation authenticated with Cloudflare:

- `npm run deploy:preview`: upload a non-production Worker version preview.
- `npm run deploy:dry-run`: build, preflight, and dry-run the deploy.
- `npm run deploy`: build, preflight, and deploy.
- `npm run hosting:check`: verify `dist/` against Cloudflare Static Assets limits.

## GitHub Actions workflows

None of these deploy or run on push:

- `check-youtube-videos.yml`: weekly liveness check of referenced YouTube/Vimeo ids; files or updates a tracking issue on failure.
- `lighthouse.yml`: daily Lighthouse audit of the live site.
- `live-tests.yml`: manual Playwright smoke tests against the live site (`npm run test:live`).
- `screenshot.yml`: weekly homepage screenshot commit.
- `update-issues.yml`: removes a fixed list of labels when an issue is closed.
