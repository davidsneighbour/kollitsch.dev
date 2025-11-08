---
applyTo: "**/*.ts"
---

This is an Astro-based static site generator project for KOLLITSCH.dev*, a
personal website and digital garden. The architecture follows Astro's
conventions with several custom extensions.

Core structure:

The src/ directory contains all source code organized by Astro conventions. 
components/ holds reusable Astro components (with co-located Vitest tests like 
Heading.test.ts). pages/ uses file-based routing where each file becomes a URL
route. content/ manages structured content via Astro's content collections (blog
posts in Markdown, data files in JSON). layouts/ contains page templates, while 
assets/ stores static files, images, and styles.

Configuration layer:

Root-level config files orchestrate the tooling ecosystem. astro.config.ts
configures the framework with integrations for MDX, Sitemap, Pagefind search,
Expressive Code, and Tailwind CSS 4. package.json defines 80+ npm scripts
orchestrated by Wireit for task dependencies. Linting uses ESLint (flat config),
Biome, Stylelint, and Markdownlint with configs in src/config/. Testing combines
Vitest for unit tests and Playwright for end-to-end tests.

Content management:

Blog posts live in src/content/blog/ as Markdown files with front matter. Static
data (blogroll, social links, tags) is stored as JSON in src/content/. The site
uses Astro's content collections API with schema validation via 
content.config.ts. Scripts in src/scripts/ automate tasks like image indexing,
sitemap verification, and VS Code extension management.

Build pipeline:

Development runs on npm run dev with hot reloading. Production builds via npm
run build generate a static site in dist/. Custom Vite plugins watch extra file
paths and handle TOML/YAML. Prebuild hooks generate an image index. The site
deploys to Netlify with configuration in netlify.toml. GitHub Actions workflows
validate tests, links, and code quality on every PR.
