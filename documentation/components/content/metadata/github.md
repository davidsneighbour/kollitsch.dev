---
title: Github
tags: []
created: 2026-07-27T00:00:00+07:00
updated: 2026-07-27T00:00:00+07:00
---

Renders the post's source-control row: the commit hash the post file was last changed in, plus links to its history, blame, and a GitHub edit suggestion.

## File locations

| Field | Value |
| --- | --- |
| Component | `src/components/content/metadata/Github.astro` |
| Data | none; resolves Git info via `getGithubInfo()` in [`src/utils/github.ts`](../../../../src/utils/github.ts) |
| Tests | [`src/components/content/metadata/Github.test.ts`](../../../../src/components/content/metadata/Github.test.ts) |

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `post` | `CollectionEntry<"blog">` | required | The post whose source file's Git info should be shown |

## Usage

```astro
---
import Github from '@components/content/metadata/Github.astro';
---

<Github post={post} />
```

## Behaviour

This component has no client-side behaviour. It calls `getGithubInfo(post.filePath)` and renders nothing if that returns falsy (no `filePath`, or the lookup fails). When info is available, it shows:

- The short commit hash, as a link to the commit when `commitUrl` is present, or plain text when it isn't, or the literal text `UNTRACKED` when there is no `hash` at all (uncommitted changes).
- Links to the file's History, Blame, and an "Suggest edits on GitHub" link (`editUrl`), separated by slash icons.
