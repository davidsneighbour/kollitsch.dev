# Homepage optimisation audit resume

Current umbrella issue: https://github.com/davidsneighbour/kollitsch.dev/issues/1987

This work comes from a live `gpt-taste` audit against `https://192.168.1.201:4321/`. Do not stop the running dev server or start a replacement while continuing this work unless the user explicitly asks for that.

## Work tasks

- Point 1: Diagnose live dev-server Vite dependency 504s — https://github.com/davidsneighbour/kollitsch.dev/issues/1988
- Point 2: Make homepage recent-card eager loading caller-controlled — https://github.com/davidsneighbour/kollitsch.dev/issues/1989
- Point 3: Make TvHead lazy by default with explicit eager option — https://github.com/davidsneighbour/kollitsch.dev/issues/1990
- Point 4: Improve mobile code-block overflow affordance — https://github.com/davidsneighbour/kollitsch.dev/issues/1991
- Point 5: Document the blog-first homepage design contract — https://github.com/davidsneighbour/kollitsch.dev/issues/1992

Point 6 from the audit was an acknowledgement that the current visual direction is acceptable. It has no separate implementation issue.

## Current findings

- The live server is reachable over HTTPS at `https://192.168.1.201:4321/`. Plain HTTP on the same host and port returns an empty reply.
- The live page returns `504` for generated Vite dependency URLs such as `/node_modules/.vite/deps/lenis.js?v=763f96e8`, `/node_modules/.vite/deps/markdown-it.js?v=763f96e8`, `/node_modules/.vite/deps/tinykeys.js?v=763f96e8`, `/node_modules/.vite/deps/@tailwindplus_elements.js?v=763f96e8`, and Astro transition virtual-module chunks.
- The transformed dev modules import those `/node_modules/.vite/deps/...` files from real source imports in `Site.astro`, `Footer.astro`, `Breakpoints.astro`, and Astro's `ClientRouter.astro`.
- The local `node_modules/.vite/deps/_metadata.json` does not list those failing dependencies, so the likely fault is a stale or incomplete Vite optimiser dependency graph.
- There is an unrelated modified file in the worktree: `src/content/blog/2021/another-new-beginning/index.md`. Leave it alone unless the user explicitly includes it.

## Intended homepage contract

The homepage is intentionally blog-first. It is not a marketing website with a blog attached. The start page must always show the latest post or a featured post in full. If that post is long, keep the structure and optimise loading cost, media priority, and interaction behaviour around it. Do not restructure the homepage to hide, truncate, paginate, or remove the full post as a performance fix unless the user explicitly changes this decision.

## Validation target

Run focused checks after implementation:

- `npm test`
- `npm run check`
- a read-only browser or curl pass against `https://192.168.1.201:4321/` if the running dev server is available
