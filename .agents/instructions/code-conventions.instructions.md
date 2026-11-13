---
applyTo: "src/**/*.{ts,tsx,astro,js,mjs},*.{ts,js,mjs,cjs}"
---

# Code conventions

- ESM only (`"type": "module"`).
- Biome formats and lints (spaces, width from `.editorconfig`, multiline HTML attributes, imports sorted by `organizeImports`).
- Use the TypeScript path aliases from `tsconfig.json` (`@components/*`, `@utils/*`, and others) instead of deep relative imports.
- Use `fast-glob` for file globbing; `glob` is not installed.
- Explicit return types on exported functions are preferred. No tool enforces this; check it in review.
- Never import `.json` directly in `.astro` frontmatter (Astro strips `with { type: 'json' }` and warns `INCONSISTENT_IMPORT_ATTRIBUTES`); re-export it through a `.ts` module. In `.ts` files, every JSON import carries `with { type: 'json' }`, and the same JSON module is imported only once per file.
