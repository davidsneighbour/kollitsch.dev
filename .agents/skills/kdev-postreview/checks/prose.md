# Prose

## Purpose

Review grammar, style, and authorial clarity with Vale plus manual judgement.

## Input

`src/config/.vale.ini`, local Vale styles/vocabulary, complete post, and `documentation/content/vale.md`.

## Verify

British English, grammar, plain quotes, factual fidelity, and configured style findings. Keep rule severity separate from editorial judgement.

## Method

Run `npm run lint:vale:file -- "POST_PATH"`; this supports a file argument and retains suggestions. Inspect findings and exit status, including overlapping style advice. Repository-wide `lint:vale` and commit hooks use `--no-exit`; zero there is not proof of clean prose. Missing styles block; use the documented sync command only when needed.

## Output

Rule ID, severity, source location, correction or justified editorial assessment, and manual coverage.

## Pass/fail

Unresolved errors/binding language violations fail; warnings/suggestions remain reported. Missing styles/tool blocks. Vale alone does not verify factual claims.

## Remediation

Preserve viewpoint, quotations, technical meaning, and code. Edit prose only within requested authority; flag uncertain facts rather than supplying them.
