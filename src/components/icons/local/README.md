# Local icons

This directory holds one-off Astro icon components for icons that cannot come
from Lucide or Simple Icons — the two sets the site uses for everything else
(see `documentation/theme/icons.md`).

Use this only for extreme cases, for example a brand mark that Simple Icons
has removed under legal pressure (LinkedIn is one confirmed case — see
[#2024](https://github.com/davidsneighbour/kollitsch.dev/issues/2024)). Do
not add a local icon just because it's convenient — check
[lucide.dev](https://lucide.dev) and [simpleicons.org](https://simpleicons.org)
first.

## Adding one

1. Add `src/components/icons/local/<Name>.astro` rendering the icon's SVG,
   following the same prop shape as the other sets (accept `class` and the
   usual SVG attributes; default `width`/`height` to `24`).
2. Register it in the `localIcons` map in `src/utils/icon-names.ts`.
3. Use it as `local:<key>` anywhere an `IconName` is expected.
