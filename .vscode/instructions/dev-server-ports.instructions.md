---
applyTo: "**"
---

# Dev server port policy

Port **4321** is reserved exclusively for the Astro dev server managed by
`npm run dev:watch` (`src/scripts/webserver.ts`). The script kills any
existing occupant of 4321 on startup and after every restart so the dev
server is always reachable at the same address.

**Do not bind anything to port 4321.**

This includes:

* Preview servers (`astro preview`, `npm run preview`)
* Playwright `webServer` blocks (already configured to reuse 4321 if it
  exists, or to start on a different port in CI)
* Any ad-hoc HTTP servers an agent spins up to serve build output for
  inspection

When you need a temporary HTTP server for testing or verification, use a
port in the range **4400–4499**. For example:

```bash
npx serve dist --listen 4400
npx http-server dist -p 4401
python3 -m http.server 4402 --directory dist
```

These ports are not claimed by any project service and will not conflict
with the dev server.
