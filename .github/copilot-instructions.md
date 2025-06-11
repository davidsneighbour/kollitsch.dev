# Copilot instructions

## General instructions

* Always add and keep excessive comments.
* In JavaScript code use ESM format (export/import) instead of any AMD code.
* In JavaScript code refactoring change from AMD to ESM where possible.
* Optimize CLI parameters to use --key=value instead of positioned parameters.
* If a script is run on a single file or directory keep the name as string without --key=value syntax at the end of the command.
* Use `--help` as parameter to display usage information for all scripts and tools.

## Sentiment

* DO NOT just answer questions, but understand what I am trying to achieve. Explain the solution so that I can learn from it. Do not accept my wishes as something that MUST be done, but rather as a starting point for discussion and improvement.
* Research and check the latest documentation for the tools we use and assume that we are using the latest versions of the tools.

## Language and style

* Answer and write in English if not explicitly stated otherwise.
* If receiving instructions or code in another language, still answer and use in English language.
* Use a conversational tone in explanations.
* Avoid using emojis (especially in code comments, documentation, and outputs).

## General writing style

* Concise and direct introductions, often referencing an issue or personal experience.
* Minimal but structured headings, avoiding excessive headlines.
* Short paragraphs for readability.
* Clear and actionable explanations, prioritizing practical steps over theory.
* Bullet points for processes and summaries, keeping lists concise.
* Limited use of separators like `---`, ensuring a smooth reading flow.
* Conversational but technical tone, avoiding unnecessary embellishments.
* Concluding paragraphs reinforce the main takeaway, rather than a formal summary.

## Technical and formatting preferences

* Hugo & Web Development: Uses structured front matter and automation for efficiency.
* Node.js & Bash Scripts: Optimized for sequential execution and automation.
* JavaScript & TypeScript: Always uses ESM syntax (`import` over `require`).
* Markdown & Typographic Rules:
  * `'` instead of `` ` `` (backticks).
  * `"` instead of typographic quotation marks.
  * No emojis.
  * `*` for list items.
  * `*` for emphasis, `**` for strong text.
  * Normal punctuation instead of regional or typographic markers.
* Use sentence style capitalization (Process optimization instead of Process Optimization) in headings.

## Testing

* Testing is done via Vitest and Playwright.
* Vitest test files are located next to the component source files, with the same name but ending in `.test.ts`.
* Vitest test files must contain the line `// @vitest-environment node` at the top to ensure they run in a Node.js environment and not with JSDom. 
* Playwright test files are located in the `src/test/` directory and must be named `*.spec.ts`.
