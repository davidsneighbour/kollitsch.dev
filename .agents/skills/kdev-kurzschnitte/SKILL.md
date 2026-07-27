---
name: kdev-kurzschnitte
description: Create, standardise, or refactor one Kurzschnitte link-collection post for kollitsch.dev. Use when given a set of URLs, browser tabs, bookmarks, or an existing Kurzschnitte draft that must become a categorised, reader-facing post with the correct edition number, title, metadata, introduction, categories, link descriptions, and repository validation.
---

# KDEV Kurzschnitte

Create or refactor exactly one post in the `Kurzschnitte II` series.

The skill turns a loose URL collection into an editorial post for the audience of
kollitsch.dev: web developers, designers, technical generalists, independent
makers, and curious people who enjoy useful or unusual parts of the web.

## Required outcome

The finished post MUST:

1. use the edition definition from `resources/editions.yaml`;
2. follow the canonical frontmatter and body structure below;
3. group every retained link into a meaningful category;
4. give every link an appealing, accurate editorial description;
5. remove duplicates and obvious low-value links;
6. preserve the author's dry, mildly playful voice without becoming promotional;
7. pass the repository's applicable content checks.

Do not produce a raw bookmark dump.

## Inputs

Accept any combination of:

- an edition number;
- a list of URLs;
- a browser-tab export;
- notes attached to URLs;
- an existing Kurzschnitte post to refactor;
- a requested publication date.

When the edition number is missing:

1. inspect existing `kurzschnitte-ii-*` posts;
2. select the first unused edition number;
3. confirm that the number exists in `resources/editions.yaml`;
4. stop rather than inventing a title when no configured edition exists.

## Repository context

Before editing:

1. read `AGENTS.md`;
2. load all applicable `.agents/instructions/*.instructions.md` files;
3. inspect `src/content.config.ts`;
4. inspect the most recent two Kurzschnitte posts;
5. locate the matching edition in `resources/editions.yaml`;
6. create the post directly in the established content location.

Expected post path:

```text
src/content/blog/<year>/kurzschnitte-ii-<number>/index.md
```

Use `.mdx` only when the post requires an imported component such as `Youtube`.

## Research and link intake

For every supplied URL:

1. open the canonical page;
2. identify what it is, who made it, and why it matters;
3. prefer the canonical URL over tracking, redirect, AMP, mirror, or duplicated URLs;
4. record whether it is accessible, stale, redirected, paywalled, abandoned, or unsafe;
5. check whether the same URL or substantially identical resource already appears in
   the current post;
6. retain only links that provide enough value to justify a reader's attention.

Do not infer page contents from the URL, title, social preview, or repository name
when the source can be inspected.

For inaccessible links:

- retry through the canonical domain or repository;
- use reliable first-party metadata when available;
- omit the link when its purpose cannot be verified;
- report omitted or unresolved URLs after the draft.

## Categorisation

Every retained link MUST belong to exactly one primary category.

Choose the smallest useful set of categories for the edition. Prefer established
headings when they fit:

- `WebDev`
- `Design`
- `Tools`
- `Learn`
- `Accessibility`
- `Privacy and security`
- `AI`
- `Food for thought`
- `Fun and stuff`
- `FOMO`
- `Watch`
- `Read`
- `Listen`

Category rules:

- categories describe reader intent, not merely the source type;
- create a new category only when at least two links justify it, except for media
  sections such as `Watch`, `Read`, or `Listen`;
- avoid near-duplicates such as `Tools`, `Dev tools`, and `Useful tools`;
- do not place everything technical under `WebDev`;
- move a link to the category where its main value is clearest;
- order categories from the target audience's strongest practical interest to the
  broadest or most playful material;
- order links within each category for narrative flow, not alphabetically;
- in the final output keep the order of categories if they appear the same way they appear in the list above.

## Link descriptions

Each normal link MUST be a Markdown list item containing:

1. a natural editorial lead-in;
2. a descriptive linked title or meaningful linked phrase;
3. what the resource does or argues;
4. why a kollitsch.dev reader may care;
5. a concrete distinguishing detail where useful.

Preferred length: 45-90 words.

A description MUST be:

- accurate and grounded in the source;
- appealing without sounding like advertising copy;
- specific enough that the reader can decide whether to open the link;
- written in British English;
- self-contained;
- varied in rhythm and opening structure;
- mildly opinionated when the source supports an editorial observation.

