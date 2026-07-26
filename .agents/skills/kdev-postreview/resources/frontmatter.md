# Frontmatter rules

This file defines repository-specific frontmatter rules for blog posts.

The content schema and executable repository validation remain authoritative. Keep this document aligned with them.

## How to maintain this file

For each field, document:

* field name
* required or optional
* expected type
* permitted values
* default behaviour
* editorial meaning
* generation rules
* validation rules
* deprecation status
* examples

## Field registry

Add repository fields using this structure.

### `title`

* Status: required
* Type: string
* Purpose: public post title
* Generated: no
* Validation:

  * must not be empty
  * must accurately represent the post
  * must follow repository title conventions

### `date`

* Status: repository-defined
* Type: repository-defined
* Purpose: publication date
* Generated: no
* Validation:

  * must use the schema's expected format
  * must not be silently changed
  * future dates must be consistent with draft or scheduled status

### `tags`

* Status: repository-defined
* Type: array of strings
* Purpose: topical classification
* Generated: yes
* Format: YAML block list
* Validation:

  * use established repository taxonomy
  * remove duplicates
  * avoid format-only tags
  * avoid unsupported incidental topics
  * write tags as a YAML block list
  * do not use inline array syntax

Correct:

```yaml
tags:
  - tag1
  - tag2
  - tag3
```

Incorrect:

```yaml
tags: [tag1, tag2, tag3]
```

### `description`

* Status: repository-defined
* Type: string
* Purpose: standalone listing or metadata description
* Generated: yes
* Length:

  * maximum: 160 characters
  * preferred range: 140–160 characters
  * place the most important information within the first 120 characters because mobile displays may truncate the remainder
* Validation:

  * must accurately reflect the post
  * must not merely repeat the title
  * must not exceed 160 characters
  * should normally contain between 140 and 160 characters
  * must remain meaningful when truncated after approximately 120 characters
  * must place the central subject and distinguishing information before secondary context

### `summary`

* Status: repository-defined
* Type: string
* Purpose: compact editorial synopsis
* Generated: yes
* Validation:

  * must reflect the complete post
  * must differ meaningfully from `description`
  * must respect schema or repository length limits

### `cover`

* Status: repository-defined
* Type: object
* Purpose: cover image metadata
* Generated: no
* Validation:

  * referenced image must exist
  * nested fields must match the content schema
  * path must follow current repository conventions

## Unknown fields

Do not delete fields that are absent from this document.

For an unknown field:

1. inspect the content schema
2. search for its use in components and utilities
3. inspect its use in other posts
4. classify it as active, legacy, or uncertain
5. preserve it unless removal is explicitly justified

## Deprecated fields

Document deprecated fields here, including their replacement and migration procedure.

| Deprecated field | Replacement | Migration notes |
| ---------------- | ----------- | --------------- |
|                  |             |                 |
