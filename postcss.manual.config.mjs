import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import removeComments from "postcss-discard-comments";
import postcssPresetEnv from "postcss-preset-env";

export default {
  syntax: 'postcss-scss',
  plugins: [

    // https://github.com/postcss/autoprefixer
    autoprefixer({
      env: process.env.HUGO_ENVIRONMENT,
      remove: false,
      ignoreUnknownVersions: true,
      grid: true,
    }),

    // https://www.npmjs.com/package/postcss-preset-env
    postcssPresetEnv({
      stage: 2,
      minimumVendorImplementations: 2,
      env: process.env.HUGO_ENVIRONMENT,
      features: {
        "nesting-rules": true,
        "is-pseudo-class": false, // allows to keep :is() intact
      },
      debug: process.env.HUGO_ENVIRONMENT !== "debug" ? false : true,
      autoprefixer: {
        grid: true,
      },
    }),

    // https://www.npmjs.com/package/postcss-discard-comments
    removeComments({
      removeAll: true,
    }),

    // https://cssnano.github.io/cssnano
    cssnano({
      preset: [
        process.env.HUGO_ENVIRONMENT !== "development" ? "advanced" : "lite",
      ],
    }),
  ],
};
