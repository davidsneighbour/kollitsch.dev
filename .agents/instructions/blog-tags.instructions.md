---
title: "Blog tag instructions"
applyTo: "src/content/blog/**/*.{md,mdx}"
---

Blog post `tags` frontmatter values MUST be lowercase kebab-case.

Tags MUST use only lowercase ASCII letters (`a`-`z`), digits (`0`-`9`), and
dashes.

Use dashes between words:

- Use `100-days-to-offload`, not `100DaysToOffload` or `100daystooffload`.
- Use `alfred-hitchcock`, not `alfred hitchcock`.

Tags MUST NOT contain consecutive dashes. Use `-` only as a single separator,
never `--` or `---`.

Do not use spaces, underscores, camel case, PascalCase, leading hash marks, or
slash-prefixed route aliases in the `tags` frontmatter property.

Write `tags` as a block list, with one tag per line. Do not use an inline YAML
array for tags.

Do not write:

```yaml
tags: ["tag1", "tag2", "tag3"]
```

Write this instead:

```yaml
tags:
  - tag1
  - tag2
  - tag3
```
