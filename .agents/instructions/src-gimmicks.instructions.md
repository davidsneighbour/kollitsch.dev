---
applyTo: "src/components/gimmicks/**"
---

# Gimmicks

Gimmicks are progressive enhancement only. They MUST NOT be required for core content, navigation, layout, or page rendering, and MUST NOT participate unnecessarily in the critical loading or execution path.

- The page without the gimmick MUST look complete and intentional. Server-render inert markup or a static fallback, and keep CSS that reserves space independent of the script, so the gimmick cannot cause layout shift.
- A gimmick MUST NOT affect LCP, FCP, CLS, INP, initial JavaScript execution, or render-blocking work in a measurable way. Never use render-blocking scripts or styles for a gimmick.
- Initialise only when the gimmick is visible, near-visible, or explicitly needed: use `IntersectionObserver`, an Astro `client:visible` or `client:idle` directive, or a user interaction. Do not create canvas contexts, animation loops, timers, or global listeners before that point.
- Split expensive code (renderers, physics, large dependencies) from the always-loaded bootstrap and load it with a dynamic `import()` on first activation. `Mesh.astro` is the reference: `mesh-bootstrap.ts` observes the trigger, and `mesh-renderer.ts` loads on the first crossing.
- Catch load and initialisation failures, log them with `console.error`, and leave the page in its non-enhanced state. A gimmick failure MUST NOT throw into page code.
- Stop all per-frame work while the gimmick is hidden or `document.hidden` is true. Respect `prefers-reduced-motion: reduce` with a static state instead of continuous animation.
- Support the Astro view-transition lifecycle: release listeners, observers, timers, and animation frames on `astro:before-swap`, and initialise again on `astro:page-load` without duplicate instances.
- Add lifecycle unit tests next to the gimmick (see `Mesh.test.ts`). Test activation, cleanup, and pause behaviour, not visual output or timing.
- Performance and baseline tests must be able to evaluate the core experience without gimmicks.
