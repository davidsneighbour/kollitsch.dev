---
title: TypeScript vs. Astro
description: Astro blurs server and client boundaries. This post explains exactly how TypeScript behaves in frontmatter vs. client script tags—including is:inline and define:vars—and how to keep type safety with astro check, tsc, and Biome.
tags:
  - astro
  - typescript
  - frontend
cover:
  src: getty-images-P6AC5E9pxlg-unsplash.jpg
  type: image
  title: That one lonely Astro-naut
date: 2025-11-05
draft: true
---

Astro does a fantastic job integrating TypeScript across your project — from utilities and collections to the very heart of your `.astro` components.
But one of the most common sources of confusion comes from **where** TypeScript actually runs inside those files.

Astro blurs the line between **server** and **client** code. The same `.astro` file can contain TypeScript that runs at *build time* (server-side) and JavaScript that runs *in the browser* (client-side). Knowing where your code lives determines whether Astro will type-check, transpile, or simply inject it as literal text.

Let’s break this down and see how Astro handles TypeScript across the different “zones” of a component.

---

## 1. The Three Zones of Code in an Astro Component

A `.astro` file isn’t a single piece of code — it’s a hybrid of server-rendered and client-side sections. Here’s what that means in practice:

### A. Frontmatter (Server-Side Zone)

Everything between the top `---` fences is **server-side TypeScript**.
This section runs during the build and never reaches the browser.

```astro
---
interface User {
  name: string;
  age: number;
}

const user: User = { name: "Alice", age: 30 };
const greeting = `Hello, ${user.name}!`;
---

<h1>{greeting}</h1>
```

Here:

* TypeScript is *fully supported* (you can use interfaces, enums, generics, etc.).
* Type checking works with your IDE and with `astro check`.
* The compiled output becomes static HTML at build time.

Think of this as your “backend logic” — it’s safe, fully typed, and doesn’t end up in the client bundle.

---

### B. `<script>` Tags (Client-Side Zone)

Once you open a `<script>` tag, you’ve switched to **client-side code**.
This code runs in the user’s browser after the page loads.

Astro transpiles the TypeScript inside standard `<script>` tags automatically:

```astro
<script>
  interface User {
    name: string;
    age: number;
  }

  const user: User = { name: "Bob", age: 25 };
  console.log(`User: ${user.name}`);
</script>
```

Here:

* Astro compiles the TypeScript to JavaScript using Vite.
* Type syntax disappears in the final HTML/JS bundle.
* This is the correct place for browser APIs (`document`, `window`, etc.).

However, not every kind of `<script>` tag behaves the same way.

---

## 2. How Script Variants Affect TypeScript Handling

Astro provides a few special attributes that change how `<script>` tags behave — and some of them silently disable TypeScript compilation.

Let’s go through them.

---

### Default `<script>` (Processed and Bundled)

This is the normal, recommended approach for client-side TypeScript.

```astro
<script>
  import { greet } from "../utils/myScript";
  greet("World");
</script>
```

```ts
// src/utils/myScript.ts
export function greet(name: string) {
  console.log(`Hello, ${name}!`);
}
```

Transpiled: Yes
Bundled: Yes
TypeScript: Works

This is where you can safely import `.ts` files and use TypeScript syntax.

---

### `is:inline` — No TypeScript, No Bundling

When you add `is:inline`, Astro **injects your code verbatim** into the HTML output.
It completely skips TypeScript transpilation and module resolution.

```astro
<script is:inline>
  const message: string = "Hello"; // TypeScript not compiled
  console.log(message);
</script>
```

Transpiled: No
Bundled: No
TypeScript: Breaks

Use `is:inline` only for tiny, pure-JavaScript snippets such as analytics or one-liners.

---

### `define:vars` — Implicitly Inline

Astro’s `define:vars` is a handy way to pass server-side variables into inline scripts,
but it automatically implies `is:inline`.

```astro
<script define:vars={{ siteName: "kollitsch.dev" }}>
  const message = `Welcome to ${siteName}`; // Can't use TypeScript
</script>
```

Works for simple JS
Not compatible with TypeScript

If you need typing or imports, move your code into a proper `<script>` tag and pass the variable through props instead.

---

## 3. Type Checking vs. Compilation

