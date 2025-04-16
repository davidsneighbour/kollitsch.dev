const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const localConfig = {
  mode: "development",
  "devtool": "inline-source-map",
  output: {
    path: path.resolve(__dirname, 'static/sw-dev'),
    filename: '[name].[fullhash].js',
    clean: true,
  },
};

module.exports = merge(common, localConfig);
