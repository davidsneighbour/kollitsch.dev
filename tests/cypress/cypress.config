import { defineConfig } from 'cypress';
import htmlvalidate from 'cypress-html-validate/plugin';

export default defineConfig({
  extends: '@davidsneighbour/cypress-config/base-hugo.json',
  env: {},
  projectId: 'q89kap',
  e2e: {
		baseUrl: `http://192.168.1.201:1313`,
		specPattern: './tests/cypress/integration/**/*.spec.ts',
    excludeSpecPattern: ['**/accessibility/*.spec.ts', '**/htmlvalidation/*.spec.js'],
    setupNodeEvents(on, config) {
      htmlvalidate.install(on);
			return config;
    },
		supportFile: './tests/cypress/support/e2e.ts',
    downloadsFolder: './tests/cypress/downloads',
		fixturesFolder: './tests/cypress/fixtures',
		screenshotsFolder: './tests/cypress/screenshots',
		videosFolder: './tests/cypress/videos',
  },
});
