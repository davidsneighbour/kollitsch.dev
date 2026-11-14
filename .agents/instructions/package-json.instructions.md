---
applyTo: "package.json,src/packages/**,.nvmrc"
---

# `package.json` and `src/packages/` (nanny)

`package.json` is generated. Its source of truth is the set of `*.jsonc` fragments under `src/packages/**` (one file per feature or tool area, holding `devDependencies`, `scripts`, `wireit`, `overrides`, and so on). The `nanny` CLI merges and syncs them:

- `npm run packages:generate` (`nanny generate-package`): merges `src/packages/**/*.jsonc` into `package.json`. This is the authoritative direction; anything only in `package.json` is dropped on the next generate.
- `npm run packages:update` (`nanny update-package`): copies dependency versions from `package.json` back into the fragments. For `scripts` and `wireit` it only reports drift, and it does not sync `overrides`.
- `npx nanny check`: read-only drift report between `package.json`, the fragments, and `.vscode/settings.json`.

Whenever you edit `package.json` directly (dependency, script, `overrides` entry), make the same change in the fragment that owns that key. Then run `nanny update-package` and `nanny check`. Fix reported `scripts`, `wireit`, and `overrides` drift by hand in the owning fragment and rerun `nanny check` until it is clean.

Dependency versions are exact. Do not use `^` or `~` ranges.

## Dependency rationale

For every future agent-added package that the user did not explicitly request and whose purpose is not clear from the surrounding configuration, add a comment directly above its entry in the owning `src/packages/**/*.jsonc` fragment. Explain why the package is needed and link to the relevant GitHub issue. Keep the rationale in the source fragment, because generated `package.json` does not preserve comments.

## Node version

`package.json` `engines.node` (currently `>=26`) is the single source of truth; `.nvmrc` mirrors it. Even-numbered (LTS) majors are preferred.
