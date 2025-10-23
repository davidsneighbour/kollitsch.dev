/// <reference types="vitest" />
// @vitest-environment node
// @see https://github.com/vitest-dev/vitest/issues/4043 for the `@vitest-environment` comment

import { getViteConfig } from 'astro/config';
import { playwright } from '@vitest/browser-playwright';
import tsconfigPaths from 'vite-tsconfig-paths';

const enableBrowserProject = process.env.VITEST_BROWSER === 'true';

const browserProjects = enableBrowserProject
  ? [
      {
        name: 'browser',
        test: {
          globals: true,
          include: ['src/test/browser/**/*.test.ts'],
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [
              {
                browser: 'chromium',
              },
            ],
          },
        },
      },
    ]
  : undefined;

/**
 * @type {import('vite').UserConfig}
 *
 * This is the configuration file for Vitest, which is used for testing in Astro
 * projects. If we need to extend the Astro configuration then we'll add a
 * second object to the `getViteConfig` function containing that configuration.
 *
 * @see https://docs.astro.build/en/guides/testing/#vitest
 */
// @ts-expect-error Astro config's getViteConfig has wrong types
export default getViteConfig({
  // @ts-expect-error another issue in connection with Astro's config
  plugins: [tsconfigPaths()],
  test: {
    coverage: {
      reporter: ['text', 'html'],
      reportsDirectory: 'src/test/logs/vitest/coverage',
    },
    environment: 'jsdom',
    globals: true,
    include: ['src/components/**/*.test.ts'],
    ...(browserProjects ? { projects: browserProjects } : {}),
  },
});
