---
mode: 'ask'
model: GPT-5 mini
tools: ['edit/createFile', 'edit/createDirectory', 'edit/editFiles', 'runCommands', 'runTasks', 'kollitsch.dev Docs/*', 'playwright/*', 'chrome-devtools/*', 'problems', 'testFailure', 'todos', 'runTests']
description: 'Add and update Vitest + Playwright tests for a single Astro component'
---

## Scope

* **Focus:** Create or update tests only for the currently selected Astro component under `src/components/**`. Do not modify other components or files unrelated to testing this component.
* **Test files:** For a component `ComponentName.astro`, use:
  - `src/components/ComponentName.test.ts` - unit tests (Vitest) for this component.
  - `src/test/ComponentName.spec.ts` - end-to-end tests (Playwright) for this component, if needed.
  - `src/pages/test/componentname.astro` - a visual test page for this component, if needed (for Playwright to visit).
* **Minimal component changes:** Only alter the component code if absolutely necessary for testing (for example adding a `data-testid` for selection). Any such change must be safe (no effect on production) and follow guidelines (for example gated by environment). Prefer using existing roles, labels, or text for selectors over modifying the component.
* **No public API changes:** Do not change the component's Props or behavior solely for testing. Tests should adapt to the component, not vice versa, unless a bug is discovered that requires a fix (which should be done in a separate refactor task, not here).

## Project Testing Guidelines and Requirements

* **Testing frameworks:** Use **Vitest** for unit/integration tests and **Playwright** for end-to-end browser tests. Follow project conventions for each:
  - **Vitest (unit tests):** Fast tests run in a Node/JS-DOM environment. Ideal for checking component interfaces, pure functions, and simple output logic.
  - **Playwright (e2e tests):** Browser-based tests for rendering and user interaction in a real page. Use these for visual verification, accessibility roles, and interactive behavior.
* **TypeScript:** Write tests in TypeScript. Import types and components as needed. No `any` types - tests should be type-safe.
* **File naming:** Name test files exactly as specified. The Playwright spec filename should correspond to the component name (capitalization matters for the file system, but route URLs will be lowercase). The Astro test page should use lowercase naming (matching the route path).
* **Test structure:**
  - Keep tests **focused** and readable. Each `describe` or `test/it` block should have a clear purpose.
  - Use descriptive names for test cases (state what behavior is expected).
  - Keep test functions short; if setup is complex, use `beforeEach` or helper functions.
* **Assertions:** Use Vitest's `expect` API for assertions. Aim for at least one meaningful assertion per test case.
* **Coverage:** Aim to cover key paths and edge cases of the component. The Vitest config already generates a coverage report (`text` summary in console and HTML in `src/test/logs/vitest/coverage`). Ensure new tests increase coverage for the component meaningfully.
* **Accessibility in tests:** Prefer selecting elements by accessible roles, labels, or text content in Playwright tests. This not only helps testing but also ensures the component has proper accessibility attributes.
* **No flakiness:** Tests should not depend on external resources or timings that could introduce flakiness. If using Playwright, wait for page to load and use stable selectors (roles/text or data attributes). Avoid brittle selectors like raw CSS classes unless no alternative.
* **Data attributes for testing:** If the component lacks a reliable hook for selection (no text or role to grab), you may add a `data-testid` or similar attribute **conditionally** (only in non-production builds). For example, use `import.meta.env.DEV` or a custom env variable to add `data-testid` attributes during development/testing. This ensures production output is clean. Document such additions in a comment or the output note.
* **No visual regressions:** The Astro visual test pages should not introduce styling or layout changes beyond using the component in a normal context. They are for testing only. Keep them in the `pages/test/` directory.

## Writing Unit Tests (Vitest)

Use Vitest to test the component's **contract** and any internal logic that can be verified without a browser. Typical things to test:

