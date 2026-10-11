---
applyTo: "src/content/blog/**/*.{md,mdx}"
---

# Blog post authoring

## Tags

Blog post `tags` frontmatter values MUST be lowercase kebab-case: only lowercase ASCII letters (`a`-`z`), digits (`0`-`9`), and single dashes between words.

- Use `100-days-to-offload`, not `100DaysToOffload` or `100daystooffload`.
- Use `alfred-hitchcock`, not `alfred hitchcock`.

Tags MUST NOT contain consecutive dashes (`--`, `---`), spaces, underscores, camel case, PascalCase, leading hash marks, or slash-prefixed route aliases.

Write `tags` as a block list with one tag per line, never as an inline YAML array:

```yaml
tags:
  - tag1
  - tag2
```

## Markdown extensions

Definition lists are supported (`remark-definition-list`):

```markdown
Term
: Definition of the term

Another term
: Another definition
```

Consecutive `Term`/`: Definition` pairs separated by a single blank line stay in the same `<dl>`; a blank line followed by a non-definition block (or two blank lines) ends the list. Keep the blank lines between items for readability even when markdownlint suggests collapsing them.

`--` and `---` are converted to dashes by `remarkDnbTypography` (see `documentation/development/markdown-typography.md`).

## Embeds

Before adding or changing a YouTube video, read `.agents/references/youtube-embed.md`.
