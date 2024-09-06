const cssnano = require("cssnano");
const postcsspresetenv = require("postcss-preset-env");
const autoprefixer = require("autoprefixer");
// @ts-ignore
// const doiuse = require("doiuse");

// running purgecss only in production so we can use all available classes in development
const purgecss =
  process.env.HUGO_ENVIRONMENT === "production"
    ? // @ts-ignore
      require("@fullhuman/postcss-purgecss")({
        content: ["./hugo_stats.json"],
        // https://github.com/gohugoio/hugo/issues/10338
        // https://discourse.gohugo.io/t/purgecss-and-highlighting/41021
        safelist: {
          greedy: [/highlight/, /chroma/, /widget--web-vitals/, /dark/],
        },
        fontFace: true,
        //variables: true,
        keyframes: true,
        defaultExtractor: (/** @type {string} */ content) => {
          const els = JSON.parse(content).htmlElements;
          return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
        },
      })
    : null;

module.exports = {
  plugins: [
    // https://github.com/anandthakker/doiuse
    // doiuse({
    //   browsers: [
    //     "extends @davidsneighbour/browserslist-config",
    //   ],
    //   ignore: ['rem'],
    //   ignoreFiles: ['**/normalize.css'],
    // }),
    purgecss,
    // https://github.com/postcss/autoprefixer
    autoprefixer(),
    // https://github.com/csstools/postcss-plugins/tree/main/plugin-packs/postcss-preset-env
    // @ts-ignore
    postcsspresetenv({
      stage: 2,
      browsers: ["extends @davidsneighbour/browserslist-config"],
      // https://github.com/csstools/postcss-plugins/blob/main/plugin-packs/postcss-preset-env/FEATURES.md
      features: {
        "nesting-rules": true,
      },
      //debug: true,
    }),
    // https://github.com/cssnano/cssnano
    cssnano({
      preset: [
        "default",
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
