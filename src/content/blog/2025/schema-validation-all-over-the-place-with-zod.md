---
title: Schema validation all over the place with Zod
description: "Schema validation all over the place with Zod"
draft: true
date: 2025-07-25T11:58:58.163Z
tags: []
cover:
  src: ""
  title: ""
---

A step by step guide to using Zod (which is Astro's default schema validation library) to define schemas for your data files, export them as JSON Schema, and use them for VSCode autocomplete and validation.

You can see [my current content configuration in my GitHub repository](https://github.com/davidsneighbour/kollitsch.dev/blob/main/src/content.config.ts). You see, that [I define my schemas as constants that I export](https://github.com/davidsneighbour/kollitsch.dev/blob/fe2819ba7629582dd1b2f08eb4427616fd297663/src/content.config.ts#L37) then. This will become important later on because it makes the schema more accessible and reusable. It doesn't change anything in the way [Astro is then using it](https://github.com/davidsneighbour/kollitsch.dev/blob/fe2819ba7629582dd1b2f08eb4427616fd297663/src/content.config.ts#L151).

Sidenote: My notes in post are based on my repository state on 2025-07-25 and Astro 5.12.2 and Zod 4.0.0. Things might change in newer versions and it's your own task to keep up with those changes.

## 1. Install Zod 4 (optional)

```bash
npm install zod@^4
```

Technically speaking Astro already uses Zod 4, but if you want to use newer features you might want to install it explicitly.

## 2. Define schemas in `content.config.ts`

```ts
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

export const linkSchema = z.object({
  href: z.string().describe('The URL that the link points to'),
  label: z.string().describe('The link display text'),
  external: z.boolean().optional().describe('Opens in new tab if true'),
}).meta({ id: 'Link', title: 'Link', description: 'A navigation link object' });

export const collections = {
  links: defineCollection({ type: 'data', schema: linkSchema }),
};
```

Use `.describe()` for individual field descriptions and `.meta()` to register metadata (`id`, `title`, `description`) to the Zod global registry ([Zod][1]).

## 3. Export JSON Schema from Zod

```ts
// scripts/export-json-schemas.ts
import { writeFile } from 'node:fs/promises';
import { z } from 'zod';
import { linkSchema } from '../src/content/config';

async function run() {
  const jsonSchema = z.toJSONSchema(linkSchema, {
    target: 'draft-7',
    reused: 'ref',
  });
  await writeFile('./schemas/link.schema.json', JSON.stringify(jsonSchema, null, 2));
  console.log('✅ Exported ./schemas/link.schema.json');
}

run().catch(err => {
  console.error('❌ Error exporting schema:', err);
  process.exit(1);
});
```

This uses Zod 4’s built-in `.toJSONSchema()` and supports metadata from the registry so descriptions and titles are passed through ([Zod][2], [Zod][1]).

## 4. Hook script in `package.json`

```jsonc
{
  "scripts": {
    "export:schemas": "ts-node scripts/export-json-schemas.ts"
  }
}
```

## 5. Link schema for VSCode JSON autocomplete

**Option A: Inline in data file**:

```json
{
  "$schema": "../schemas/link.schema.json",
  "href": "/about",
  "label": "About",
  "external": false
}
```

**Option B: Globally via `.vscode/settings.json`**:

```jsonc
{
  "json.schemas": [
    {
      "fileMatch": ["data/links/*.json"],
      "url": "./schemas/link.schema.json"
    }
  ]
}
```

## Benefits

* **Single source of truth**: schema and documentation live in Zod.
* VSCode IntelliSense shows field tooltips like `href – The URL that the link points to`.
* Metadata flows through `.meta()` into the JSON schema output.

## Handling Multiple Schemas

If you have more than one Zod-defined schema:

```ts
z.globalRegistry.add(linkSchema);
// add others...
```

Then in the export script:

```ts
import { z } from 'zod';
import { globalRegistry } from 'zod';

const combined = z.toJSONSchema(z.globalRegistry, { target: 'draft-7' });
// write combined to a file...
```

Each registered schema becomes a `$defs` entry and can be referenced via `$ref` ([Zod][1], [LogRocket Blog][3], [npm][4]).

[1]: https://zod.dev/v4?utm_source=chatgpt.com "Introducing Zod 4"
[2]: https://zod.dev/json-schema?utm_source=chatgpt.com "JSON Schema - Zod"
[3]: https://blog.logrocket.com/zod-4-update/?utm_source=chatgpt.com "Here's why everyone's going crazy over Zod 4 - LogRocket Blog"
[4]: https://www.npmjs.com/package/json-schema-to-zod?utm_source=chatgpt.com "json-schema-to-zod - NPM"
