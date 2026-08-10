---
applyTo: "src/components/**"
---

# Component Directory Structure

`src/components/README.md` is the authoritative description of what each
top-level (and notable nested) folder is for. Before adding, moving, or
renaming anything under `src/components/`, read it.

## Placement rules

* Place every new component in the folder whose documented responsibility
  matches it, not the folder that happens to be open or most recently edited.
  When genuinely unsure, use `support/fixtures/` only for test fixtures /
  parking-lot cases - it is not a general catch-all.
* Do not create a new top-level (or notable nested) folder without adding a
  matching entry to `src/components/README.md` in the same change. A folder
  that exists on disk but is undocumented in the README is a bug.
* Do not leave a folder documented in the README that no longer exists on
  disk, or vice versa. Update the README the moment the structure changes.
* Prefer merging near-duplicate categories over adding a new one (for example,
  breadcrumbs and pagination both live under `content/navigation/`, not split
  across a `navigation/` and a `pagenav/`). If two folders end up serving the
  same purpose, consolidate them and update every import.

## shadcn/ui components

Generated shadcn/ui components are never left in a dedicated `shadcn-ui/`
staging folder. shadcn is a code generator, not a place components live.

1. Generate with `npx shadcn@latest add <name>`. The CLI drops the file at
   the `ui` alias in `components.json` (currently `src/components/shared/elements`).
2. Immediately move the generated file into the folder matching its actual
   responsibility per `src/components/README.md` (e.g. a form field belongs
   in `forms/`, not `shared/elements/`).
3. Fix any imports the move breaks, including cross-imports between shadcn
   components (e.g. a generated component that imports another via the `ui`
   alias) and the `cn()` import from `@utils/shadcn-utils`.
4. Keep the file's own shadcn-generated lowercase filename (`button.tsx`, not
   `Button.tsx`). This is intentional: it signals the file was generated
   rather than hand-written, and lets it coexist in the same folder as a
   hand-written component of a similar name (e.g. `shared/elements/button.tsx`
   next to `shared/elements/Button.astro`) without a filename collision on
   case-insensitive filesystems being a concern, since the extensions and
   casing both differ by convention.
5. Review the moved component against `DESIGN.md` before it is used anywhere.
6. Update `src/components/README.md`'s "shadcn/ui" section if the change
   introduces a new pattern (e.g. the first generated component in a folder
   that didn't previously hold any).

## Documentation mirror

Every component documented under `documentation/components/` must have its
doc file moved alongside it in the same change - see
`.agents/instructions/documentation/components.instructions.md` for the full
doc-authoring rules. When a move creates a kebab-case filename collision
between a hand-written and a generated component in the same folder (for
example `Button.astro` and `button.tsx` both kebab-casing to `button.md`),
suffix the generated component's doc file with `-shadcn`
(`button-shadcn.md`) rather than renaming the hand-written one, and update
the cross-links in both files.

## Tests

Component tests live next to their source file (`Component.test.ts` beside
`Component.astro`) and move with it - never leave a test behind when
relocating a component.
