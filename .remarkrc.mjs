import remarkFrontmatter from 'remark-frontmatter';
import remarkLintFrontmatterSchema from 'remark-lint-frontmatter-schema';

const remarkConfig = {
	plugins: [
		[
			"@davidsneighbour/remark-config",
			["remark-lint-write-good", false]
		],
		remarkFrontmatter,
		[
			remarkLintFrontmatterSchema,
			{
				schemas: {
					'./static/_schemata/**.schema.yaml': [
						'./content/**/*.{md,mdx}',
					],
				},
			},
		],
	],
};

export default remarkConfig;
