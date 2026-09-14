# Content link markers

Use `BrokenLink.astro` only for historically useful links that are currently unavailable and should stay visible in the article.

In MDX, import the component and wrap the link text:

```mdx
import BrokenLink from "@components/content/links/BrokenLink.astro";

This sentence has a <BrokenLink href="https://example.com/old-post" reason="timeout" checked="2026-09-14">currently unavailable reference</BrokenLink>.
```

In Markdown, keep the normal Markdown link and add the adjacent web component marker:

```markdown
This sentence has a [currently unavailable reference](https://example.com/old-post) <broken-link reason="timeout" checked="2026-09-14"></broken-link>.
```

Markdown posts that use `<broken-link>` must include the component loader in frontmatter:

```yaml
options:
  head:
    components:
      - broken-link
```

The stable reason values are `redirect-loop`, `tls-error`, `timeout`, `server-error`, `temporarily-unavailable`, and `unknown`. Do not use these markers as a Lychee ignore list; Lychee synchronisation is a separate editorial workflow.
