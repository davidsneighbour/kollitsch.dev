# Dev server HTTPS

The Astro dev server (`npm run dev:site`, part of `npm run dev`) always runs over HTTPS at
`https://localhost:4321`.

## Locally trusted certificates (recommended)

By default the dev server falls back to a self-signed certificate from
`@vitejs/plugin-basic-ssl`, which browsers treat as untrusted. That blocks or
degrades secure-context-only behaviour: secure cookies, `localStorage`/
`sessionStorage` partitioning, service workers, Web Crypto, and CSP/HSTS
header testing.

Generate a certificate trusted by the local system (and browsers) with
[mkcert](https://github.com/FiloSottile/mkcert):

```bash
npm run dev:certs
```

This installs mkcert's local certificate authority into the system trust
store (one-time, may prompt for a password) and writes
`.certs/localhost.pem` / `.certs/localhost-key.pem`. `astro.config.ts`
detects these files at startup and uses them for the dev server instead of
the self-signed fallback. `.certs/` is gitignored; each machine generates
its own.

Requires `mkcert` to be installed (`brew install mkcert`, or your platform's
package manager). If `mkcert` is unavailable, the dev server still works via
the self-signed fallback; browsers will show a certificate warning.

## CI and Playwright

CI does not run `npm run dev:certs`, so `playwright.config.ts` keeps
`ignoreHTTPSErrors: true` for the e2e `webServer` and browser context. This
setting is harmless when a trusted certificate is present and required when
it isn't, so it stays enabled everywhere.
