# Orthography

## Purpose

Check spelling and identifier typos with the configured tool.

## Input

Installed `typos`, `src/config/typos.toml`, and full post source.

## Verify

Misspellings in prose, metadata, and identifiers without changing legitimate names, code, or established vocabulary. British English remains binding.

## Method

Run `typos --config src/config/typos.toml "POST_PATH"`. Do not use write mode in review. Inspect suggestions in context; configuration exceptions remain authoritative. `lint:spell` uses `cspell` and is not the commit-hook spelling gate.

## Output

File/line, token, proposed correction, tool exit code, and contextual decisions.

## Pass/fail

Established spelling defects fail; uncertain proper names warn. Missing tool/configuration blocks.

## Remediation

Apply supported corrections in edit mode. Never add global dictionary exceptions solely to make this post pass.
