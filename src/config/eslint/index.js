import eslint from '@eslint/js';
import { globalIgnores } from 'eslint/config';

// Importing ESLint configurations
import defaultConfig from './default.js';

// Importing language-specific configurations
import cssConfig from './langCss.js';
import htmlConfig from './langHtml.js';
import jsConfig from './langJs.js';
import jsonConfig from './langJson.js';
import markdownConfig from './langMarkdown.js';
import securityConfig from './pluginSecurity.js';
import stylisticConfig from './pluginStylistic.js';

import plugin from './plugin.js';

export default [
  // @todo check if this is still needed
  globalIgnores(['dist', 'build']),
  eslint.configs.all,
  {
    // Configuration
    ignores: ['**/node_modules/*', '**/vendor/*', '**/.git/*'],
    // @todo check if this is still needed
    name: 'dnb/ignores',
  },
  ...defaultConfig,
  ...stylisticConfig,
  ...securityConfig,
  ...jsConfig,
  ...jsonConfig,
  ...markdownConfig,
  ...cssConfig,
  ...htmlConfig,
  // your existing shared config parts...
  ...ts.configs.recommendedTypeChecked, // example
  {
    files: ['src/**/*.{ts,tsx}'],
    plugins: {
      kdev: kdevPlugin,
    },
    rules: {
      // We enforce our custom rule instead of the generic one
      'no-console': 'off',
      'kdev/prefer-logger': ['error', {
        allow: ['assert'],           // optional: allow console.assert
        allowInFiles: [
          'src/utils/logger.ts',     // allow inside the logger itself
          'src/utils/debug.ts',      // legacy shim
          '.test.',                  // tests may still use console for snapshots
        ],
      }],
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
      },
    },
  },
];
