---
applyTo: "**/*.{md,mdx}"
---

# Markdown conventions

- Read the applicable Markdown checks in `.lintstagedrc.ts` and their rule sources before writing: `src/config/.markdownlint.jsonc`, `src/config/.vale.ini`, and `src/config/typos.toml`. Rules enabled by default still apply when they are not listed individually in the configuration.
- Use one blank line between prose blocks, headings, and lists. Do not leave consecutive blank lines outside code blocks (`MD012` in the Markdown lint configuration). The prose line-length rule is disabled (`MD013`); preserve logical paragraphs rather than adding fixed-width wrapping.
- When a Markdown check exposes another undocumented repository convention, follow `AGENTS.md`'s convention-capture rule and record it in the narrowest applicable instruction, without copying the whole checker configuration.
