import purgecss from "@fullhuman/postcss-purgecss";
import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import postcsspresetenv from "postcss-preset-env";

export default {
  plugins: [
    // https://github.com/anandthakker/doiuse
    // doiuse({
    //   browsers: [
    //     "extends @davidsneighbour/browserslist-config",
    //   ],
    //   ignore: ['rem'],
    //   ignoreFiles: ['**/normalize.css'],
    // }),
    // purgecss({
    //   content: ['./hugo_stats.json'],
    //   // https://github.com/gohugoio/hugo/issues/10338
    //   // https://discourse.gohugo.io/t/purgecss-and-highlighting/41021
    //   safelist: {
    //     greedy: [/highlight/, /chroma/, /dark/],
    //   },
    //   fontFace: true,
    //   //variables: true,
    //   keyframes: true,
    //   defaultExtractor: (/** @type {string} */ content) => {
    //     const els = JSON.parse(content).htmlElements;
    //     return [
    //       ...(els.tags || []),
    //       ...(els.classes || []),
    //       ...(els.ids || []),
    //     ];
    //   },
    // }),
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
      debug: true,
    }),

    // https://cssnano.github.io/cssnano
    cssnano({
      preset: [
        "advanced",
        {
          discardComments: {
            removeAll: true,
          },
        },
      ],
    }),
  ],
};
