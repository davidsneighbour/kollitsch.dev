# Dev server

Read this before you start, use, restart, or stop the Astro dev server or any other local HTTP server. `AGENTS.md` makes this procedure mandatory.

## Ports and address

- Port `4321` is the Astro dev server. Port `4322` is the documentation server.
- The dev server binds to `192.168.1.201` (`server.host` in `astro.config.ts`), not to `localhost`. Send requests to `https://192.168.1.201:4321/`.
- Other preview servers, Playwright `webServer` processes, and temporary HTTP servers use a port from `4400` to `4499`.

## Find out what is running

Check the port, not only `npx astro dev status`. That command knows only servers started with `--background`; it does not see the server that `npm run dev` runs.

```bash
ss -ltnp 'sport = :4321'
```

A `LISTEN` line means a server runs; only the header line means none does. The exit code is `0` in both cases. Remember the result, because the end of the task depends on it.

## Lifecycle

### A server already runs on 4321

1. Use it for the work. Do not stop it, and do not start a second Astro dev server, because Astro then moves to the next free port (`4322` belongs to the documentation server).
2. Restart it only when the work needs a restart, for example after a change to `astro.config.ts`, `package.json`, or `.env`, or when the server shows stale state:
   - Server from `npm run dev` (`src/scripts/webserver.ts`): run `touch RESTART`. The supervisor restarts the Astro and documentation servers within a few seconds. Wait until port `4321` listens again. For stale Vite state, run `npm run clean:dev-cache` first.
   - Server that `npx astro dev status` reports: run `npx astro dev stop`, then `npx astro dev --background`.
3. Leave it running when the work is done.

### No server runs on 4321

1. Start one with `npx astro dev --background`.
2. Do the work. Use `npx astro dev status` and `npx astro dev logs` when needed.
3. Stop it with `npx astro dev stop`.

### A separate server for the task

When the work needs its own server (for example `astro preview` of a build, or a temporary HTTP server), start it on a free port from `4400` to `4499`, do the work, and stop it. Playwright starts and stops its own `webServer` on port `4400`.

## Reporting

In the final summary, say which case applied in one short line: the existing server was used (and restarted, if it was), or a server was started and stopped.
