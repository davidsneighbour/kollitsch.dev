# Live site smoke tests

Playwright specs under `src/test/live/` run against the deployed production
site (`https://kollitsch.dev` by default, or `PLAYWRIGHT_LIVE_BASE_URL`) to
catch regressions visitors would otherwise notice first. They are excluded
from the default `test:e2e` run (`playwright.config.ts`'s `testIgnore`) and
have their own config, script, and CI workflow so they never block a PR.

Run locally:

```bash
npm run test:live
```

Run in CI: the `Live site smoke tests` workflow (`.github/workflows/live-tests.yml`)
is `workflow_dispatch`-only—trigger it manually from the Actions tab. It does
not run on push or a schedule, since a live-site failure can be caused by
factors outside this repository (CDN, DNS, third-party embeds) and isn't
actionable the way a PR-blocking check should be.

## Coverage

| File | Checks |
| --- | --- |
| `live-site.spec.ts` | robots.txt directives, homepage loads without console/page errors, Matomo initialises |
| `critical-pages.spec.ts` | `/about/`, `/connect/`, `/uses/` respond 200 |
| `pagefind-search.spec.ts` | the `/find/` search overlay returns results (Pagefind's index only exists post-build, so this can't run against the local dev server) |
| `link-crawl.spec.ts` | every internal (same-origin) link in primary nav and the footer resolves without a 4xx/5xx |
| `structured-data.spec.ts` | a live blog post page includes a valid `BlogPosting` JSON-LD block |
| `accessibility.spec.ts` | axe-core (WCAG 2.1 AA) on `/`, `/blog/`, `/connect/`, `/find/` |

`src/test/contact-form.spec.ts` (a regular, non-live e2e spec) covers the
contact form's success/error UI states via `ContentPageConnect.astro`'s
dev-only `?scenario=` simulator, which intercepts submit and never reaches the
network—the form posts to a Netlify function backed by the Resend REST API
(`src/netlify/functions/send-email.ts`), so a live test that actually submits
it would send a real email.

## Deliberately not covered here

- **Web Vitals / synthetic timing**—already covered by the daily Lighthouse
  audit (`.github/workflows/lighthouse.yml`, `src/scripts/linting/lighthouse-*.ts`).
- **Sitemap integrity**—already covered by `npm run lint:sitemap`
  (`src/scripts/linting/verify-sitemap.ts`).
- **Matomo consent opt-out**—no consent-toggle UI exists on this site to test.
- **Service worker registration**—this site does not register a service worker.

## Known accessibility exclusions

`accessibility.spec.ts` disables the `color-contrast` rule and excludes one
specific post's cover-image link, both tracked by
[#1835](https://github.com/davidsneighbour/kollitsch.dev/issues/1835)—
pre-existing, sitewide colour-contrast debt and one post missing `cover.alt`.
Remove both exclusions once that issue is resolved so the full WCAG 2.1 AA
ruleset applies again.
