import remarkFrontmatter from 'remark-frontmatter';
import remarkLintFrontmatterSchema from 'remark-lint-frontmatter-schema';

const remarkConfig = {
	plugins: [
		remarkFrontmatter,
		[
			remarkLintFrontmatterSchema,
			{
				schemas: {
					'./static/_schemata/**.schema.yaml': [
						'./content/**/*.md',
					],
				},
			},
		],
	],
};

export default remarkConfig;