A description MUST NOT:

- begin repeatedly with "`<Site>` is ...";
- use empty praise such as "great", "awesome", "amazing", or "must-see";
- repeat marketing claims as facts;
- address the reader as "we" merely to simulate enthusiasm;
- duplicate the same link in parenthetical references;
- mention stars, forks, user counts, or release recency unless genuinely relevant;
- over-explain elementary web concepts to the technical target audience;
- claim that a tool is free, open source, private, accessible, or production-ready
  without verification;
- summarise only the page title.

Use one link per list item unless a second link provides essential context.

### Media items

A `Watch`, `Listen`, or similar section MAY use prose plus the repository's existing
media component instead of a list item. Inspect the latest valid example before
adding an import or component.

## Canonical frontmatter

Use this shape unless the current content schema requires an additional field:

```yaml
---
title: Kurzschnitte II - <edition title>
linktitle: Kurzschnitte II/<number>
description: <edition-specific description>
date: <ISO-8601 timestamp>
tags:
  - kurzschnitte
  - bookmarks
cover:
  src: kurzschnitte.jpg
  title: Short Cuts
  type: image
---
```

Frontmatter rules:

- `title` MUST use the configured title verbatim.
- `linktitle` MUST use the Arabic edition number.
- `description` MUST be 140-160 characters where practical.
- Put the essential meaning in the first 120 characters.
- The description SHOULD describe this edition, not repeat the generic historical
  sentence used by older posts.
- `date` MUST be a valid ISO-8601 timestamp.
- Tags MUST use YAML list format.
- Do not add speculative metadata merely for symmetry.
- Preserve any repository-required field introduced by the current schema.
- DO NOT remove the two existing items in `tags`.
- DO NOT change the `cover` setup.

## Introduction

Start with this established series premise, rewritten naturally rather than copied
mechanically:

> A new edition of opened and orphaned browser tabs that never made it into a
> standalone post or another useful destination.

Then incorporate the configured `hint` as a subtle joke or thematic reference.

The introduction SHOULD:

- be one or two short paragraphs;
- sound like the author;
- hint at the title's reference without explaining it immediately;
- avoid generic announcements and filler;
- transition cleanly into the first category.

Do not turn the hint into a blockquote definition unless the reference genuinely
needs explanation.

## Canonical body structure

```markdown
<edition-specific introduction>

## <Category>

- <Appealing and accurate description with a naturally embedded link.>

- <Appealing and accurate description with a naturally embedded link.>

## <Next category>

- <Description ...>
```

Use blank lines between list items, matching the current preferred post style.

## Drafting workflow

1. Normalise and deduplicate the URL input.
2. Research every URL.
3. Reject or flag unverifiable and low-value links.
4. Assign one primary category to every retained link.
5. Review the category set and merge weak or overlapping sections.
6. Draft link descriptions.
7. Draft the introduction from the edition title and hint.
8. Generate canonical frontmatter.
9. Assemble the post.
10. Re-read the post for category coherence, repetition, factual overreach, and tone.
11. Run the validation workflow.

## Refactoring an existing post

When updating an older Kurzschnitte post:

- preserve its edition number and configured title;
- normalise frontmatter to the canonical shape;
- retain worthwhile editorial remarks;
- verify every URL again;
- consolidate categories where useful;
- rewrite weak, repetitive, promotional, or vague descriptions;
- remove duplicate raw links and redundant source labels;
- do not change publication date unless explicitly instructed;
- do not silently replace a dead link with a different resource.

## Validation

Run the narrowest applicable checks first:

```bash
npm run lint:markdown
npm run check
npm test
```

Also run any post-specific or repository-wide check required by applicable
instructions.

Before declaring completion, verify:

- edition number, title, and hint match `resources/editions.yaml`;
- filename/path and `linktitle` use the same number;
- all retained links are categorised;
- no link appears twice;
- every description explains both substance and relevance;
- descriptions do not contain unsupported claims;
- headings are useful and consistently capitalised;
- frontmatter validates against the current schema;
- the introduction contains a subtle edition reference;
- no imported MDX component is unused;
- the post contains no placeholder text.

## Completion report

Return:

1. created or updated path;
2. edition number and title;
3. number of supplied, retained, omitted, and unresolved links;
4. final category list with item counts;
5. validation commands and results;
6. concise notes for omitted or unresolved URLs.

Do not commit or publish unless the user's current request and repository rules
authorise that action.
