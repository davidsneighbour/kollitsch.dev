---
applyTo: "**/*.{md,mdx}"
---

# Markdown conventions

- Read the applicable Markdown checks in `.lintstagedrc.ts` and their rule sources before writing: `src/config/.markdownlint.jsonc`, `src/config/.vale.ini`, and `src/config/typos.toml`. Rules enabled by default still apply when they are not listed individually in the configuration.
- A staged `.md` or `.markdown` file MUST have no Vale errors (`vale --config src/config/.vale.ini --minAlertLevel=error`); the commit hook stops the commit otherwise. Fix the text, add a real term to `src/config/vale/config/vocabularies/kollitsch-dev/accept.txt`, or tune the rule in `src/config/.vale.ini` with a comment. See `documentation/content/vale.md`.
- Use one blank line between prose blocks, headings, and lists. Do not leave consecutive blank lines outside code blocks (`MD012` in the Markdown lint configuration). The prose line-length rule is disabled (`MD013`); preserve logical paragraphs rather than adding fixed-width wrapping.
- When a Markdown check exposes another undocumented repository convention, follow `AGENTS.md`'s convention-capture rule and record it in the narrowest applicable instruction, without copying the whole checker configuration.
