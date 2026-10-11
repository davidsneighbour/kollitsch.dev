# Shared check contract

Every check definition uses the same sections: purpose, input, verify, method, output, pass/fail, and remediation. The ID is the filename without `.md`. Checks do not authorise edits by themselves.

## Inputs and execution

Use the resolved post path, raw frontmatter, complete body, applicable rules, and mode from orchestration. Inspect each referenced source/configuration when its check runs; do not maintain a second schema or silently assume file arguments work. Quote concrete file paths safely in commands. Never execute placeholder paths. Reuse one tool run across checks where evidence overlaps, while retaining separate findings.

## Output and status

Return one result per selected check and post:

```text
post: repository-relative path
check: registered ID
status: PASS | FAIL | BLOCKED | SKIPPED
coverage: automatic, manual, rendered, or a stated combination
evidence: exact command and exit code, inspected source, or runtime artefact
findings: severity, field or file:line, rule/source, observation
remediation: applied change, proposed action, required decision, or none
```

`PASS` means all applicable verification in this definition completed with no unresolved errors. Warnings and suggestions remain visible and do not automatically mean failure. `FAIL` means an established requirement failed. `BLOCKED` means a required verification could not complete (missing tool, styles, network, credentials, or evidence). `SKIPPED` means not applicable or deliberately omitted, with a reason; it is not a pass. Record omitted checks in the overall report rather than inventing results for them.

Keep severity (`error`, `warning`, `suggestion`) separate from status. A tool exit code of zero does not prove no findings: Vale workflows may use `--no-exit`, description length warnings exit zero, and Lychee accepts/excludes some URLs. Preserve the configured severity and explain coverage limits. Treat manual observations as checked only when their evidence is recorded; label inference and uncertainty.

## Remediation and readiness

Review mode leaves content unchanged. Edit mode fixes within the requested scope and repository rules, preserving unknown fields and authorial meaning. Optional rewrites, shared-asset decisions, and link choices retain their documented boundaries. Recheck after changes. A required unresolved error or blocked publish check prevents an unqualified ready result; warnings require a visible editorial assessment.
