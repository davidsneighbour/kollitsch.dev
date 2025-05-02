/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
import { type Config } from 'prettier';

const config: Config = {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: true,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'es5',
  bracketSpacing: true,
  arrowParens: 'avoid',
  endOfLine: 'lf',
  plugins: [],
  overrides: [
    {
      files: '*.html',
      options: {
        singleQuote: false,
      },
    },
  ],
};

export default config;
