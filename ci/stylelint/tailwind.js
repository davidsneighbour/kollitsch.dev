/**
 * see https://stylelint.io/user-guide/rules/list/
 * see https://stylelint.io/user-guide/rules/regex/
 */
import rules from "./rules/rules.js";
import order from "./order/order.js";

const config = {
	customSyntax: "postcss-scss",
	cache: true,
	extends: ["stylelint-config-standard-scss"],
	ignoreFiles: [],
	plugins: ["stylelint-no-unsupported-browser-features", "stylelint-order"],
	rules, // insert rules
	...order, // merger order settings
};

export default config;
