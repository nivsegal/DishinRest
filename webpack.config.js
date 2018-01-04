var path = require('path');
var webpack = require('webpack');

module.exports = {
	entry: ["babel-polyfill", './assets/js/main.jsx'],
	output: {
		path: path.join(__dirname, 'assets', 'js', 'bundles'),
		filename: 'bundle.js',
		publicPath: '/js/'
	},
	module: {
		loaders: [
			{
				test: /.jsx?$/,
				loader: 'babel-loader',
				exclude: /node_modules/,
				query: {
					plugins: [
						'transform-decorators-legacy',
					],
					presets: ['es2015', 'react', 'stage-1'],
				}
			},
			{ test: /.(png|jpg|svg)$/, loader: 'url-loader?limit=8192' },
			{
				test: /\.css$/,
				include: /node_modules/,
				loaders: ['style-loader', 'css-loader'],
			}
		]
	}
};