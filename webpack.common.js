const path = require('path');

module.exports = {
	target: ['browserslist'],

	entry: {
		main: path.join(__dirname, 'assets/js', 'script.ts'),
		styles: path.join(__dirname, 'assets/scss', 'style.scss'),
	},

	output: {
		path: path.join(__dirname, 'static/assets/theme/'),
		filename: '[name].js',
		chunkFilename: '[id].css',
		clean: true,
	},

	performance: {
		maxEntrypointSize: 400_000,
		maxAssetSize: 100_000,
		hints: 'warning',
	},

	optimization: {
		splitChunks: {
			chunks: 'all',
		},
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				loader: 'babel-loader',
				test: /\.js?$/,
				exclude: /node_modules/,
			},
			{
				test: /\.css$/i,
				use: [
					'style-loader',
					'css-loader',
					{
						loader: 'postcss-loader',
						options: {
							postcssOptions: {
								plugins: [
									[
										'postcss-preset-env',
										{
											// Options
										},
									],
								],
							},
						},
					},
				],
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js', '.scss', '.css'],
	},
};
