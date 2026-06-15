# To-do

## Audit summary

A full read-through and validation pass of the `kollitsch.dev` Astro repository was performed on 2026-06-13. The codebase is in good health overall: unit tests pass, `astro check` reports zero errors and zero warnings across 255 files, and TypeScript strict mode is broadly respected. The build pipeline, content schemas, OG image generation, and styling system are well structured.

The most material open problems are content lint errors and missing test coverage rather than functional defects. The CI gate, scrollbar tokens, vitest environment headers, and env declarations have been resolved since the initial audit.

## Deferred ideas

All deferred ideas are tracked as GitHub issues with `status:unconfirmed`:

* #1686 — Markdownlint pre-commit hook via lint-staged
* #1687 — CI job for `astro check` and `lint:markdown` on pull requests
* #1678 — Replace `@ts-ignore` clusters in `Giscus.astro` with a typed wrapper
* #1681 — Move `src/scripts` back under type-checking (`tsconfig.scripts.json`)
* #1688 — Carry forward DESIGN.md backlog (tokens, colour roles, dark-mode pairs)
* #1689 — Adopt `ai/review/` structured action registry when available
* #1690 — Review and fix typography scale against DESIGN.md
* #1691 — Move blog post preview into container-based layout
* #1692 — Validate and fix YouTube content type definition
* #1693 — Introduce Nanny CLI wrapper for `src/scripts` invocations
* #1694 — Audit and fix the web ring implementation
* #1695 — Add page, link, and title transitions
* #1696 — Show link underlines on blog post card hover
* #1697 — 90% opacity page background to reveal body background colour
* #1698 — Add `excludeAgent` frontmatter to `.vscode/instructions/` files
* #1699 — Extend Playwright e2e suite with live site smoke tests
* #1700 — Evaluate itshover.com/icons as icon enhancement option
* #1701 — Restore `::search-text` CSS Highlight API rules once Lightning CSS supports them
* #1702 — Track Vite false-positive warning for `OpenGraphImage.astro` JSON import
