const path = require("path");

module.exports = {
  target: ["browserslist"],

  entry: {
    main: path.join(__dirname, "assets/js", "script.ts"),
  },

  output: {
    path: path.join(__dirname, "static/assets/theme"),
    filename: "[name].js",
    chunkFilename: "[id].css",
    clean: true,
  },

  performance: {
    maxEntrypointSize: 400000,
    maxAssetSize: 100000,
    hints: "warning",
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        loader: "babel-loader",
        test: /\.js?$/,
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
};
