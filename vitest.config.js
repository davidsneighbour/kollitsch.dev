/// <reference types="vitest" />
// @vitest-environment node
// @see https://github.com/vitest-dev/vitest/issues/4043 for the `@vitest-environment` comment

import { getViteConfig } from 'astro/config';
import tsconfigPaths from 'vite-tsconfig-paths';

/**
 * @type {import('vite').UserConfig}
 *
 * This is the configuration file for Vitest, which is used for testing in Astro
 * projects. If we need to extend the Astro configuration then we'll add a
 * second object to the `getViteConfig` function containing that configuration.
 *
 * @see https://docs.astro.build/en/guides/testing/#vitest
 */
export default getViteConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/components/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
      reportsDirectory: 'logs/vitest/coverage',
    },
  },
});
