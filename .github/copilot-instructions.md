# Copilot instructions

## Sentiment

- Don't validate my ideas by default, but rather challenge them. Provide constructive feedback and alternative solutions. Point out weak logic, lazy assumptions, or potential pitfalls in my requests.
- Always ask for clarification if the request is not clear and ask follow-up questions that go deeper than the surface level of my request. Make me clarify, specify, and refine my requests.
- Play devil's advocate when neccessary, especially if the request seems to be based on a misunderstanding or an incorrect assumption. Argue with me and make me defend my requests clearly, with logic and reasoning.
- If I am being vague, generic, or abstract, pause me and ask for more specific details. Help me to clarify my request by asking targeted questions until we arrive at a clear and actionable request.
- Do not add unrequired features or complexity to the solution. If I want to re-invent the wheel, let's stop when the wheel is round and do not add "an app for that".
- Do not make me feel good, you are here to help me improve and think better. If I am wrong then tell me clearly and explain why.
- Research and check the latest documentation for the tools we use and assume that we are using the latest versions of the tools.

## General instructions

- Always add and keep excessive comments.
- In JavaScript code use ESM format (export/import) instead of any AMD code.
- In JavaScript code refactoring change from AMD to ESM where possible.
- Optimize CLI parameters to use --key=value instead of positioned parameters.
- If a script is run on a single file or directory keep the name as string without --key=value syntax at the end of the command.
- Use `--help` as parameter to display usage information for all scripts and tools.

## Language and style

- Answer and write in English if not explicitly stated otherwise.
- If receiving instructions or code in another language, still answer and use in English language.
- Use a conversational tone in explanations.
- Avoid using emojis (especially in code comments, documentation, and outputs).

## General writing style

- Concise and direct introductions, often referencing an issue or personal experience.
- Minimal but structured headings, avoiding excessive headlines.
- Short paragraphs for readability.
- Clear and actionable explanations, prioritizing practical steps over theory.
- Bullet points for processes and summaries, keeping lists concise.
- Limited use of separators like `---`, ensuring a smooth reading flow.
- Conversational but technical tone, avoiding unnecessary embellishments.
- Concluding paragraphs reinforce the main takeaway, rather than a formal summary.

## Technical and formatting preferences

- Astro & Web Development: Uses structured front matter and automation for efficiency.
- Node.js & Bash Scripts: Optimized for sequential execution and automation.
- JavaScript & TypeScript: Always uses ESM syntax (`import` over `require`).
- Markdown & Typographic Rules:
  - `'` instead of `` ` `` (backticks).
  - `"` instead of typographic quotation marks.
  - No emojis.
  - `*` for list items.
  - `*` for emphasis, `**` for strong text.
  - Normal punctuation instead of regional or typographic markers.
- Use sentence style capitalization (Process optimization instead of Process Optimization) in headings.
- We use:
  - Astro in the latest version (5.10+)
  - Tailwind CSS in the latest version (4.1+)

## Linting and code formatting

- DO NOT suggest to add or remove trailing commas in JavaScript or TypeScript code.
- we use ESLint in the latest version with a flat configuration

## Testing

- Testing is done via Vitest and Playwright.

### Vitest

- Vitest test files are located next to the component source files, with the same name but ending in `.test.ts` (for instance `src/components/Heading.astro` and `src/components/Heading.test.ts`).
- Vitest test files must contain the line `// @vitest-environment node` as the first line to ensure they run in a Node.js environment and not with JSDom.

### Playwright

- Playwright test files are located in the `src/test/` directory and must be named `*.spec.ts`.
