---
name: "Keyboard shortcuts: tinykeys"
applyTo: "**/*.ts,**/*.astro"
---

# Keyboard shortcuts: Tinykeys

All keyboard shortcut bindings in this project use **tinykeys** (v4, named export).

* **npm package**: `tinykeys` (in `devDependencies`)
* **Documentation**: [github.com/jamiebuilds/tinykeys](https://github.com/jamiebuilds/tinykeys)
* **API reference**: [tinykeys README](https://github.com/jamiebuilds/tinykeys)

## Usage pattern

```ts
import { tinykeys } from "tinykeys";

const unsubscribe = tinykeys(window, {
  "Shift+A": (event) => {
    event.preventDefault();
    // handler
  },
});

// Call unsubscribe() to remove the listener (for example on view-transition teardown)
unsubscribe();
```

For Astro components with view transitions, always unsubscribe on `astro:before-swap` and
re-register on `astro:page-load`:

```ts
let unsubscribe: (() => void) | null = null;

document.addEventListener("astro:before-swap", () => {
  unsubscribe?.();
  unsubscribe = null;
});

document.addEventListener("astro:page-load", () => {
  unsubscribe = tinykeys(window, {
    /* bindings */
  });
});
```

## Key binding syntax

| Pattern | Example | Meaning |
| --- | --- | --- |
| Single key | `'a'` | Just the A key |
| Modifier + key | `'Shift+A'` | Shift held while pressing A |
| Multiple modifiers | `'$mod+Shift+A'` | Ctrl/Meta + Shift + A |
| Key sequence | `'Shift+Y a'` | Shift+Y then A (within ~400 ms) |
| Key sequence (chords) | `'Shift+Y Shift+A'` | Shift+Y then Shift+A |

`$mod` resolves to `Meta` (Cmd) on macOS and `Control` on other platforms.

Keys are matched against `KeyboardEvent.key` and `KeyboardEvent.code`. Use `code` values
(for example `KeyA`) for layout-independent bindings.

## Registered key combinations

| Shortcut | Action | Defined in |
| --- | --- | --- |
| `Shift+A` | Restore hidden dev bar | `src/components/devtools/Breakpoints.astro` (`DEVBAR_SHOW_KEY` constant at top of file) |

### Changing a shortcut

Each shortcut is defined as a named constant at the top of its file. Change the constant
value using the same tinykeys syntax shown above. The `Breakpoints.astro` key is also
passed to the DOM via `data-show-key` so the HTML tooltip stays in sync automatically.

## Adding a new shortcut

1. Import tinykeys in the relevant `.ts` or `.astro` `<script>` block.
2. Define a named constant for the key string at the top of the file.
3. Register it inside `astro:page-load` (for Astro) or after DOM ready (for plain TS).
4. Store the returned unsubscribe function and call it on teardown.
5. Add the new shortcut to the table above.

## Avoid conflicts

Before adding a shortcut, check the table above and avoid:

* Browser-reserved shortcuts (`Ctrl+T`, `Ctrl+W`, `F5`, etc.)
* Single-character keys without modifiers when an input/textarea may be focused
* `$mod+A` (select all), `$mod+C/V/X` (clipboard)
