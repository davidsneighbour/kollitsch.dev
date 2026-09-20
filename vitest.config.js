/// <reference types="vitest" />
// @vitest-environment node
// @see https://github.com/vitest-dev/vitest/issues/4043 for the `@vitest-environment` comment

import { playwright } from '@vitest/browser-playwright';
import { getViteConfig } from 'astro/config';
import tsconfigPaths from 'vite-tsconfig-paths';

const enableBrowserProject = process.env.VITEST_BROWSER === 'true';

// Astro's generated image modules are faster without persistent caching. Keep
// the image-index test separate so the rest of the suite can reuse transforms.
const testProjects = [
  {
    test: {
      include: [
        'src/**/*.test.ts',
        '!src/test/browser/**/*.browser.test.ts',
        '!src/utils/image-index.test.ts',
      ],
      name: 'unit',
    },
  },
  {
    test: {
      fsModuleCache: false,
      include: ['src/utils/image-index.test.ts'],
      name: 'image-index',
    },
  },
  ...(enableBrowserProject
    ? [
        {
          extends: false,
          test: {
            browser: {
              enabled: true,
              headless: true,
              instances: [
                {
                  browser: 'chromium',
                },
              ],
              provider: playwright(),
            },
            globals: true,
            include: ['src/test/browser/**/*.browser.test.ts'],
            name: 'browser',
          },
        },
      ]
    : []),
];

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
      include: ['src/**.{js,jsx,ts,tsx}'],
      reporter: ['html'],
      reportsDirectory: 'src/test/logs/vitest/coverage',
    },
    environment: 'jsdom',
    fsModuleCache: true,
    globals: true,
    projects: testProjects,
  },
});
