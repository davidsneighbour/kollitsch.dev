---
title: Deployment
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-09-13T00:00:00+07:00
---

KOLLITSCH.dev deploys from a local workstation to Cloudflare Workers Static Assets with Wrangler. GitHub Actions validate the project, but they do not deploy it.

## When to reuse this pattern

This site is the reference implementation for hosting an ordinary Astro static site directly on Cloudflare Workers Static Assets, without a separate origin server. Good candidates share its shape: static-site output, a small and slow-growing page count, and no requirement for a persistent filesystem or long-running server process. `hosting:check` (see [Preflight](#preflight)) keeps the asset-count headroom visible so this stays a deliberate decision rather than an assumption.

This differs from the pattern used for larger, long-running archive sites such as `samui-samui.de`, which keep a DreamHost static origin behind Cloudflare's cache (with a Cloudflare Worker handling only `/api/*`) because their output is too large or too actively rewritten to redeploy the whole tree through Wrangler on every change. Reach for that pattern instead of this one when the generated output approaches the Workers Static Assets file-count ceiling, or when the site needs a conventional filesystem/origin.

Extending this pattern with an API works the same way it already does here: `kollitsch-dev` sets `assets.run_worker_first` to `true` in [`wrangler.jsonc`](../../wrangler.jsonc) because the Worker needs to inspect the hostname of every request to redirect `www` to the apex domain, and the same Worker also handles `/api/send-email`. A site with no host-based redirect should instead scope `run_worker_first` to an array of path patterns (for example `["/api/*"]`), so ordinary static requests skip the Worker entirely and are served directly from `assets.directory`.

## Hosting target

The production Worker is configured in [`wrangler.jsonc`](../../wrangler.jsonc):

- `assets.directory` points at `./dist/`, the Astro static output directory.
- `assets.html_handling` is `auto-trailing-slash`, matching Astro's directory-style output.
- `assets.not_found_handling` is `404-page`, so Cloudflare serves the generated `404.html` for missing assets.
- `assets.run_worker_first` is enabled, so the Worker can redirect `www.kollitsch.dev` requests before handing ordinary static page and asset requests to the `ASSETS` binding.

Cloudflare DNS is already the zone authority. The canonical hostname remains the apex domain, `kollitsch.dev`, but the default local deploy does not update custom-domain routes or DNS records. Attach the Worker to the apex hostname separately in Cloudflare once the upload path is known-good.

The `www` hostname is attached to the same Worker as the apex hostname. The Worker redirects `https://www.kollitsch.dev/*` to `https://kollitsch.dev/*` with a permanent redirect while preserving the path and query string.

## Required local setup

Install dependencies and authenticate Wrangler on the deploying machine:

```bash
npm install
npx wrangler login
```

Set the Worker secrets before the first production deploy and whenever a value changes:

```bash
WRANGLER_LOG_PATH=.cache/wrangler npx wrangler secret put RESEND_API_KEY
WRANGLER_LOG_PATH=.cache/wrangler npx wrangler secret put RESEND_FROM
WRANGLER_LOG_PATH=.cache/wrangler npx wrangler secret put RESEND_TO
```

`WRANGLER_LOG_PATH=.cache/wrangler` keeps Wrangler logs inside the repository cache path instead of the user-level config directory, which is useful in sandboxed or restricted shells.

## Preflight

Run the hosting preflight after a build:

```bash
npm run build
npm run hosting:check
```

The preflight reports regular files, directories, Wrangler-style upload entries, total `dist/` size, largest asset, static asset size failures, `_headers` rule and line-length failures, and `_redirects` count and line-length failures.

The checked Cloudflare limits are the Workers Static Assets limits documented on 2026-09-13: 20,000 files per Worker version on the Free plan, 100,000 files on paid plans, 25 MiB per static asset, 100 `_headers` rules, 2,000 characters per `_headers` line, 2,000 static redirects, 100 dynamic redirects, and 1,000 characters per `_redirects` line.

## Preview deployment

Use the preview command for test deploys:

```bash
npm run deploy:preview
```

This runs the normal cache-preserving build, runs the hosting preflight, and uploads a Worker version with the `preview` alias. It does not update the production custom domain.

Prototype routes use a stricter preview-only path:

```bash
npm run deploy:preview:prototypes
```

This keeps `dist/prototypes/` in the built output, runs the hosting preflight, and uploads a Worker version with the `prototypes` alias. Normal builds and production deploys remove prototype output. See [Prototypes](../development/prototypes.md) for the full workflow.

## Production deployment

Production deployment is local and explicit:

```bash
npm run deploy
```

`npm run deploy` runs the deployment pipeline in this order:

1. `npm run check`
2. `npm run build`
3. `npm run hosting:check`
4. `wrangler deploy`

The final Wrangler command only runs after the local checks, production build, and Cloudflare hosting preflight have completed successfully.

Run a dry run before the first cutover, after Wrangler upgrades, and before risky hosting changes:

```bash
npm run deploy:dry-run
```

The top-level deploy scripts wrap their Wireit-owned pipeline commands with `src/scripts/maintenance/timed-run.ts`, so the final output includes elapsed time for the whole deployment pipeline.

## Production domain cutover

`npm run deploy` intentionally leaves the production domain configuration alone. This keeps repeat local deploys focused on the Worker and Static Assets upload, and avoids re-running Cloudflare's custom-domain DNS reconciliation on every deploy.

After the first successful upload, attach `kollitsch.dev` and `www.kollitsch.dev` to the `kollitsch-dev` Worker in the Cloudflare dashboard under Workers & Pages → `kollitsch-dev` → Settings → Domains & Routes, or run a one-time Wrangler deploy with custom-domain flags:

```bash
WRANGLER_LOG_PATH=.cache/wrangler npx wrangler deploy --domain kollitsch.dev --domain www.kollitsch.dev
```

If Wrangler logs show `Uploaded kollitsch-dev` and then stop or fail while calling a `domains/records` endpoint, the Worker upload has completed and only the domain route update needs attention in Cloudflare.

## Rollback

Use Cloudflare's Worker version rollback in the dashboard or with Wrangler if a production deploy needs to be reverted. Keep the `legacy/netlify-hosted` branch as the pre-migration source snapshot until the Cloudflare deployment has been stable for long enough that the old Netlify configuration is no longer needed.

## Post-deploy checks

After production deployment, verify:

- `https://kollitsch.dev/` returns `200` from Cloudflare.
- `https://www.kollitsch.dev/` redirects to `https://kollitsch.dev/`.
- `https://kollitsch.dev/about` redirects to `https://kollitsch.dev/about/`.
- `https://kollitsch.dev/404-test-for-hosting` returns the generated 404 page with a `404` status.
- `https://kollitsch.dev/api/send-email` returns `405` for `GET`, confirming the contact endpoint is routed to the Worker.
- `npm run test:live` passes against the production URL.

`npm run build` preserves local processed-image caches. Use `npm run build:clean` only when Astro image output, generated OG images, or the image-index LQIP cache must be rebuilt from source.
