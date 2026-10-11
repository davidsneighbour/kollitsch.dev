# Frontmatter authority

Use [the frontmatter check](../checks/frontmatter.md) and `src/content/blog-schema.ts` for executable validation. `src/content.config.ts` wires the loader, which injects `contentFormat` before parsing. `documentation/content/frontmatter.md` is the field index; inspect the schema and consumers when documentation differs.

Do not maintain a second field registry in this skill. Schema parsing normalises some values and drops unknown object keys; validation must never rewrite the raw frontmatter with parsed/transformed output. Preserve unknown fields and inspect their consumers before proposing removal.

The description editorial rule is defined in [the SEO check](../checks/seo.md). Tags follow `.agents/instructions/content-blog.instructions.md`. Cover schema and filesystem conventions are separate requirements covered by [the cover check](../checks/cover.md).
