// file: webpack.dev.mjs

import path from 'path';
import { fileURLToPath } from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localConfig = {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'static/sw-dev'),
    filename: '[name].[fullhash].js',
    clean: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      __IS_DEV__: JSON.stringify(true), // in dev
    }),
  ],
};

export default merge(common, localConfig);
