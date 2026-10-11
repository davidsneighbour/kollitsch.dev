# OSV scan decisions

Human-readable log for `osv-scan-ledger.json`. `osv-scan` sends `package-lock.json` metadata to `https://api.osv.dev/v1/querybatch`; run it only on explicit request, never from hooks, scripts, or CI.

## Log

- 2026-10-11: Workarounds via `overrides` in `src/packages/build/overrides.jsonc` and `src/packages/linting/markdownlint.jsonc` for `@modelcontextprotocol/sdk`, `devalue`, `fast-uri`, `fflate` (satori), `image-size`, `katex`, `markdown-it`, `postcss-selector-parser`, `proxy-addr`, `sharp`, `smol-toml`, and `source-map-js`. Remove each once the parent ships the patched version. `postcss-selector-parser` 7.1.6 replaces 6.x for `@tailwindcss/typography` and `postcss-nested`; verified with a full build.
