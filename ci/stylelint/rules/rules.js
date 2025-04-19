const rules = {
	"alpha-value-notation": [
		"number",
		{
			exceptProperties: [
				"opacity",
				"fill-opacity",
				"flood-opacity",
				"stop-opacity",
				"stroke-opacity",
			],
		},
	],
	"annotation-no-unknown": true,
	"at-rule-disallowed-list": ["debug"],
	"at-rule-empty-line-before": [
		"always",
		{
			except: ["blockless-after-same-name-blockless", "first-nested"],
			ignore: ["after-comment"],
		},
	],
	"at-rule-no-unknown": null,
	"at-rule-no-vendor-prefix": true,
	"block-no-empty": true,
	"color-function-notation": null,
	"color-hex-length": "long",
	"color-named": "never",
	"color-no-invalid-hex": true,
	"comment-empty-line-before": [
		"always",
		{
			except: ["first-nested"],
			ignore: ["stylelint-commands"],
		},
	],
	"comment-no-empty": true,
	"comment-whitespace-inside": "always",
	"custom-media-pattern": [
		"^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
		{
			message:
				'(name) => `Expected custom media query name "${name}" to be kebab-case`',
		},
	],
	"custom-property-empty-line-before": [
		"always",
		{
			except: ["after-custom-property", "first-nested"],
			ignore: ["after-comment", "inside-single-line-block"],
		},
	],
	"custom-property-no-missing-var-function": true,
	"custom-property-pattern": [
		"^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
		{
			message:
				'(name) => `Expected custom property name "${name}" to be kebab-case`',
		},
	],
	"declaration-block-no-duplicate-custom-properties": true,
	"declaration-block-no-duplicate-properties": [
		true,
		{
			ignore: ["consecutive-duplicates-with-different-values"],
		},
	],
	"declaration-block-no-redundant-longhand-properties": true,
	"declaration-block-no-shorthand-property-overrides": true,
	"declaration-block-single-line-max-declarations": 1,
	"declaration-empty-line-before": [
		"always",
		{
			except: ["after-declaration", "first-nested"],
			ignore: ["after-comment", "inside-single-line-block"],
		},
	],
	"declaration-property-value-disallowed-list": {
		border: ["none"],
		"border-bottom": ["none"],
		"border-left": ["none"],
		"border-right": ["none"],
		"border-top": ["none"],
	},
	"font-family-name-quotes": "always-where-recommended",
	"font-family-no-duplicate-names": true,
	"font-family-no-missing-generic-family-keyword": true,
	"font-weight-notation": "numeric",
	"function-calc-no-unspaced-operator": true,
	"function-linear-gradient-no-nonstandard-direction": true,
	"function-name-case": "lower",
	"function-no-unknown": null,
	"function-url-quotes": "always",
	"hue-degree-notation": "angle",
	"import-notation": "string",
	"keyframe-block-no-duplicate-selectors": true,
	"keyframe-declaration-no-important": true,
	"keyframe-selector-notation": "percentage-unless-within-keyword-only-block",
	"keyframes-name-pattern": [
		"^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
		{
			message: '(name) => `Expected keyframe name "${name}" to be kebab-case`',
		},
	],
	"length-zero-no-unit": [
		true,
		{
			ignore: ["custom-properties"],
		},
	],
	"max-nesting-depth": [
		3,
		{
			ignoreAtRules: ["each", "media", "supports", "include"],
		},
	],
	"media-feature-name-no-unknown": true,
	"media-feature-name-no-vendor-prefix": true,
	"named-grid-areas-no-invalid": true,
	"no-descending-specificity": true,
	"no-duplicate-at-import-rules": true,
	"no-duplicate-selectors": true,
	"no-empty-source": true,
	"no-invalid-double-slash-comments": true,
	"no-invalid-position-at-import-rule": null,
	"no-irregular-whitespace": true,
	"number-max-precision": 4,
	"plugin/no-unsupported-browser-features": [
		true,
		{
			browsers: "extends @davidsneighbour/browserslist-config",
			severity: "warning",
			ignore: ["rem", "css-nesting"],
			ignorePartialSupport: true,
		},
	],
	"property-no-unknown": true,
	"property-no-vendor-prefix": true,
	"rule-empty-line-before": [
		"always-multi-line",
		{
			except: ["first-nested"],
			ignore: ["after-comment"],
		},
	],
	"selector-attribute-quotes": "always",
	"selector-class-pattern": [
		"^[a-z0-9\\-]+$",
		{
			message:
				"Selector should be written in lowercase with hyphens (selector-class-pattern)",
		},
	],
	"selector-id-pattern": [
		"^([a-z][a-z0-9]*)(-[a-z0-9]+)*$",
		{
			message:
				'(selector) => `Expected id selector "${selector}" to be kebab-case`',
		},
	],
	"selector-max-compound-selectors": 3,
	"selector-max-id": 1,
	"selector-no-qualifying-type": [
		true,
		{
			ignore: ["attribute", "class"],
		},
	],
	"selector-no-vendor-prefix": true,
	"selector-not-notation": "complex",
	"selector-pseudo-class-no-unknown": true,
	"selector-pseudo-element-colon-notation": "double",
	"selector-pseudo-element-no-unknown": true,
	"selector-type-case": "lower",
	"selector-type-no-unknown": [
		true,
		{
			ignore: ["custom-elements"],
		},
	],
	"shorthand-property-no-redundant-values": true,
	"string-no-newline": true,
	"unit-no-unknown": true,
	"value-keyword-case": "lower",
	"value-no-vendor-prefix": [
		true,
		{
			ignoreValues: ["box", "inline-box"],
		},
	],
	"scss/at-extend-no-missing-placeholder": null,
	"scss/at-function-pattern": "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
	"scss/at-import-no-partial-leading-underscore": true,
	"scss/at-import-partial-extension-blacklist": ["scss"],
	"scss/at-mixin-pattern": "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
	"scss/at-rule-no-unknown": true,
	"scss/dollar-variable-colon-space-after": "always",
	"scss/dollar-variable-colon-space-before": "never",
	"scss/dollar-variable-pattern": "^[_]?[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
	"scss/function-no-unknown": [
		true,
		{ ignoreFunctions: ["tint-color", "shade-color"] },
	],
	"scss/percent-placeholder-pattern": "^[a-z]+([a-z0-9-]+[a-z0-9]+)?$",
	"scss/selector-no-redundant-nesting-selector": true,
};

export default rules;
