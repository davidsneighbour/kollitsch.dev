# Markdown

## Purpose

Verify Markdown structure, accessibility-related markup, and configured source conventions.

## Input

`src/config/.markdownlint.jsonc`, installed custom rules, and post source.

## Verify

Heading hierarchy/sentence case, code fence language, list structure, allowed HTML, informative links, and image `alt` text under configured rules.

## Method

Run `npx --no-install markdownlint-cli2 --config src/config/.markdownlint.jsonc "POST_PATH"`. Use the local executable and explicit path; do not append a post path to `lint:markdown`, which already scans the archive. Check MDX import/component structure manually and render when needed.

## Output

Rule IDs/locations, source versus rendered coverage, and exact invocation.

## Pass/fail

Configured lint or binding markup violations fail. Missing dependencies or required render evidence block.

## Remediation

Apply focused corrections only; avoid whole-repository automatic fixes and arbitrary changes to prose line wrapping. Do not disable rules to fit an unapproved component.
