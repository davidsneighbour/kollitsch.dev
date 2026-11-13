/**
 * Fallback module declaration for `.astro` imports in plain `.ts` files.
 *
 * `astro check` and the editor plugin resolve `.astro` files natively. Plain
 * `tsc --noEmit` (`npm run check:types`) does not, and Astro 6 no longer ships
 * a `*.astro` wildcard declaration. This shim lets `tsc` type-check tests and
 * utilities that import Astro components. Its shape matches what the Astro
 * language server reports for a component: a callable that takes props and
 * that `astro/container` accepts as a component factory.
 */
declare module '*.astro' {
  import type { AstroComponentFactory } from 'astro/runtime/server/index.js';

  const Component: AstroComponentFactory & ((props: Record<string, unknown>) => unknown);
  export default Component;
}
