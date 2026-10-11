---
applyTo: "src/**/*.test.ts,src/test/**,vitest.config.js"
---

# Tests

- Unit tests live next to the file they test (`Component.test.ts` beside `Component.astro`).
- Every unit test file MUST start with `// @vitest-environment node`.
- Browser tests are `src/test/browser/**/*.browser.test.ts` and run only with `VITEST_BROWSER=true`.
- Run one file with `npx vitest run src/path/to/file.test.ts`.
- When a new file is picked up by an existing suite (for example `src/test/browser/components-props.test.ts` checks every component under `src/components/`), fix the source, not the test.
