---
applyTo: "package.json,src/packages/**"
---

# `package.json` and `src/packages/` (nanny)

`package.json` is generated. Its source of truth is the set of `*.jsonc` fragments under `src/packages/**` (one file per feature or tool area, holding `devDependencies`, `scripts`, `wireit`, `overrides`, and so on). The `nanny` CLI merges and syncs them:

- `npm run packages:generate` (`nanny generate-package`): merges `src/packages/**/*.jsonc` into `package.json`. This is the authoritative direction; anything only in `package.json` is dropped on the next generate.
- `npm run packages:update` (`nanny update-package`): copies dependency versions from `package.json` back into the fragments. For `scripts` and `wireit` it only reports drift, and it does not sync `overrides`.
- `npx nanny check`: read-only drift report between `package.json`, the fragments, and `.vscode/settings.json`.

Whenever you edit `package.json` directly (dependency, script, `overrides` entry), make the same change in the fragment that owns that key. Then run `nanny update-package` and `nanny check`. Fix reported `scripts`, `wireit`, and `overrides` drift by hand in the owning fragment and rerun `nanny check` until it is clean.

Dependency versions are exact. Do not use `^` or `~` ranges.
