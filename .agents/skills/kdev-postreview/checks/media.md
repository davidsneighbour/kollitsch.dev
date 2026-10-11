# Media

## Purpose

Verify body embeds, imports, local assets, and referenced media.

## Input

`.agents/instructions/content-blog-youtube-embed.instructions.md`, schema, media components under `src/components/content/media/`, and `src/scripts/content/fetch-youtube-thumbnails.ts`.

## Verify

YouTube uses MDX `Youtube`, import after frontmatter and before prose, required `video`/`label`, no raw `lite-youtube`; other media props and local references match actual consumers. Review `sourcecode` references when present.

## Method

Inspect complete source and component contracts. Check local file resolution and imports. Read thumbnail script arguments before running: fetch/verify operations may require network/API access and write assets. Render affected embeds when required; do not pretend HTTP success establishes working playback.

## Output

Embed types, props/imports, asset paths, thumbnails, and rendered versus source-only evidence.

## Pass/fail

Binding embed/asset defects fail. Remote availability or required render evidence unavailable blocks. No body media is skipped with a reason.

## Remediation

Correct only requested media and imports; migration may rename `.md` to `.mdx`. Apply cover consequences and rerun relevant checks. Let commit hooks fetch thumbnails under repository rules.
