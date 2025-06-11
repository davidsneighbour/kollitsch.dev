/// <reference types="vitest" />
// @vitest-environment node
// @see https://github.com/vitest-dev/vitest/issues/4043 for the `@vitest-environment` comment

import { getViteConfig } from 'astro/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default getViteConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    include: ['src/components/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'html'],
      reportsDirectory: 'logs/vitest/coverage',
    },
  },
});
