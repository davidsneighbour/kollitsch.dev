import { defineConfig } from 'cypress';
import { htmlvalidate } from 'cypress-html-validate';
import { loadConfig } from '@davidsneighbour/cypress-config';
import 'dotenv/config';

const { PORT } = process.env;
const { IP } = process.env;

export default defineConfig({
	extends: '@davidsneighbour/cypress-config/base-hugo.json',

	env: {},
	projectId: 'q89kap',
  e2e: {
    excludeSpecPattern: ['**/accessibility/*.spec.ts', '**/htmlvalidation/*.spec.js'],
    setupNodeEvents(on, config) {
			htmlvalidate.install(on);
			const configuration = loadConfig(config.configFile);
			configuration.baseUrl = `http://${IP}:${PORT}`;
			return configuration;
    },
  },
});
