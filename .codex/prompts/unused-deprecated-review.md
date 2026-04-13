# Codex Task: unused and deprecated code review

## Repository context

This is an Astro-based project.

Be especially careful with:

* dynamic routes
* content collections
* config-driven behaviour
* string-based references
* Astro integrations
* build hooks
* CLI scripts
* tests and e2e tests

Treat all of the above as valid feature usage, even if not directly imported.

## Goal

Reduce dead code and deprecated implementations while preserving all working functionality.

## Safety rules

You must follow these rules strictly:

* Do not remove any feature unless you are highly confident it is unused.
* If there is any doubt, do not modify it. Add it to `ToDo.md`.
* Do not remove anything referenced by:
  * application code
  * routes
  * layouts
  * components
  * content collections
  * tests or e2e tests
  * config files
  * scripts
  * build hooks
  * package scripts
  * dynamic imports
  * registries or maps
* Assume indirect usage through:
  * configuration
  * frontmatter
  * environment conditions
  * string references
* Prefer minimal, reversible changes.
* Do not perform speculative cleanups.
* Do not change behaviour unless clearly safe.

## Tasks

### 1. Analyse the codebase

Identify candidates such as:

* unused components or utilities
* duplicate helpers
* deprecated APIs
* legacy patterns
* unused exports, props, styles, or assets
* unreachable code paths
* outdated configuration

### 2. Classify findings

Each finding must be classified:

* Safe to fix now
* Needs review

Only modify items in "Safe to fix now".

### 3. Apply fixes (safe only)

Allowed:

* remove clearly unused code
* remove unused imports/exports/styles
* replace deprecated APIs
* simplify duplicated logic

Not allowed:

* broad rewrites
* architectural changes
* removing code based on assumption
* breaking behaviour

### 4. Validate

You must ensure:

```bash
npm run test
npm run test:e2e
npx astro check
```

All must pass.

If not, fix or revert your changes.

### 5. Create or update ToDo.md

Create or update `ToDo.md` in the repository root.

Structure:

```md
# ToDo

## Needs review

- [ ] path/to/file.ts: possible unused function `example`
  - Reason: no direct imports found
  - Risk: may be dynamically referenced

## Deprecated or legacy candidates

- [ ] path/to/file
  - Reason: uses deprecated API
  - Suggested action: replace with modern equivalent
  - Blocker: confirm behaviour compatibility
```

Include:

* file paths
* symbol names
* reasoning
* risks
* suggested next steps

## Evidence standard

Before removing anything, check for:

* imports
* route usage
* config references
* test references
* content references
* dynamic imports
* string-based lookups
* registration in maps or loaders

Lack of imports alone is not sufficient evidence.

## Definition of done

All of the following must be true:

* tests pass (`npm run test`)
* e2e tests pass (`npm run test:e2e`)
* Astro checks pass (`npx astro check`)
* no used feature was removed
* `ToDo.md` exists and is complete
* changes are minimal and safe

## Final output

Provide:

* summary of changes
* results of all validation commands
* summary of `ToDo.md`
* remaining risks or uncertainties

## Principle

When in doubt, prefer documenting in `ToDo.md` over editing code.
