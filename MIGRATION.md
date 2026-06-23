# Migration Notes

Temporary workarounds and things to clean up after upstream packages catch up.

---

## Astro 7 / Vite 8 upgrade (June 2026)

### npm overrides — remove when upstream packages update

Two packages ship outdated peer dep declarations and need overrides in `package.json`
until they release a version that covers Astro 7 / Vite 8:

```json
"overrides": {
  "astro-expressive-code": { "astro": "$astro" },
  "vite-plugin-devtools-json": { "vite": ">=5.0.0" }
}
```

| Package | Their declared range | Upgrade target |
|---|---|---|
| `astro-expressive-code@0.43.1` | `astro "^3.3.0 \|\| ^6.0.0-beta"` | any release that adds `\|\| ^7` |
| `vite-plugin-devtools-json@1.0.0` | `vite "^5.0.0 \|\| ^6.0.0 \|\| ^7.0.0"` | any release that adds `\|\| ^8` |

Both packages work correctly at runtime with the new versions — only the peer dep
declaration is stale. Remove the relevant `overrides` entry (and this line) once the
package ships a compatible release.

### @sentry/server-utils optional Vite peer dep warning

`@sentry/server-utils@10.59.0` declares `peerOptionalDependencies: vite@"^3–6"`.
Vite 8 is installed (pulled in by Astro 7), so npm prints a warning on every install.
This is harmless — Sentry works at runtime. Track the Sentry SDK changelog for a
release that extends the range to `^8`; no override needed since it's optional.
