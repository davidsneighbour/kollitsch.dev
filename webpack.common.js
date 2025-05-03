// file: webpack.config.mjs

import path from 'path';
import { fileURLToPath } from 'url';
import { GenerateSW } from 'workbox-webpack-plugin';
import webpack from 'webpack';

// Resolve __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileListPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      const a = { files: [] };
      for (const filename in compilation.assets) {
        a.files.push(filename);
        const f = filename.split('.');
        const filetype = f[f.length - 1];
        if (filetype === 'css' || filetype === 'js') {
          a[filetype] = {
            filename,
            hash: f[f.length - 2]
          };
        }
      }
      const a2 = JSON.stringify(a);
      compilation.assets['filelist.json'] = {
        source: () => a2,
        size: () => a2.length
      };
      callback();
    });
  }
}

export default {
  target: 'webworker',
  entry: {
    main: path.join(__dirname, 'assets/js', 'service-worker.js'),
  },
  devtool: 'source-map',
  performance: {
    maxEntrypointSize: 100000,
    maxAssetSize: 500000,
    hints: 'warning'
  },
  plugins: [
    new FileListPlugin(),
    new GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ]
};
