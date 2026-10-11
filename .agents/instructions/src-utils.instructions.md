---
applyTo: "src/utils/**"
---

# Pure and Astro-bound utilities

Keep a utility that must be testable without the Astro runtime in a `.pure.ts` file (for example `src/utils/content.pure.ts`, tested by `content.pure.test.ts`). Pure utilities must not import server-only Astro modules such as `astro:content`.

Astro-specific utilities (for example `content.ts`, `tags.ts`, `content-object.ts`) may import Astro APIs. Generic Node/Vitest tests should not load them unless the test environment is configured for Astro.
