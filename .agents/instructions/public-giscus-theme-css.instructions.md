---
applyTo: "public/assets/styles/giscus-*.css"
---

# Giscus theme CSS: deploy before you verify

`Giscus.astro` always loads these stylesheets from the production URL, because the Giscus iframe on `giscus.app` cannot reach a local dev origin. A local edit is not visible until it is deployed. Background and a local preview procedure are in `documentation/components/features/comments/giscus.md`.

- Whenever a `giscus-*.css` file changes content, bump `themeVersion` in `src/components/features/comments/Giscus.astro` in the same change. Without the bump, `giscus.app` can keep serving its cached copy of the old CSS.
- Do not debug the live behaviour locally as if it were a normal Astro component; nothing is broken until the file is live.
- After the edit, tell the user explicitly that the result cannot be verified until the change is deployed, and confirm that `themeVersion` was bumped. Verify with Chrome DevTools MCP or Playwright only after the deploy.
