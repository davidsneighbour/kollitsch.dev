# Known false positives

This document tracks test, lint, and check failures that were investigated
and proven to be false positives: the underlying page, component, or code is
correct, but a tool reports a failure anyway.

Read this document whenever a test, lint, or other automated check fails
unexpectedly. Check whether the failure already has a chapter here before
spending time re-diagnosing it or changing code to chase the tool's report.

Each chapter must include hard evidence (computed values, screenshots, or
equivalent), not just a hunch that "it's probably fine". A false positive
claim without evidence does not belong here — fix the code instead, or leave
the check failing and open an issue.

When you verify a new false positive, add a chapter below using this shape:

* **Tool / check** — the command or rule that fails.
* **Symptom** — what the tool reports.
* **Root cause** — why the tool is wrong.
* **Evidence** — how this was verified in the real, running page or output.
* **Handling** — how the false positive is suppressed or left visible, and
  the issue tracking it.

## axe-core: `.pagefind-ui__search-input` placeholder colour-contrast on `/find/`

* **Tool / check** — `src/test/live/accessibility.spec.ts` (axe-core via
  `@axe-core/playwright`), `color-contrast` rule, `/find/` page only.
* **Symptom** — axe reports the placeholder text
  `Search on KOLLITSCH.dev*` at `fgColor: #d1d5dc` on `bgColor: #ffffff`,
  a 1.47:1 ratio against the 4.5:1 minimum. This value never changes,
  including when the placeholder's CSS colour is replaced with a plain,
  hardcoded hex value that has nothing to do with `#d1d5dc`.
* **Root cause** — axe-core has a documented history of misreading
  `::placeholder` colour, especially when the value is set with
  `!important` after a UI library injects its own `<style>` at runtime
  (here, `@pagefind/default-ui`'s Svelte component). See
  [dequelabs/axe-core#2680](https://github.com/dequelabs/axe-core/issues/2680),
  [#2966](https://github.com/dequelabs/axe-core/issues/2966), and
  [#643](https://github.com/dequelabs/axe-core/issues/643) (which notes
  axe may not be able to read a placeholder's true resolved colour at
  all). Because the reported colour does not change no matter what CSS is
  authored, axe is not reading the live, styled DOM for this check.
* **Evidence** — verified against a local production build
  (`npm run build && astro preview`), in the same Chromium/Playwright
  environment axe runs in, three independent ways:
  1. `getComputedStyle(input, '::placeholder').color` resolves to the
     authored colour (`--color-gray-600`, ≈ `rgb(75, 88, 91)`).
  2. That colour rasterised via a `<canvas>` fill and read back with
     `getImageData` — confirming the browser paints it as authored, not
     as a CSS custom-property or `oklch()` resolution artefact.
  3. A real screenshot of the rendered input on `/find/` shows legible,
     clearly-dark placeholder text on a white input background.
  4. Manual WCAG luminance/contrast calculation on the rasterised colour
     against the input's actual computed background
     (`rgb(255, 255, 255)`, confirmed solid white in both light and dark
     theme) gives ≈ 7.4:1 — well past the 4.5:1 minimum.
* **Handling** — [#1835](https://github.com/davidsneighbour/kollitsch.dev/issues/1835).
  See `src/components/features/search/Search.astro`'s
  `.pagefind-ui__form .pagefind-ui__search-input::placeholder` rule for the
  real fix (raised specificity via the `.pagefind-ui__form` ancestor, plus
  `!important`, to reliably beat Pagefind's own injected style). The axe
  exclusion for this node in `accessibility.spec.ts` links back to this
  chapter — if axe-core is upgraded and the exclusion is removed, re-verify
  with the same three-part evidence check before trusting a clean run.
