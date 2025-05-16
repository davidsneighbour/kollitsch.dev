import path from 'path';
import { fileURLToPath } from 'url';
import { merge } from 'webpack-merge';
import common from './webpack.common.js';
import webpack from 'webpack';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const localConfig = {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'static/sw-prod'),
    filename: '[name].[fullhash].js',
    clean: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      __IS_DEV__: JSON.stringify(false), // in dev
    }),
  ],
};

export default merge(common, localConfig);
