# To-do

## Audit summary

A full read-through and validation pass of the `kollitsch.dev` Astro repository was performed on 2026-06-13. The codebase is in good health overall: unit tests pass, `astro check` reports zero errors and zero warnings across 255 files, and TypeScript strict mode is broadly respected. The build pipeline, content schemas, OG image generation, and styling system are well structured.

The most material open problems are content lint errors and missing test coverage rather than functional defects. The CI gate, scrollbar tokens, vitest environment headers, and env declarations have been resolved since the initial audit.

## Recommended changes

All recommended changes are now tracked as GitHub issues:

* **Markdown lint gate** (P2) — #1660, #1661, #1662, #1666, #1667, #1668, #1669, #1670, #1671, #1672
* **Deduplicate VS Code link helpers** (P3) — #1677
* **Add tests for utility modules** (P3) — #1680
* **Update Node version pins** (P2) — #1679
* **Fix "Tags: " rendering when no tags assigned** (P2) — #1684
* **Fix `public/_headers` response header errors** (P3) — #1685

## Questions

* Running `node src/scripts/*.ts` (rather than `npx tsx`) appears intentional given Node's native TypeScript support, but it contradicts `CLAUDE.md`. Should `CLAUDE.md` be updated to reflect `node` usage, or should the scripts move to `npx tsx`?
* Is the empty Netlify build command (`command = ""`) deliberate because the build runs in a pre-step or via the CLI deploy, and is the production build covered by any CI gate before deploy?
* For Playwright, does `astro dev` serve plain HTTP on `4321` in CI, or should `baseURL`/`webServer.url` use `https`?

## Deferred ideas

* (IDEA) Add a Markdown lint pre-commit hook (via `lint-staged`) so content style issues are caught before they accumulate.
* (IDEA) Introduce a CI job that runs `astro check` and `lint:markdown` on pull requests, so type and content gates run alongside the existing unit-test workflow.
* (IDEA) Replace the duplicated `@ts-ignore` clusters in `Giscus.astro` with a typed wrapper around the Giscus global, improving type coverage of the comments component.
* (IDEA) Move `src/scripts` back under type-checking (a dedicated `tsconfig.scripts.json`) so build-time integration code such as `build-hooks.ts` is validated.
* (IDEA) Carry forward the pre-existing DESIGN.md backlog (sidebar tokens, semantic colour roles, dark-mode token pairs, form/navigation/motion/component token coverage, icon-system documentation).
* (IDEA) Adopt the `ai/review/` structured action registry when it becomes available in the shared `ai` repo: stable item IDs, machine-readable validation commands in `ai/review/config.json`, and explicit `done`/`ignore` tracking files so completed items have a history rather than being deleted.
* (IDEA) Fix font sizes overall; review the typography scale against DESIGN.md and correct any deviations across components.
* (IDEA) Move the blog post preview into a container-based layout.
* (IDEA) Fix YouTube content type handling; the current content type for YouTube posts may not be correctly defined or validated.
* (IDEA) Nanny CLI: replace the `node src/scripts/*.ts` invocations in `package.json` and `wireit` entries with a `nanny <command>` wrapper, giving scripts a clean CLI surface. (Relates to the open question about `node` vs `npx tsx`.)
* (IDEA) Static quest web ring: audit and fix the current web ring implementation.
* (IDEA) Add page, link, and title transitions.
* (IDEA) Blog post cards: show link underlines on card hover and intensify them on link hover.
* (IDEA) 90% opacity page background so the body background colour shows through content areas.
* (IDEA) Add `excludeAgent: "code-review"` or `excludeAgent: "coding-agent"` frontmatter to `.vscode/instructions/` files where the instruction content should be hidden from specific Copilot agents.
* (IDEA) Extend the Playwright e2e suite with live site smoke tests: critical page uptime (`/about/`, `/contact/`, `/uses/`), Pagefind search overlay, primary navigation and footer link crawl, JSON-LD structured data on blog posts, `@axe-core/playwright` accessibility checks (already installed), Web Vitals / synthetic timing, Matomo opt-out validation, contact form end-to-end submission, service worker registration, and sitemap integrity check.
* (IDEA) Evaluate [`itshover.com/icons`](https://www.itshover.com/icons) as an icon enhancement option.
* (IDEA) Restore `::search-text` and `::search-text:current` CSS Highlight API rules in `src/styles/theme.css` once Lightning CSS recognises the pseudo-element without warnings. The colour tokens (`--color-red-600`/`--color-red-50`/`--color-red-900`) are already defined. See the comment in the `::target-text` block for context.
* (KNOWN ISSUE) Vite build warning: `Module "src/components/layout/head/OpenGraphImage.astro" tried to import "src/data/setup.json" with no attributes`. All source imports correctly include `with { type: "json" }` - this is a false positive caused by the Astro compiler stripping import attributes from `.astro` modules during SSR compilation. No source fix is possible; track for resolution in upstream Astro/Vite.
