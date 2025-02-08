## General instructions for Copilot

* Always add excessive comments.
* In JavaScript code use ESM format (export/import) instead of any AMD code.
* In JavaScript code refactoring change from AMD to ESM where possible.
* Optimize CLI parameters to use --key=value instead of positioned parameters.

## Language and style

* Answer and write in English if not explicitly stated otherwise.
* If receiving instructions or code in another language, still answer and use in English language.
* Use a conversational tone in explanations.
* Avoid using emojis.

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
  * `*` for emphasis, `` for strong text.
  * Normal punctuation instead of regional or typographic markers.
* Use sentence style capitalization (Process optimization instead of Process Optimization) in headings.

## Process optimization

* Prefers reusable boilerplates for web components.
* Uses workspaces in a monorepo setup.
* Prioritizes automation in scripts, ensuring minimal manual effort.
* Requires logging in `~/.logs/` for all scripts.
* Prefers a structured help function in CLI tools, displaying usage when needed.
