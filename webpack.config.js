import path from 'path';
import TerserPlugin from "terser-webpack-plugin";
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const __dirname = import.meta.dirname;

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

let config = {

  mode: 'production',

  entry: {
    main: path.resolve(__dirname, "themes/theme/assets/js", "script.js"),
  },

  output: {
    path: path.resolve(__dirname, 'static/assets/'),
    filename: "[name].js",
    chunkFilename: "[id].js",
    assetModuleFilename: "[hash][ext][query]",
    clean: true,
  },

  performance: {
    maxEntrypointSize: 100000,
    maxAssetSize: 250000,
    hints: "warning",
  },

  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
    emitOnErrors: true,
    moduleIds: "deterministic",
    runtimeChunk: "single",

    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all",
        },
      },
    },
    mangleWasmImports: true,
    mangleExports: "deterministic",

  },

  devtool: "eval-source-map",

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader",
          "postcss-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
    ]
  },

  resolve: {
    extensions: ['.*', '.js', '.jsx']
  },

  plugins: [
    new FileListPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  ],

};

export default config;
