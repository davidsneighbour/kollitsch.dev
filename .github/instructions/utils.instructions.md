---
applyTo: "src/utils/**/*.*"
---

# Utility Function Structure (`src/utils`)

## Principles
- Group by domain or operation: `array.ts`, `string.ts`, `post.ts`, etc.
- existing utility files:
  - `src/utils/debug.ts` for CLI logging and debugging, ignored in production
  - `src/utils/posts.ts` for post manipulation and preparation
- Use the barrel file (`src/utils/index.ts`) to re-export all functions:
  ```ts
  export * from './debug';
  export * from './posts';
  ```
- make sure the utility file is listed and exported in `src/utils/index.ts`
- use existing utility files and add new ones only when needed
- ignore existing utility files that don't comply with this structure and when changing them bring them in line with this structure successively

- Prefer **named exports**, avoid default exports.
- Import via alias:

  ```ts
  import { slugify } from '@utils';
  import { createDefaultPost } from '@utils/post';
  ```
## Typescript

- Use strict TypeScript settings.
- use `@ts-expect-error` instead of `@ts-ignore` and give a reason for the error
- ensure all utility functions are well-documented with JSDoc comments and type annotations

## `tsconfig.json` Alias

```json
"paths": {
  "@utils": ["./src/utils/index.ts"],
  "@utils/*": ["./src/utils/*"]
}
```

## Enforced Practices via ESLint

* Use `@utils` alias for imports
* Avoid relative imports to `../utils`
* Restrict deep imports (e.g. `@utils/string`) in favor of barrel import
