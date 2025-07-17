import eslint from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import eslintPluginAstro from 'eslint-plugin-astro';
import defaultConfig from './src/config/eslint/default.js';
import cssConfig from './src/config/eslint/langCss.js';
import htmlConfig from './src/config/eslint/langHtml.js';
import jsConfig from './src/config/eslint/langJs.js';
import jsonConfig from './src/config/eslint/langJson.js';
import markdownConfig from './src/config/eslint/langMarkdown.js';
import securityConfig from './src/config/eslint/pluginSecurity.js';
import stylisticConfig from './src/config/eslint/pluginStylistic.js';

export default [
  // @todo check if this is still needed
  globalIgnores(['dist', 'build']),
  eslint.configs.all,
  {
    // @todo check if this is still needed
    ignores: ['**/node_modules/*', '**/vendor/*', '**/.git/*'],
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

  /**
   * Astro support
   */
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.astro'],
    name: 'dnb/astro',
    rules: {},
  },
];

/*
 *Capitalized first character ;)
 *export default defineConfig([
 *  // Base JavaScript support
 *  {
 *    name: 'dnb/base-js',
 *    files: ['**\/*.{js,mjs,cjs,ts,mts,cts}'],
 *    plugins: { js },
 *    extends: ['js/recommended'],
 *    languageOptions: {
 *      globals: {
 *        ...globals.browser,
 *        ...globals.node,
 *      },
 *    },
 *  },
 *
 *  // TypeScript support
 *  ...tseslint.configs.recommended,
 *
 *  // JSON support
 *  {
 *    name: 'dnb/json',
 *    files: ['**\/*.json'],
 *    plugins: { json },
 *    language: 'json/json',
 *    extends: ['json/recommended'],
 *  },
 *  {
 *    name: 'dnb/jsonc',
 *    files: ['**\/*.jsonc'],
 *    plugins: { json },
 *    language: 'json/jsonc',
 *    extends: ['json/recommended'],
 *  },
 *  {
 *    name: 'dnb/json5',
 *    files: ['**\/*.json5'],
 *    plugins: { json },
 *    language: 'json/json5',
 *    extends: ['json/recommended'],
 *  },
 *
 *  // Markdown support
 *  {
 *    name: 'dnb/markdown',
 *    files: ['**\/*.md'],
 *    plugins: { markdown },
 *    language: 'markdown/gfm',
 *    extends: ['markdown/recommended'],
 *  },
 *
 *  // CSS support
 *  {
 *    name: 'dnb/css',
 *    files: ['**\/*.css'],
 *    plugins: { css },
 *    language: 'css/css',
 *    extends: ['css/recommended'],
 *  },
 *
 *
 *]);
 */
