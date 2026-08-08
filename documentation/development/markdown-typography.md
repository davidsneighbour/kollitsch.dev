# Markdown typography

Post Markdown uses a local remark plugin, `src/utils/markdown-typography.ts`
(`remarkDnbTypography`), to restore Hugo-style prose shortcuts that are not
part of CommonMark itself:

| Source text | Rendered character |
| --- | --- |
| `---` | `—` em dash |
| `--` | `–` en dash |
| `-` | unchanged hyphen |

The plugin is wired into the Markdown processor in `astro.config.ts` alongside
`remark-kbd-nested` and `remark-definition-list`:

```ts
processor: unified({
  remarkPlugins: [remarkKbdNested, remarkDefinitionList, remarkDnbTypography],
  remarkRehype: { handlers: { ...defListHastHandlers } },
}),
```

The transform visits only mdast `text` nodes. Inline code, fenced code, block
HTML, raw HTML tags/attributes, and frontmatter are separate nodes and are
intentionally not changed. Text between inline HTML tags still counts as
normal paragraph text and receives the same typography replacements as
surrounding prose.

Additional plain-text replacements can be added by extending the
`TypographyReplacement` list passed to `remarkDnbTypography`; longer patterns
must appear before shorter patterns when they overlap (see
`src/utils/markdown-typography.ts` and its co-located test file).

Ported from the equivalent feature in the sister project
[samui-samui.de](https://github.com/davidsneighbour/samui-samui.de/blob/main/documentation/content/markdown-typography.md).
