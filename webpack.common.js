const path = require('path');

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
	target: 'web',
	entry: {
		theme: './themes/hugo-theme/assets/scss/style.scss',
	},
	output: {
		path: path.resolve(__dirname, 'themes/hugo-theme/static/assets/theme'),
		filename: '[name].[fullhash].js',
		clean: true,
	},
	devtool: 'source-map',
	performance: {
		maxEntrypointSize: 100000,
		maxAssetSize: 500000,
		hints: 'warning'
	},
	plugins: [
		new FileListPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.scss$/,
				use: [
					{ loader: 'style-loader' },
					{
						loader: 'css-loader', options: {
							sourceMap: true, modules: true,
							localIdentName: '[local]_[hash:base64:5]'
						}
					},
					{
						loader: 'sass-loader', options: { sourceMap: true }
					},
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							config: {
								path: 'postcss.config.js'
							}
						}
					}
				]
			},
			{
				test: /\.css$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
						}
					},
					{
						loader: 'postcss-loader'
					}
				]
			}
		]
	}
};
