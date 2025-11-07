***
mode: agent
model: gpt*5 mini
tools: []
description: Generate a minimal "Today I learned" blog post file for KOLLITSCH.dev* (Astro). Enforce typing and length rules.
***

You are helping me create a new blog post of type "today I learned" in my Astro blog.

Constraints and rules:

* File format: Markdown with frontmatter (Astro content).
* Required frontmatter:

  * title: string
  * type: "today I learned"
  * date: today in Asia/Bangkok time (YYYY*MM*DD)
  * tags: string[]
  * draft: true
  * summary: 250–300 characters, plain text, no special markup or emojis
  * description: 150–170 characters, plain text, no special markup or emojis
  * slug: "today*i*learned/<kebab*case*title>/"

* Body sections (use these headings verbatim if present):

  * "## The problem" (always)
  * "## Why it happens" (optional)
  * "## The solution" (always)
  * "## Closing thoughts" (optional)

* No emojis. Use straight quotes and normal punctuation.
* Keep paragraphs short and actionable.
* Prefer a single self-contained code block for the solution.

Inputs I will provide:

* Title
* Tags (comma-separated)
* Whether "Why it happens" and "Closing thoughts" should be included
* A short note of the problem and the solution steps

Output:

* A complete Markdown file content ready to save under `src/content/blog/`.
* Use the provided title to generate the slug.
* Fill summary and description respecting length constraints.
* Include exactly the selected sections.

Now ask me for:

1) Title
2) Tags
3) Include "Why it happens"? (yes/no)
4) Include "Closing thoughts"? (yes/no)
5) Problem note (1–3 lines)
6) Solution outline (bullet points or code)
