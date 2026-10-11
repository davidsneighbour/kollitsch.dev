# Metadata generation

Generate metadata only after reading the complete post and only in an authorised editing operation. Tags use lowercase kebab-case IDs and YAML block lists under the binding tag instructions; prefer canonical IDs over display labels. Description limits come from `../checks/seo.md`.

## Tags

### Objective

Produce a restrained set of established topical terms that accurately classify the post.

### Procedure

1. Extract the post's central subjects.
2. Identify named entities that materially affect the post.
3. Inspect the repository's existing tags.
4. Map candidate terms to established taxonomy spelling.
5. Remove:

   * incidental mentions
   * synonyms of selected tags
   * format-based terms
   * terms unsupported by the post
6. Retain valid existing tags.
7. Explain removed or materially renamed tags.

### Output

Return tags in the format required by the repository schema.

Do not impose an arbitrary count unless the repository defines one.

## Description

### Objective

Write a concise standalone explanation of the post's subject and distinguishing context.

### Procedure

1. Determine the post's principal subject.
2. Determine what makes this post specific.
3. Write one compact description in the post's language.
4. Remove repetition of the title.
5. Check every factual statement against the post.
6. Enforce repository length and style rules.

### Quality test

A reader seeing only the title and description should understand what the post covers and why this particular post is distinct.

## Summary

### Objective

Condense the post's main narrative, argument, event, or observation.

### Procedure

1. Read the complete post.
2. Identify the main development or conclusion.
3. Preserve necessary context.
4. Exclude minor examples unless essential.
5. Write in the post's language.
6. Ensure it is not merely a rewritten description.
7. Enforce repository length and style rules.

### Quality test

A reader should understand the substance of the post without the summary pretending to replace the full article.

An omitted or empty summary falls back to the description in `blogSchema`. Do not add a summary merely to satisfy a review checklist; generate a distinct synopsis only when useful and requested.

## Description and summary distinction

Use this default distinction unless the repository defines another:

* `description`: what the post is about
* `summary`: what the post says or what happens in it

## Prohibited generation behaviour

Do not:

* invent missing facts
* add search keywords unrelated to the text
* insert promotional claims unsupported by the post
* expose private notes
* change historical facts to current equivalents
* infer a person's identity from insufficient context
* infer a location from weak contextual evidence
* generate metadata from the title alone
