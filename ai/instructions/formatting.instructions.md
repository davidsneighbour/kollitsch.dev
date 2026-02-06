---
applyTo: "**/*"
---

# Formatting

This instruction is system-agnostic and applies whenever its `applyTo` scope matches the current task.

## General

* All responses must be in Markdown.
* All code must be:
  * Fully copy-pasteable
  * Correctly fenced with language identifiers

## JavaScript / TypeScript

* Default to TypeScript if no language is specified.
* Avoid the `any` type entirely.
  * Use strict typing, `unknown` with type guards, or explicit interfaces.
* Enable strict mode assumptions.
* Include explicit error handling.
* Prefer configurable parameters over hard-coded values.

## Bash

* Use `#!/bin/bash`.
* Comply with `shellcheck`.
* Include a `--help` option.
* Use named parameters, never positional-only arguments.
* Derive the script name dynamically (e.g. `basename "$0"`).
