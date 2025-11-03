---
mode: 'agent'
model: GPT-5 mini
---

# Refactor & Optimise TypeScript Utility (single file)

**Target file:** `src/utils/{{FILE}}`
**Scope:** Only this file (and minimal supporting files like tests and type helpers if strictly needed).
**Goal:** Refactor for correctness, strict typing, documentation, and maintainability; add tests with full coverage; ensure Biome lint passes.

## House Style (do not deviate)

* TypeScript **strictest** possible: no `any`, prefer `unknown` + type guards or specific interfaces; avoid `undefined` unless explicitly part of the type.
* Node.js v24+, ESM, target ES2022, module ES2022, lib ["ES2022","DOM"], moduleResolution "Bundler".
* Prefer small pure functions; no side effects unless documented.
* No empty catch blocks; always handle or log explicitly.
* JSDoc is **required** for every exported function/type (parameters, returns, examples).
* Tests: **Vitest**, aim for **100% coverage** (branches, statements, lines, functions).
* Lint: **Biome** must pass with no warnings/errors.
* File naming: tests live next to the file as `{{BASENAME}}.test.ts`.

## Tasks

1. **Pre-check for duplication**

   * Before refactoring, **quickly scan all files in `src/utils/`** to ensure that no functions in `{{FILE}}` are already defined elsewhere.
   * If overlapping or duplicate functionality exists, document it and refactor to use a shared implementation instead of redefining (for example, extract to `src/utils/_shared/` or import the canonical version).
   * Do **not** refactor unrelated files beyond creating or adjusting a shared helper.

2. **Audit & de-duplicate**

   * Identify functions that re-implement logic that already exists elsewhere.
   * Replace redundant code with imports where safe.
   * If behaviour differs intentionally, add a JSDoc `@note` explaining why.

3. **Refactor for strict typing**

   * Replace loose/implicit types with precise ones (branded types where useful).
   * Add type guards, discriminated unions, and generics carefully (no over-generic APIs).
   * Disallow `null | undefined` unless part of explicit contract; prefer `Option`-like patterns only if warranted.
   * Document all thrown errors and return types.

4. **Documentation**

   * Add JSDoc for every exported symbol:

    ```ts
    /**
      * One-line summary.
      *
      * Longer description if needed.
      *
      * @param input - ...
      * @returns ...
      * @example
      * ```ts
      * import { fn } from "{{IMPORT_PATH}}";
      * const out = fn("value");
      * ```
      */
    ```

   * Include edge-case examples and notes about performance characteristics if relevant.

5. **Testing (Vitest)**

   * Create `{{BASENAME}}.test.ts`.
   * Cover: happy paths, edge cases, invalid inputs, error branches, async branches, and type-level behaviour via `@ts-expect-error` assertions where appropriate.
   * Ensure **determinism**: no reliance on time/IO unless mocked.
   * Achieve **100% coverage**.

6. **Linting & formatting**

   * Run Biome fixes locally in your head; ensure no rules are violated (imports sorted, no unused vars, consistent exports, etc.).
   * Keep functions small, with clear naming and single responsibility.

7. **Performance & stability**

   * Assess algorithmic complexity; upgrade naive loops if there's a clear, simple improvement.
   * Avoid premature micro-optimisations; prefer readability when trade-offs are negligible.
   * Add input validation and defensive checks where external callers are likely.

## Acceptance Criteria (must all be true)

* Public API is either unchanged or improved with **stricter** types and better docs.
* `{{FILE}}` compiles without type errors under strict TS settings.
* `{{BASENAME}}.test.ts` exists and Vitest shows **100% coverage**.
* Biome lint runs cleanly.
* No `any`, no `// @ts-ignore` (use `@ts-expect-error` only to prove types).
* All exported functions/types are documented with JSDoc and runnable `@example` snippets.
* **No duplicate or overlapping functionality exists in other `src/utils/` files.**

## Output Format

Return **three** code blocks in this order:

1. **Refactored file** - `{{FILE}}`
2. **Tests** - `{{SAME_DIR}}/{{BASENAME}}.test.ts`
3. **Notes** - a short Markdown list explaining:

   * Duplicates found or confirmed unique
   * De-duplications performed or skipped (with reasons)
   * Type refinements introduced
   * Edge cases covered in tests
   * Any behavioural changes (should be none unless documented improvement)

Use absolute/alias imports consistent with the project. Keep the diff minimal but meaningful.

## Verification commands (for the human reviewer)

* Run tests:

  ```bash
  npx vitest run --coverage
  ```

* Run lint:

  ```bash
  npx biome check .
  ```
