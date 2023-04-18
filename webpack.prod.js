const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const { merge } = require("webpack-merge");
const common = require("./webpack.common");

const localConfig = {
	mode: "production",
};

module.exports = merge(common, localConfig);