A subtle but critical point: Astro **transpiles** TypeScript in client scripts but does **not** type-check it during builds.

Your build will succeed even if you’ve written invalid types. For example:

```astro
<script>
  const name: number = "Alice"; // No runtime error, but type error ignored
  console.log(name);
</script>
```

To properly catch those errors, use:

```bash
npx astro check
```

or rely on your IDE’s TypeScript tooling.

---

## 4. Module Resolution Rules

When importing `.ts` files inside a component:

* Prefer imports **without extensions**:

  ```ts
  import { helper } from "@utils/helper";
  ```

* Avoid writing `.ts` or `.tsx` in import paths — it may break bundling.
* Imports should follow your project’s `tsconfig.json` configuration.

---

## 5. Putting It All Together

Here’s a small example showing all three zones at once:

```astro
---
import { getUser } from "@utils/users";

interface User {
  name: string;
  age: number;
}

const user = await getUser();
---

<h1>{user.name}</h1>

<script>
  // Client-side TypeScript: compiled and bundled
  interface ClientUser {
    name: string;
  }

  const clientUser: ClientUser = { name: "Alice" };
  console.log(clientUser.name);
</script>

<script is:inline>
  // Inline JS only — TypeScript not processed
  console.log("Inline script active");
</script>
```

Summary:

| Zone                   | Location    | Runs Where          | TypeScript Support | Notes                   |
| ---------------------- | ----------- | ------------------- | ------------------ | ----------------------- |
| `--- frontmatter ---`  | Top of file | Server (build time) | Full               | Safe for any TypeScript |
| `<script>`             | In template | Browser (runtime)   | Transpiled only    | No type checking        |
| `<script is:inline>`   | In template | Injected in HTML    | None               | Use only plain JS       |
| `<script define:vars>` | In template | Injected in HTML    | None               | Implies `is:inline`     |

---

## 6. Best Practices

* Keep heavy logic in `.ts` utility files and import them into Astro scripts.
* Use regular `<script>` for client TypeScript; never mix with `is:inline`.
* Run `astro check` (or add it to CI) to enforce type correctness.
* Remember: **“If it’s inline, it’s not TypeScript.”**

---

## Appendix: Integrating Type Checking and Linting in CI

To maintain consistent type safety and code quality across builds, it’s worth integrating Astro’s type checks with TypeScript and Biome in your continuous integration setup.

### Option 1: Local Script in `package.json`

Add a combined validation command:

```json
{
  "scripts": {
    "lint": "biome check .",
    "typecheck": "astro check && tsc --noEmit"
  }
}
```

You can then run both manually:

```bash
npm run lint
npm run typecheck
```

### Option 2: GitHub Actions Workflow

Create `.github/workflows/validate.yml`:

```yaml
name: Validate Build

on:
  push:
  pull_request:

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm ci
      - run: npx biome check .
      - run: npx astro check
      - run: npx tsc --noEmit
```

### Option 3: Local Pre-Commit Hook (optional)

If you use `lint-staged` or `lefthook`, you can automatically check files before committing:

```yaml
pre-commit:
  commands:
    lint:
      run: npx biome check {staged_files}
    types:
      run: npx astro check
```

### Why Run Both?

* **`astro check`** validates `.astro` files, content schemas, and integrations.
* **`tsc --noEmit`** ensures type integrity across `.ts` and `.tsx` files.
* **Biome** (or ESLint) enforces consistent style, unused imports, and best practices.

Together, they guarantee that both your **Astro templates** and **utility TypeScript** stay clean, consistent, and error-free — catching problems long before deployment.

---

## Further Reading

If you want to dive deeper into Astro’s handling of TypeScript and client-side scripts, the following official resources are worth bookmarking:

* [Astro Documentation: TypeScript Support](https://docs.astro.build/en/guides/typescript/)
* [Astro Documentation: Client-Side Scripts](https://docs.astro.build/en/core-concepts/astro-components/#scripts)
* [Astro CLI Reference: `astro check`](https://docs.astro.build/en/reference/cli-reference/#astro-check)
* [Vite Documentation: TypeScript](https://vitejs.dev/guide/features.html#typescript)
* [Biome Documentation](https://biomejs.dev/reference/configuration/)
