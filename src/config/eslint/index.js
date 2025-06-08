// @ts-check

import cssConfig from './configs/css.js';
import defaultConfig from './configs/default.js';
import eslint from '@eslint/js';
import htmlLint from './configs/html.js';
//import tslint from './configs/tslint.js';
import jsonConfig from './configs/json.js';
import markdownConfig from './configs/markdown.js';
import pluginSecurity from 'eslint-plugin-security';
import stylisticJs from '@stylistic/eslint-plugin';
import { globalIgnores } from 'eslint/config';

export default [
  globalIgnores(['dist', 'build']),
  eslint.configs.all,
  //...tslint,
  pluginSecurity.configs.recommended,
  stylisticJs.configs.customize({
    indent: 2,
    jsx: true,
    quotes: 'single',
    semi: false,
  }),
  {
    ignores: ['**/node_modules/*', '**/vendor/*', '**/.git/*'],
    name: 'dnb/ignores',
  },
  defaultConfig,
  ...markdownConfig,
  ...jsonConfig,
  ...cssConfig,
  ...htmlLint,
  ...astroConfig,
];
