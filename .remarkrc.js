import remarkFrontmatter from "remark-frontmatter";
import remarkLintFrontmatterSchema from "remark-lint-frontmatter-schema";

const remarkConfig = {
  plugins: [
    [
      "@davidsneighbour/remark-config",
      ["remark-lint-write-good", false],

      [
        "remark-lint-no-undefined-references",
        {
          allow: ["!NOTE", "!TIP", "!CAUTION", "!IMPORTANT", "!WARNING"],
        },
      ],
    ],
    remarkFrontmatter,
    [
      remarkLintFrontmatterSchema,
      {
        schemas: {
          "./static/_schemata/blog.schema.yaml": [
            "./.frontmatter/content/blog/**/*.{md,mdx}",
          ],
        },
      },
    ],
  ],
};

export default remarkConfig;
