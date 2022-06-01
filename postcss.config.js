const cssnano = require('cssnano');
const postcsspresetenv = require('postcss-preset-env');
const autoprefixer = require('autoprefixer');
const doiuse = require('doiuse');
const stylelint = require('stylelint');

module.exports = {
  plugins: [
    // https://github.com/stylelint/stylelint/blob/main/docs/user-guide/usage/postcss-plugin.md
    stylelint(
      {
        extends: '@davidsneighbour/stylelint-config',
        ignoreFiles: [
          'assets/scss/settings/_bootstrap-variables.scss',
        ],
      },
    ),
    // https://github.com/anandthakker/doiuse
    doiuse({
      browsers: 'extends @davidsneighbour/browserslist-config',
      ignore: ['rem'],
      ignoreFiles: ['**/normalize.css'],
    }),
    // https://github.com/postcss/autoprefixer
    autoprefixer(),
    // https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env
    postcsspresetenv({
      stage: 2,
      browsers: 'extends @davidsneighbour/browserslist-config',
      // https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md
      features: {
        'nesting-rules': true,
      },
      debug: true,
    }),
    // https://github.com/cssnano/cssnano
    cssnano({
      preset: [
        'default',
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
