const purgecss = require('@fullhuman/postcss-purgecss')({
  content: ['./hugo_stats.json'],
  defaultExtractor: (content) => {
    const els = JSON.parse(content).htmlElements;
    return [...(els.tags || []), ...(els.classes || []), ...(els.ids || [])];
  },
});

// eslint-disable-next-line import/no-extraneous-dependencies
const defaultConfig = require('@davidsneighbour/postcss-config');

const localConfig = {
  plugins: [
    ...(process.env.HUGO_ENVIRONMENT === 'production' ? [purgecss] : []),
  ],
};

const config = {
  ...defaultConfig,
  ...localConfig,
};
module.exports = config;