* **Props interface export:** Every component is required to export a `Props` interface or type. Write a test to confirm this export exists (for example, using a regex search in the source file). This ensures the refactored component followed the typing rule.
* **Default prop values:** If the component documentation specifies a `@default` for a prop, test that not providing that prop results in the documented default behavior. For example, if a prop `description` has `@default ""`, a test should verify that omitting `description` leads to no description rendered (or an empty string).
* **Output HTML structure (basic):** If possible, verify certain HTML output in a non-browser environment. For simple components, you might render them to a string or use Astro's testing utilities. *Example:* using Astro's experimental container API to render and inspect output strings. However, if rendering in Vitest is complex, this check can be done via Playwright on a test page.
* **Internal logic or functions:** If the component script contains utility functions or logic (for example clamping a value, transforming input), write unit tests for those. You can import those functions from the `.astro` file if they are exported, or refactor the logic into a helper module (within scope) if needed for testability. (As a rule, prefer testing through the component's public interface, but small pure functions can be tested in isolation if convenient.)
* **Forbidden patterns:** Ensure the component does not include disallowed patterns. For instance, since inline styles are forbidden, you can assert that the component's source does not contain `' style='`. Similarly, you might check that all internal links in the HTML output end with a trailing slash (if the component generates links). These can be done via simple string search or regex on the component source or rendered output.
* **No `any` usage:** Optionally, you can scan the component source to ensure there is no `: any` or ` as any`. This overlaps with TypeScript compiler checks, so it's secondary.

**Example - Props interface test (Vitest):** _This example checks that the `Prose.astro` component exports a Props interface or type._

```ts
// @vitest-environment node
import { describe, it, expect } from 'vitest';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

describe('Prose component (props contract)', () => {
  it('exports a Props interface/type', async () => {
    // Resolve the .astro component path relative to this test file
    const testDir = path.dirname(fileURLToPath(import.meta.url));
    const componentPath = path.join(testDir, 'Prose.astro');
    const src = await fs.readFile(componentPath, 'utf8');

    // Heuristic: match "export interface ...Props" or "export type ...Props ="
    const regex = /export\s+(?:interface|type)\s+\w*Props\b/;
    expect(regex.test(src)).toBe(true);
  });
});
```

Use a similar pattern for the component under test: adjust file names and description strings accordingly. This ensures every component has its Props defined.

Testing component behavior: Write additional it blocks for each important aspect of the component's behavior. For example, if the component has an optional slot or transforms some props: - Verify the slot content is rendered when provided. - If the component transforms a prop (for example formats a date, clamps a number), input various cases and check the result (this might involve a render, or if not easily rendered in Vitest, then ensure Playwright covers it). - Check that required props truly drive required output. If a prop is required to show some element, test that without it, that element is not present (if you can render to HTML or use a DOM).

Aim for tests that are self-explanatory. Use comments inside tests only to clarify complex steps or reasoning. Do not include comments about the refactoring process or meta-information - only comments about what the test is doing or why a particular assertion is needed for runtime behavior or compliance (this adheres to the code comment policy).

## Writing Integration/End-to-End Tests (Playwright)

If the component's behavior depends on the browser (for example, interactive components or styling/DOM output best verified in a real browser) or if it has multiple visual variations, create a Playwright test and a corresponding Astro page to test it.

When to create a Playwright test: - The component output varies significantly based on props (for example different visual states, conditional rendering). A single Astro test page can showcase all variations, and the Playwright test can verify each variation appears correctly. - The component involves user interaction (click, hover, form input, etc.) which needs to be simulated in a browser. - Accessibility roles or focus management need verification. - The component's correctness is better judged by rendered output (for example, computed CSS classes, presence/absence of elements) that might not be easily captured by simple string tests.

Astro test page (`pages/test/[component].astro`): - Create a dedicated page under src/pages/test/ for the component if not existing. The filename should be the component's name in lowercase (for example `Heading.astro` component -> `pages/test/heading.astro`). - This page should import the component and render it in various states. Include enough instances to cover different prop combinations or edge cases. Use the component's real usage as much as possible (within a basic layout). - Import global styles or layout as needed so the component looks and behaves normally. Typically, start the page with the global theme import and wrap examples in a basic layout. For example:

```astro
---
import '@styles/theme.css';
import Heading from '@components/Heading.astro';
import Layout from '@layouts/DefaultPage.astro';
---
<Layout>
  <!-- Example usages of Heading component in different scenarios: -->
  <Heading level={2} description="desc2">Visible H2</Heading>
  <Heading level={5}>Visible H5, no description</Heading>
  <Heading level={1} description="desc1">Default H1</Heading>
  <Heading level={1}>Default H1, no description</Heading>
  <Heading level={99}>Too High</Heading>      <!-- level out of range, should default to h6 -->
  <Heading level={0}>Too Low</Heading>       <!-- level below range, should default to h1 -->
</Layout>
```

In this example (for a hypothetical Heading component), the page renders multiple headings to test how the component handles level prop extremes and optional description. Adapt the pattern for the component under test: - Include at least one instance for each significant variation of the component's props (different combinations, boundaries, default vs custom values). - Add brief comments if needed to explain what each instance is testing. - Ensure internal links (if any) on this page have trailing slashes as required by project rules (the layout or component should handle it; just be mindful). - Do not include anything unrelated to the component's demonstration on this page. It's not a full storybook or documentation page, just a testbed.

Playwright test (ComponentName.spec.ts): - Write tests that navigate to the component's test page and verify the component's behavior in a real browser context. - Use selectors that reflect user-visible content or roles. Prefer page.getByRole() with appropriate filters (name, level) or getByText for specific text content. This ensures the component has proper semantic output. - Check that each variation rendered on the page is actually present and visible. If the component renders differently based on props, verify those differences. - For interactive components, simulate user events (click, input, etc.) and assert resulting behavior or DOM changes. - If relevant, verify styling or class changes indirectly (for example, a certain text is hidden or shown, rather than asserting on class names directly, unless no better option).

Example - Playwright test for a Heading component:

```
import { test, expect } from '@playwright/test';

test('renders multiple heading levels correctly', async ({ page }) => {
  await page.goto('/test/heading/');

  // Select headings by their visible name (text content) and level (implicit in role if possible)
  const h2 = page.getByRole('heading', { name: 'Visible H2', level: 2 });
  const h5 = page.getByRole('heading', { name: 'Visible H5, no description', level: 5 });
  const h1 = page.getByRole('heading', { name: 'Default H1', level: 1 });
  const h1NoDesc = page.getByRole('heading', { name: 'Default H1, no description', level: 1 });
  const h6 = page.getByRole('heading', { name: 'Too High', level: 6 });
  const h1Min = page.getByRole('heading', { name: 'Too Low', level: 1 });

  await expect(h2).toBeVisible();
  await expect(h5).toBeVisible();
  await expect(h1).toBeVisible();
  await expect(h1NoDesc).toBeVisible();
  await expect(h6).toBeVisible();    // level 99 should downgrade to h6
  await expect(h1Min).toBeVisible(); // level 0 should upgrade to h1
});
```

In this example, the test navigates to the /test/heading/ page and uses getByRole with heading to retrieve each heading by its name and expected level. It then asserts that each one is visible (rendered in the DOM). We also implicitly test that an out-of-range level was corrected to the nearest valid heading level (h6 or h1 as per component logic).

Apply this approach to the component under test: - Construct the URL as /test/yourcomponent/ (ensure it matches the Astro page filename). - Use page.getByRole or other page.getBy* queries to find elements. For example, if testing a button component, you might use getByRole('button', { name: 'Button Text' }). - If no suitable role or text, and you added a data-testid, you can select via page.locator('[data-testid="…"]'). - Include assertions for each important element or outcome (visibility, correct text, attributes like href if testing links, etc.). - If the component triggers navigation or modifies page state on interaction, use page.click() or similar to simulate and then assert the result.

Multiple test cases: It's fine to have multiple test() blocks in the spec if different scenarios need separate setup. For instance, one test for basic rendering, another for an interactive sequence. Name them clearly.
Playwright configuration: The base URL or dev server for Playwright should already be configured in the project (commonly, Playwright is set up to serve the Astro site or assume it's running). This prompt doesn't cover starting the server; just ensure that visiting the `/test/…/` route works. If needed, the agent can run the dev server or build+preview before running Playwright tests (usually npm run build && npm run preview or similar), but if npm run test:e2e is defined, it likely handles it.

## Code and Style Policies for Tests

* Coding style: Follow the project's TypeScript and linting rules in tests. That means proper imports, no unused variables (run npm run lint if available to verify), and consistent formatting (likely Prettier).
* Comments: As with component code, do not include any meta commentary about writing the test or refactoring. Only write comments that help understand the test logic or the reason behind an assertion. For example, good: // level 99 should render as h6 (max level), bad: // adding this test because the component was refactored.
* Keep tests deterministic: Avoid random or time-based elements in tests. If the component displays current time or a random ID, you might need to mock or control that in tests. Otherwise, such components can be tested by checking format (if deterministic format).
* Snapshots: This project doesn't explicitly mention using snapshot testing. Prefer explicit assertions over snapshots to target specific aspects of output. Only use snapshots if there's a large HTML output that's cumbersome to assert piecewise, and even then, ensure the snapshot is reviewed for meaningful content.
* Test maintainability: If a component's API changes (props added or removed), update or add tests accordingly. Remove tests for removed features and add new tests for new features. Ensure the tests remain in sync with component functionality.

## Updating Existing Tests

If tests for this component already exist: - Review them to understand current coverage and find gaps. Update descriptions or assertions if the component behavior has changed due to refactoring. - If some tests are failing after a component change, fix the tests (or the component if the test revealed a bug, though fixing component logic might be out of scope here unless trivial and clearly needed for test correctness). - Do not delete existing tests unless they are redundant or refer to removed functionality. Instead, prefer to repurpose or update them. If a test is entirely invalid (testing a removed prop, for example), you can remove or skip it, but note in a comment why (for example, // Removed prop X, test no longer applicable). - Ensure that after updates, all tests pass.

If no tests exist yet for this component: - Create new .test.ts (and .spec.ts with page) files as needed, following the patterns above. - Set up a new describe block for the component. Use the component name in the description for clarity (for example, "MyComponent component"). - Add at least the Props interface test and one or more behavior tests.

## Verification & Running Tests

After writing or updating tests, verify everything passes and meets coverage expectations:

1. Run unit tests: Use the provided script to run Vitest in CI mode (no watch). For example, run npm test (which likely maps to vitest run). All tests in src/components/**.test.ts should pass.
2. Run e2e tests: Run Playwright tests with npm run test:e2e. This will execute tests in src/test/*.spec.ts. Ensure the Astro dev/preview server is started as needed (the script or Playwright config might handle it). All tests should pass in headless mode.
3. Static analysis: It's also good to run `npx astro` check to catch any Astro-specific issues (this covers Astro build errors, integration, and some type checking).
4. Coverage report: The Vitest run will produce a coverage summary in the console. Review it to ensure the new tests cover previously untested code paths. You don't need to enforce a specific coverage percentage, but aim to improve it. The full HTML report can be found in `src/test/logs/vitest/coverage/index.html` for detailed analysis (open it manually if needed).
5. Lints and format: Optionally run npm run lint or formatters if configured, to ensure the new test files adhere to coding standards.

If any tests fail or issues arise (including lint errors or Astro check errors), revise the tests (or component if absolutely required) until everything passes cleanly. Use the problems or testFailure tools to inspect errors. Update assertions or test data if the failure is due to differences in expected vs actual output. Only adjust the component if a genuine bug or test-only attribute addition is needed.

If you are unable to run commands in this environment: - Explain in a short note that you could not run tests automatically. - Manually double-check your test code for obvious mistakes (typos, incorrect imports, mismatched component names, etc.) and against the acceptance criteria below. - Ensure that file paths in tests are correct (especially for reading the component file or navigating to the correct URL). - Double-verify that all new files are included in relevant config (Vitest will pick up .test.ts by naming convention, Playwright will pick up .spec.ts by its config, and Astro will auto include pages under `src/pages/`). - After this self-review, provide the output as described (diff or files) confident that the tests should pass when run.

## Acceptance Checklist

Before finalizing, make sure the following are true:

* [ ] Vitest tests (*.test.ts) cover basic contract: The component's Props interface/type export is verified. Key prop behaviors and internal logic have at least one test case each.
* [ ] Playwright tests (*.spec.ts) cover visual/interactive behavior (if applicable): For components with multiple states or interactions, a test page is created and the spec checks the correct rendering of each state. All expected elements are found and visible. Interactive elements (if any) are exercised.
* [ ] Astro test page (`pages/test/*.astro`) is complete and correct: It imports the component and any required styles/layout. It renders the component in a representative set of states. The content is valid Astro and adheres to project standards (for example uses Layout, internal links have slashes, images have alt text, etc. as relevant).
* [ ] No prohibited patterns or commentary in tests: Test code does not contain any refactoring commentary or unrelated notes. All comments are relevant to test logic or expectations. No usage of any in test code either (should rarely be needed).
* [ ] All tests pass: Running npm test and npm run test:e2e completes without failures. (In a CI environment, this is the ultimate proof of success.)
* [ ] Coverage improved or maintained: The new tests meaningfully increase coverage for the component. Check that there are no glaring untested branches in the component, unless truly hard to test (document in a comment if so).
* [ ] Test IDs gated (if used): Any data-testid or similar attribute added in the component is only present in development/test mode and does not leak to production builds.

## OUTPUT CONTRACT

### Mode A - Unified diff for all test file changes

Provide a single fenced code block with language diff containing a unified diff of all created/modified test files (and only those files). Include new file headers (for example --- /dev/null for new files) as needed. Do not include diffs for the component file unless you made changes there for test support. Ensure the diff is concise and only shows relevant context around your changes.

### Mode B - Full content of new/updated test files

Provide each new or updated file's full content in a separate fenced code block. Start each block with a code fence indicating file path and language (for example "```ts title=src/components/ComponentName.test.ts"). Do not intermix prose and code blocks; each block should contain the complete file content. If multiple files, you can provide multiple blocks back-to-back (each with its own "title" annotation if supported, or a clear comment indicating the file).

After either Mode A or Mode B output, you may include an optional note in plain text (no code block) with: - Rationale: Briefly explain any non-obvious testing decisions or necessary compromises. - Notes on component changes (if any): If you had to modify the component or if some expected behavior couldn't be tested, mention it here. - This note should be at most a few bullet points or sentences, and must not reiterate the content of the tests - it's only for explaining choices or providing migration guidance if a public API was indirectly affected (which should be rare in testing).

Make sure not to include any disallowed meta-information or irrelevant details in this note either.
Validation: Review the final output to ensure it meets all requirements. If the output (diff or files) includes forbidden content (like stray refactor comments or mistakes), correct them before finalizing. The goal is a clean set of test files ready to be run in the project. ```
