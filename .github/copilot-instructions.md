# Copilot instructions

## Repository overview

This repository is **kollitsch.dev** - a personal website and digital garden built with **Astro 5.10+** and **Tailwind CSS 4.1+**. The site serves as a blog, documentation platform, and reference for web development topics.

**Key statistics:**
- ~1,000 lines of TypeScript/JavaScript/Astro code across ~50 source files
- ~347 content files (blog posts, data files)
- Medium-sized project with extensive tooling and automation
- Static site generation with dynamic content loading

**Tech stack:**
- **Frontend:** Astro (latest), Tailwind CSS (latest), TypeScript
- **Content:** Markdown/MDX with front matter, JSON data files
- **Testing:** Vitest (unit tests), Playwright (e2e tests)
- **Linting:** ESLint (flat config), Biome, Stylelint, Markdownlint
- **Automation:** GitHub Actions, pre-commit hooks, Wireit for task orchestration

## Build and development workflow

### Core requirements

**Always install dependencies first:**
```bash
npm install
```

**Essential environment setup:**
- Node.js version defined in `.nvmrc` (currently 24)
- Create `.env` file with at minimum: `YOUTUBE_API_KEY=fake_key_for_testing` (required for build to succeed in local environments)
- Optional but recommended: `DEBUG_FRONTMATTER=true`

### Development commands (in order of importance)

| Command | Purpose | Notes |
|---------|---------|-------|
| `npm run dev` | Start dev server at localhost:4321 | May fail without YouTube/GitHub API keys but partially works |
| `npm run build` | Build production site | **Will fail** without YouTube API key in sandboxed environments |
| `npm run preview` | Preview built site | Requires successful build first |
| `npm run test` | Run Vitest unit tests | **Works reliably** - no external dependencies |
| `npm run test:e2e` | Run Playwright e2e tests | Requires build first, may fail due to external APIs |
| `npm run check` | Astro TypeScript check | **Will fail** without YouTube API key |

### Linting and formatting commands

**Critical for PR acceptance:**
- `npm run biome:check` - Biome linting/formatting (may show many existing issues - this is normal)
- `npm run biome:lint` - Apply Biome fixes
- `npm run prettier:check` / `npm run prettier:fix` - Prettier formatting
- Pre-commit hooks run automatically via lint-staged (see `.lintstagedrc.js`)

### Build dependencies and limitations

**External API dependencies that cause failures in sandboxed environments:**
1. **YouTube API** (`YOUTUBE_API_KEY`) - Required for content syncing from YouTube playlists
2. **GitHub API tokens** - For GitHub releases integration

**Workarounds for development:**
- Set `YOUTUBE_API_KEY=fake_key_for_testing` in `.env` for local development
- Build/dev commands will show warnings but may partially work
- Focus on unit tests (`npm test`) which work reliably without external APIs

**Time requirements:**
- `npm install`: ~30-60 seconds
- `npm test`: ~5-10 seconds
- `npm run build`: 60-120 seconds (when working)
- Linting commands: 10-30 seconds

## Project architecture and layout

### Key directories and files

**Configuration files (repository root):**
- `astro.config.js` - Astro framework configuration
- `eslint.config.js` - ESLint flat configuration
- `biome.jsonc` - Biome linter/formatter config
- `vitest.config.js` - Vitest test configuration
- `playwright.config.ts` - Playwright e2e test configuration
- `package.json` - Dependencies and scripts (managed by Wireit)
- `.nvmrc` - Node.js version (24)

**Source structure (`src/` directory):**
```
src/
├── components/          # Astro components (.astro files)
│   ├── *.test.ts       # Vitest unit tests (co-located)
│   └── development/    # Dev-only components
├── content/            # Content collections
│   ├── blog/          # Blog posts (Markdown with frontmatter)
│   └── *.json         # Data files (blogroll, social links, tags)
├── layouts/           # Astro layouts
├── pages/             # Astro pages (file-based routing)
├── assets/            # Static assets, images, styles
├── utils/             # TypeScript utilities
├── config/            # Tool configurations
├── scripts/           # Build and utility scripts
└── test/              # Playwright e2e tests (*.spec.ts)
```

### GitHub workflows and CI/CD

**Validation pipelines (`.github/workflows/`):**
- `tests.yml` - Vitest unit tests (runs on every PR)
- `tests-e2e.yml` - Playwright e2e tests (weekly schedule only)
- `link-check.yml` - Link validation
- Other maintenance workflows (screenshots, dependency updates)

**Pre-commit validation:**
- Runs automatically via `simple-git-hooks` and `lint-staged`
- Validates Markdown, runs secretlint, formats code with Biome
- See `.lintstagedrc.js` for complete pipeline

### Testing strategy

**Unit tests (Vitest):**
- Located next to components: `src/components/ComponentName.test.ts`
- **Must include** `// @vitest-environment node` as first line
- Run with: `npm test`
- **Always works** - no external dependencies

**E2E tests (Playwright):**
- Located in: `src/test/*.spec.ts`
- Requires built site to test against
- Run with: `npm run test:e2e`
- **May fail** due to build requirements

### Development recommendations

**For making code changes:**
1. **Always run `npm test` first** to validate current state
2. Use TypeScript scripts with `npx tsx script.ts` (not `node script.ts`)
3. Pre-commit hooks will catch most formatting issues
4. Focus on unit tests for validation rather than build/e2e tests

**Common pitfalls:**
- Don't try to run `npm run build` or `npm run check` in sandboxed environments without API keys
- Biome will report many existing linting issues - this is normal, focus on your changes
- TypeScript files in `/src/scripts/` need `tsx` to run, not `node`

**Trust these instructions:** The build process has specific external dependencies that are documented here. Only search for additional information if these instructions are incomplete or incorrect.

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
