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
];
