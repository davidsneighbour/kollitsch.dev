---
applyTo: "**/*.md"
---
<!-- markdownlint-disable -->
<!-- showing samples of incorrect markdown -->
# Markdown style guide (based on project markdownlint rules)

## File structure

* Use YAML front matter when needed.
* Exactly one top-level heading per file ([MD025](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md025)).
* If front matter contains a `title`, treat it as the document's H1 for structure purposes ([MD001](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md001)).
* First line rule:

  * If no front matter `title`: the first line must be `# ...` ([MD041](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md041)).
  * If front matter `title` exists: start content with `## ...` and do not add another H1 ([MD041](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md041), [MD025](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md025), [MD001](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md001)).
* Heading levels must only increment by 1 (no `##` to `####`) ([MD001](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md001)).
* Files must end with a single newline ([MD047](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md047)).

## Headings

* Use ATX headings only: `# Heading` (not Setext) ([MD003](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md003)).
* Headings must start at column 1 (no indentation) ([MD023](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md023)).
* Use exactly one space after `#`:

  * `# Heading` ok
  * `#Heading` not ok ([MD018](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md018))
  * `#  Heading` not ok ([MD019](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md019))
* Surround headings with blank lines (except the first heading in the file) ([MD022](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md022)).
* Avoid duplicate sibling headings (same level, same parent) ([MD024](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md024)).
* No trailing punctuation in headings ([MD026](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md026)).
* Do not use emphasis to create headings (no faux headings like `**Heading**`) ([MD036](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md036)).

## Blank lines and whitespace

* Maximum 1 consecutive blank line ([MD012](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md012)).
* No tabs, spaces only ([MD010](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md010)).
* Trailing spaces are not allowed, except two trailing spaces to force a hard line break ([MD009](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md009)).

## Lists

* Unordered lists use `*` only (no `-` or `+`) ([MD004](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md004)).
* Keep list indentation consistent at the same level ([MD005](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md005)).
* Nested unordered lists are indented by 2 spaces; first level is not indented ([MD007](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md007)).
* Ordered list numbering must be consistent (either all `1.` or correctly consecutive) ([MD029](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md029)).
* Exactly one space after list markers ([MD030](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md030)).
* Lists must be surrounded by blank lines ([MD032](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md032)).

## Blockquotes

* Exactly one space after `>` ([MD027](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md027)).
* Blank lines inside blockquotes create separate blockquote blocks (not paragraphs inside one) ([MD028](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md028)).

## Code

* Use fenced code blocks only ([MD046](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md046)).
* Code fences use backticks, not tildes ([MD048](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md048)).
* Fenced code blocks must be surrounded by blank lines ([MD031](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md031)).
* Fenced code blocks must specify a language ([MD040](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md040)).
* Inline code must not have spaces inside backticks ([MD038](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md038)).
* In shell command examples, do not prefix every command with `$` unless you show output ([MD014](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md014)).

## Emphasis

* Use asterisks for emphasis: `*text*` (no underscores) ([MD049](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md049)).
* Use asterisks for strong: `**text**` (no double underscores) ([MD050](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md050)).
* No spaces inside emphasis markers: `*text*`, not `* text *` ([MD037](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md037)).

## Links

* Use correct link syntax order: `[text](url "title")` ([MD011](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md011)).
* Do not use bare URLs in prose; wrap them as links. Bare URLs are allowed inside inline code ([MD034](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md034)).
* No empty links ([MD042](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md042)).
* Link fragments must be valid (must point to an existing heading) ([MD051](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md051)).
* References in links/images must be defined, and there must be no orphaned references ([MD052](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md052), [MD053](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md053)).
* Autolinks are not prohibited by this config, but keep link formatting consistent with the above rules ([MD054](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md054)).
* Avoid generic link text: `click here`, `here`, `link`, `more` ([MD059](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md059)).

## Images

* Images must have alt text ([MD045](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md045)).

## Tables

* Tables must be surrounded by blank lines ([MD058](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md058)).
* Use leading and trailing pipes for every row ([MD055](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md055)).
* Table column counts must match the header row ([MD056](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md056)).
* Use compact table spacing (single spaces around cell content) ([MD060](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md060)).

## HTML in Markdown

* Inline HTML is disallowed except the allowed elements:
  * `lite-youtube`, `color-grid`, `date-diff`, `kbd`, `dnb-syncstring` ([MD033](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md033)).
* In tables, only `<kbd>` is allowed ([MD033](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md033)).

## Horizontal rules

* Horizontal rules (when used) must be exactly `---` ([MD035](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md035)).

## Notes on rules not enforced by this config

* No line length limit ([MD013](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md013)).
* Closed ATX heading rules are not enforced ([MD020](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md020), [MD021](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md021)).
* Header structure / required heading order rule is not enforced ([MD043](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md043)).
* Spelling / proper names rule is not enforced ([MD044](https://raw.githubusercontent.com/DavidAnson/markdownlint/main/doc/Rules.md#md044)).

## Validation and linting

* The active markdownlint configuration is defined in [.markdownlint.jsonc](../../src/config/.markdownlint.jsonc).
* Run `npm run lint:markdown -- FILEREFERENCE` to check whether a Markdown document conforms to this style guide and the configured markdownlint rules.
* Use `npm run lint:markdown:fix -- FILEREFERENCE` to automatically fix all rules that support safe auto correction.
* All documentation and content files MUST pass `lint:markdown` with zero errors before being committed.
* Use [.markdownlintignore](../../src/config/.markdownlintignore) to exclude files or directories from linting as needed.
* Use `npm run lint:links` to validate all links in Markdown files.
