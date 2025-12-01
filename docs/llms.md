**LLMS Endpoints & Utilities**

* **Purpose**: Provide plain-text exports of blog content optimized for large language model (LLM) consumption. The repository exposes a lightweight index, a full-content dump, and per-post plain-text endpoints. Utilities in `src/utils/` assemble and sanitize the outputs.

**Files**

* **`src/pages/llms.txt.ts`**:
  * **Purpose**: Compact index-style listing of posts intended for quick LLM ingestion.
  * **Exports**: `GET: APIRoute` — builds and returns a text response using `llmsTxt(...)` from `src/utils/llms.ts`.
  * **Behavior**: Reads site metadata from `@data/setup.json`, collects non-draft posts from the `blog` collection, maps posts to lightweight items using `postsToLlmsItems`, and returns a plain-text document. Includes an "Optional" section with links like About, RSS, and Full Content.
  * **Example endpoint**: `/llms.txt`

* **`src/pages/llms-full.txt.ts`**:
  * **Purpose**: Full-content export including metadata and cleaned post bodies for deeper context.
  * **Exports**: `GET: APIRoute` — returns a text response produced by `llmsFullTxt(...)`.
  * **Behavior**: Reads site metadata and all non-draft posts, converts them with `postsToLlmsFullItems`, and returns a single large plain-text file containing author, site, and each post (title, metadata, description, and cleaned body).
  * **Example endpoint**: `/llms-full.txt`

* **`src/pages/llms/[...slug].txt.ts`**:
  * **Purpose**: Per-post plain-text export for individual post retrieval.
  * **Exports**:
    * `getStaticPaths: GetStaticPaths` — generates a path for each non-draft blog post.
    * `GET` — returns a single post rendered via `llmsPost(...)`.
  * **Behavior**: Receives `post` as a prop and returns the post's title, description, URL, publication date, category, and a cleaned body.
  * **Example endpoint**: `/llms/<slug>.txt`

* **`src/utils/llms.ts`**:
  * **Purpose**: Core helpers that build plain-text documents used by the pages above.
  * **Key exports**:
    * `llmsTxt(config)` — builds compact index documents (header + posts + optional links).
    * `llmsFullTxt(config)` — builds full-content dump with author/site and each post's metadata + body.
    * `llmsPost(config)` — builds a single-post plain-text document.
    * `postsToLlmsItems(posts, formatUrl)` and `postsToLlmsFullItems(posts, formatUrl)` — map `BlogPost[]` to the required shapes for exporters.
    * `stripMdx(content)` — (exported for tests) removes common MDX/JSX import lines and component tags so bodies become plain text.
  * **Important behaviors**:
    * Uses `MDX_PATTERNS` to remove MDX/JSX artifacts from `post.body` before returning text.
    * Uses `formatDate()` to format `pubDate` as `YYYY-MM-DD`.
    * Returns `Response` objects (plain text with `Content-Type: text/plain; charset=utf-8`).
    * Adds markdown-like headings and `---` separators for readability.

* **`src/utils/path.ts`**:
  * **Purpose**: Small URL normalization utility used when producing links in the text outputs.
  * **Exports**: `formatUrl(path?, options?)`.
  * **Default behavior**:
    * Adds a leading and trailing slash by default (`/something/`).
    * Strips extra leading/trailing slashes from input.
    * If `path` is `null`/`undefined`, returns an empty string `""` (allowing callers to decide fallback).
    * If `path` is empty (or only slashes) returns `/`.
  * **Examples**:
    * `formatUrl("blog/post-1")` -> `/blog/post-1/`
    * `formatUrl("about", { trailingSlash: false })` -> `/about`
    * `formatUrl(null)` -> `""`

**How they work together**

* The page routes collect `blog` collection entries via `getCollection('blog', ...)` and then call the helpers in `src/utils/llms.ts` to produce `Response` objects.
* `formatUrl` from `src/utils/path.ts` ensures links in index outputs are consistently formed.
* `stripMdx` removes imports and component markup so LLMs see readable, plain text content.

**Testing & notes**

* Small unit tests exist for the sanitizer and path helper:
  * `src/utils/llms.test.ts` — verifies `stripMdx` removes import lines and component tags (paired & self-closing).
  * `src/utils/path.test.ts` — verifies `formatUrl` default behavior and options.
* Run tests locally with:

```bash
npm test
# or run the two tests directly with vitest:
npx vitest run src/utils/llms.test.ts src/utils/path.test.ts
```

**Maintenance hints**

* If MDX component usage changes materially (for example, inline HTML or new component patterns), update `MDX_PATTERNS` in `src/utils/llms.ts` to avoid leaving markup in the export.
* Be deliberate when changing `formatUrl` defaults — index outputs expect consistent leading/trailing slashes.

If you want, I can add a short README snippet referencing these endpoints or convert the tests to snapshot tests for broader coverage.
