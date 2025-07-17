import globals from 'globals';

export default [
  {
    languageOptions: {
      // fix globals errors
      globals: Object.fromEntries(
        Object.entries(globals.browser).map(([key, value]) => [
          key.trim(),
          value,
        ]),
      ),
      parserOptions: {
        extraFileExtensions: ['json'],
        impliedStrict: true,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    name: 'dnb/default',
  },
];
