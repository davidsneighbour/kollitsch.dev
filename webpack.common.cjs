const path = require('path');
const WorkboxPlugin = require('workbox-webpack-plugin');

class FileListPlugin {
  apply(compiler) {
    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, callback) => {
      let a = { files: [] };
      for (let filename in compilation.assets) {
        a.files.push(filename);
        let f = filename.split('.');
        let filetype = f[f.length - 1];
        if (filetype === 'css' || filetype === 'js')
          a[filetype] = {
            filename: filename,
            hash: f[f.length - 2]
          };
      }
      const a2 = JSON.stringify(a);
      // Insert this list into the webpack build as a new file asset:
      compilation.assets['filelist.json'] = {
        source: () => { return a2 },
        size: () => { return a2.length }
      };
      callback();
    });
  }
}

module.exports = {
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
    // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.InjectManifest#InjectManifest
    // new WorkboxPlugin.InjectManifest({
    //   swSrc: './service-worker.js',
    // }),
    // https://developers.google.com/web/tools/workbox/reference-docs/latest/module-workbox-webpack-plugin.GenerateSW#GenerateSW
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ]
};
