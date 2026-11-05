// Expressive Code options. They live here, not inline in `astro.config.ts`,
// because the `<Code>` component (used by the code playground's static source
// fallback) can only read options from this file. Expressive Code only looks
// for `ec.config.mjs`, so this file cannot be TypeScript.
// @see https://expressive-code.com/key-features/code-component/#using-an-ecconfigmjs-file
import fs from 'node:fs';
import { createInlineSvgUrl, defineEcConfig } from 'astro-expressive-code';

const crontabTmLanguage = JSON.parse(
  fs.readFileSync('./src/config/tmLanguages/crontab.tmLanguage.json', 'utf-8'),
);

export default defineEcConfig({
  shiki: {
    langs: [crontabTmLanguage],
  },
  styleOverrides: {
    codeFontFamily: "'jetbrainsmono', monospace",
    codeFontWeight: '300',
    frames: {
      copyIcon: createInlineSvgUrl(
        '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-code-slash" viewBox="0 0 16 16"> <path d = "M10.478 1.647a.5.5 0 1 0-.956-.294l-4 13a.5.5 0 0 0 .956.294zM4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0m6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0" /></svg>',
      ),
      frameBoxShadowCssValue: '0',
    },
    uiFontFamily: "'jetbrainsmono', monospace",
    uiFontWeight: '300',
  },
  themeCssSelector: (theme) => `[data-code-theme='${theme.name}']`,
  themes: ['dracula', 'light-plus'],
  useDarkModeMediaQuery: false,
});
