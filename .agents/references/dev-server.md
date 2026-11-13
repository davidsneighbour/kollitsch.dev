# Dev server

Read this before you start, use, or stop the Astro dev server or any other local HTTP server. `AGENTS.md` makes this procedure mandatory.

## Ports

- Port `4321` is the Astro dev server.
- Other preview servers, Playwright `webServer` processes, and temporary HTTP servers use a port from `4400` to `4499`.

## Lifecycle

AI assistants own the full Astro dev-server lifecycle for every task that needs it and MUST NOT leave it running. Starting such a task is explicit authorisation to stop any existing Astro dev server, including one the user started.

Every time:

1. Run `npx astro dev stop`.
2. Start with `npx astro dev --background`.
3. Do the work. Use `npx astro dev status` and `npx astro dev logs` when needed.
4. Run `npx astro dev stop` again.

Stopping a pre-existing server is expected cleanup: do not apologise or draw attention to it; "Stopped existing dev server." is enough.
