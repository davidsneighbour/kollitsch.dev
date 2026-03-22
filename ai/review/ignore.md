# Ignored opportunities

Move items here when they must not be re-added while the ignore rule still applies.

The AI must read this file before adding or re-adding an item to `ToDo.md`.

## Format

Use one section per ignored item.

### `topic-slug`

* Reason:
* Match rule:
* Scope:
* Review again:
* Origin:
* Notes:

## Example

### `layout-intentional-legacy-wrapper`

* Reason: Kept intentionally during staged migration.
* Match rule: Suggestions to remove the legacy wrapper in `src/layouts/BaseLayout.astro`.
* Scope: Wrapper removal and related spacing cleanup.
* Review again: 2026-12-01
* Origin: human
* Notes: Do not re-add until the migration milestone starts.
