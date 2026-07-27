# Documentation server

The repository includes a small local documentation server for reading
`documentation/**/*.md` as HTML in a browser or in VS Code's Simple Browser.

`npm run dev` starts both the Astro dev server and the documentation server
in parallel. Use the split scripts when only one side is needed:

```bash
npm run dev:site
npm run dev:docs
```

By default the server listens on all network interfaces (`0.0.0.0`), matching
the Astro dev server's `server: { host: true }` setting, so it's reachable
from other devices on the local network as well as `http://127.0.0.1:4322/`.
The startup log lists every reachable address, including LAN IPs. Restrict it
to localhost only with `--host 127.0.0.1` or `DOCS_HOST=127.0.0.1`.

`documentation/index.md` is served as the landing page. Other Markdown files
are served from their documentation-relative paths, so
`documentation/typography.md` is available at:

```text
http://127.0.0.1:4322/typography.md
```

Extensionless routes also work for convenience:

```text
http://127.0.0.1:4322/typography
```

The server renders Markdown with the same core libraries already used by the
site tooling: `unified`, `remark-parse`, `remark-gfm`, `remark-rehype`, and
`hast-util-to-html`. It is intentionally a local reader, not a second website
build, so it does not hydrate Astro components or load the public site design
system.

The sidebar navigation mirrors the full folder structure under
`documentation/`: each directory level (for example `Components` >
`Layout` > `Header` > `Theme`) becomes a nested, collapsible group,
rendered with native `<details>`/`<summary>` elements (no JavaScript
required). Groups on the path to the page currently being viewed are
expanded automatically; everything else starts collapsed, which keeps the
sidebar short even as the number of documented components grows. Files
directly at the documentation root are listed flat, with no group wrapper.

`documentation/api/` holds generated TypeDoc output (see `npm run docs:api`).
It is never scanned for Markdown or expanded into individual nav entries;
instead it appears as a single `API reference` link that opens the generated
site in a new tab.

Override the documentation server host or port with environment variables:

```bash
DOCS_HOST=127.0.0.1 DOCS_PORT=4332 npm run dev:docs
```

The same values can be passed as flags when running the script directly:

```bash
node src/scripts/documentation-server.ts --host 127.0.0.1 --port 4332
```

## Opening both dev servers in a browser

`npm run dev:open` opens two browser tabs: the Astro dev server
(`https://localhost:4321`) and the documentation server
(`http://127.0.0.1:4322`). It only opens tabs; it does not start either
server, so run `npm run dev` first.
