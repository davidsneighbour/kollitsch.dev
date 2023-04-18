const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const localConfig = {
	mode: "development",
	"devtool": "inline-source-map",
};

module.exports = merge(common, localConfig);
