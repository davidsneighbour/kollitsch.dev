#!/usr/bin/env node
/**
 * Merge VS Code settings files (JSONC):
 * - base (committed) + local (gitignored) -> settings.json (generated)
 *
 * Default paths:
 * - base:  .vscode/settings.base.jsonc
 * - local: .vscode/settings.local.jsonc (optional)
 * - out:   .vscode/settings.json
 *
 * Local values override base values.
 * Objects are deep-merged, arrays are replaced.
 *
 * Additional audit mode:
 * - Compare generated settings.json with base/local sources
 * - Report:
 *   - keys present in settings.json but missing from both source files
 *   - keys whose effective value differs from settings.json
 *   - keys duplicated in base and local where local overrides base
 *   - keys in local that are identical to base and therefore redundant
 *   - keys present in base/local but missing from merged output
 *
 * Exit codes:
 * - 0 success
 * - 1 invalid arguments or runtime error
 * - 2 missing required files
 * - 3 audit found drift/problems
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import {
  parse as parseJsonc,
  printParseErrorCode,
  type ParseError,
} from "jsonc-parser";

type JsonPrimitive = string | number | boolean | null;
type JsonArray = JsonValue[];

interface JsonObject {
  [key: string]: JsonValue;
}

type JsonValue = JsonPrimitive | JsonObject | JsonArray;

type CliOptions = {
  base: string;
  local: string;
  out: string;
  verbose: boolean;
  dryRun: boolean;
  check: boolean;
  audit: boolean;
  apply: boolean;
  help: boolean;
};

type FlatEntry = {
  path: string;
  value: JsonValue;
};

type AuditIssue =
  | {
    type: "new-in-output";
    key: string;
    outputValue: JsonValue;
  }
  | {
    type: "effective-mismatch";
    key: string;
    expectedValue: JsonValue;
    outputValue: JsonValue;
    source: "base" | "local" | "merged";
  }
  | {
    type: "local-overrides-base";
    key: string;
    baseValue: JsonValue;
    localValue: JsonValue;
  }
  | {
    type: "redundant-local";
    key: string;
    value: JsonValue;
  }
  | {
    type: "missing-from-output";
    key: string;
    source: "base" | "local";
    sourceValue: JsonValue;
  };

main().catch((err: unknown) => {
  console.error(`[merge-vscode-config] ERROR: ${formatError(err)}`);
  process.exit(1);
});

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  if (!opts.base || !opts.out) {
    console.error("[merge-vscode-config] ERROR: Missing required parameters.");
    printHelp();
    process.exit(1);
  }

  loadDotEnvIfPresent(opts.verbose);

  const basePath = resolvePathFromCwd(opts.base);
  const localPath = resolvePathFromCwd(opts.local);
  const outPath = resolvePathFromCwd(opts.out);

  if (!fs.existsSync(basePath)) {
    console.error(
      `[merge-vscode-config] ERROR: Base file not found: ${basePath}`,
    );
    process.exit(2);
  }

  const baseJson = readJsoncObject(basePath, opts.verbose);

  let localJson: JsonObject = {};
  const hasLocal = fs.existsSync(localPath);

  if (hasLocal) {
    localJson = readJsoncObject(localPath, opts.verbose);
  } else if (opts.verbose) {
    console.log(`[merge-vscode-config] Local file not found (ok): ${localPath}`);
  }

  const merged = deepMerge(baseJson, localJson);
  const formatted = JSON.stringify(merged, null, 2) + "\n";

  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    if (opts.verbose) {
      console.log(`[merge-vscode-config] Creating directory: ${outDir}`);
    }
    fs.mkdirSync(outDir, { recursive: true });
  }

  if (opts.audit) {
    runAudit({
      basePath,
      localPath,
      outPath,
      baseJson,
      localJson,
      merged,
      hasLocal,
      verbose: opts.verbose,
    });
    process.exit(0);
  }

  if (opts.check) {
    if (!fs.existsSync(outPath)) {
      console.error(
        `[merge-vscode-config] CHECK FAILED: Output file does not exist: ${outPath}`,
      );
      process.exit(1);
    }

    const current = fs.readFileSync(outPath, "utf8");
    if (current !== formatted) {
      console.error(
        `[merge-vscode-config] CHECK FAILED: ${outPath} is out of date. Run the merge script with --apply.`,
      );
      process.exit(1);
    }

    if (opts.verbose) {
      console.log(
        "[merge-vscode-config] CHECK OK: Output matches merged settings.",
      );
    }

    process.exit(0);
  }

  if (opts.dryRun) {
    process.stdout.write(formatted);
    process.exit(0);
  }

  if (!opts.apply) {
    printHelp();
    process.exit(0);
  }

  fs.writeFileSync(outPath, formatted, "utf8");

  if (opts.verbose) {
    console.log(`[merge-vscode-config] Wrote: ${outPath}`);
    console.log(`[merge-vscode-config] base:  ${basePath}`);
    console.log(`[merge-vscode-config] local: ${hasLocal ? localPath : "(none)"}`);
  }
}

function parseArgs(argv: string[]): CliOptions {
  const opts: CliOptions = {
    base: ".vscode/settings.base.jsonc",
    local: ".vscode/settings.local.jsonc",
    out: ".vscode/settings.json",
    verbose: false,
    dryRun: false,
    check: false,
    audit: false,
    apply: false,
    help: false,
  };

  if (argv.length === 0) {
    opts.help = true;
    return opts;
  }

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];

    if (arg === "--help") {
      opts.help = true;
    } else if (arg === "--verbose") {
      opts.verbose = true;
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
    } else if (arg === "--check") {
      opts.check = true;
    } else if (arg === "--audit") {
      opts.audit = true;
    } else if (arg === "--apply") {
      opts.apply = true;
    } else if (arg === "--base") {
      opts.base = requireValue(argv, ++i, "--base");
    } else if (arg === "--local") {
      opts.local = requireValue(argv, ++i, "--local");
    } else if (arg === "--out") {
      opts.out = requireValue(argv, ++i, "--out");
    } else {
      console.error(`[merge-vscode-config] ERROR: Unknown argument: ${arg}`);
      printHelp();
      process.exit(1);
    }
  }

  return opts;
}

function requireValue(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function printHelp(): void {
  const cmd = path.basename(process.argv[1] || "merge-vscode-config.ts");
  console.log(
    [
      "Usage:",
      `  node ${cmd} --apply [options]`,
      `  node ${cmd} --check [options]`,
      `  node ${cmd} --audit [options]`,
      `  node ${cmd} --dry-run [options]`,
      "",
      "Options:",
      "  --apply           Merge base and local settings and write settings.json",
      "  --check           Exit non-zero if output is missing or out of date",
      "  --audit           Compare settings.json with base/local sources and report drift",
      "  --dry-run         Print merged JSON to stdout, do not write file",
      "  --base <path>     Base settings JSONC (default: .vscode/settings.base.jsonc)",
      "  --local <path>    Local override JSONC, optional (default: .vscode/settings.local.jsonc)",
      "  --out <path>      Output JSON (default: .vscode/settings.json)",
      "  --verbose         More logs",
      "  --help            Show help",
      "",
      "Examples:",
      `  node ${cmd}`,
      `  node ${cmd} --help`,
      `  node ${cmd} --apply`,
      `  node ${cmd} --apply --verbose`,
      `  node ${cmd} --check`,
      `  node ${cmd} --audit`,
      `  node ${cmd} --dry-run`,
    ].join("\n"),
  );
}

function readJsoncObject(filePath: string, verbose: boolean): JsonObject {
  const raw = fs.readFileSync(filePath, "utf8");
  const errors: ParseError[] = [];
  const parsed = parseJsonc(raw, errors, { allowTrailingComma: true });

  if (errors.length > 0) {
    const details = errors
      .slice(0, 10)
      .map((error) => `${printParseErrorCode(error.error)} at offset ${error.offset}`)
      .join("; ");

    if (verbose) {
      console.error(
        `[merge-vscode-config] Failed to parse JSONC: ${filePath}`,
      );
      console.error(details);
    }

    throw new Error(`Invalid JSONC in ${filePath}: ${details}`);
  }

  if (!isPlainObject(parsed)) {
    throw new Error(`JSONC root must be an object in ${filePath}`);
  }

  return parsed;
}

function deepMerge(base: JsonObject, override: JsonObject): JsonObject {
  const output: JsonObject = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = output[key];

    if (isPlainObject(baseValue) && isPlainObject(value)) {
      output[key] = deepMerge(baseValue, value);
      continue;
    }

    output[key] = value;
  }

  return output;
}

function runAudit(input: {
  basePath: string;
  localPath: string;
  outPath: string;
  baseJson: JsonObject;
  localJson: JsonObject;
  merged: JsonObject;
  hasLocal: boolean;
  verbose: boolean;
}): void {
  const {
    basePath,
    localPath,
    outPath,
    baseJson,
    localJson,
    merged,
    hasLocal,
    verbose,
  } = input;

  if (!fs.existsSync(outPath)) {
    console.error(
      `[merge-vscode-config] AUDIT FAILED: Output file does not exist: ${outPath}`,
    );
    process.exit(2);
  }

  const outJson = readJsoncObject(outPath, verbose);
  const issues = auditSettings({
    base: baseJson,
    local: localJson,
    output: outJson,
  });

  console.log("");
  console.log("[merge-vscode-config] Audit report");
  console.log(`  base:   ${basePath}`);
  console.log(`  local:  ${hasLocal ? localPath : "(none)"}`);
  console.log(`  output: ${outPath}`);
  console.log("");

  const newInOutput = issues.filter(
    (issue): issue is Extract<AuditIssue, { type: "new-in-output" }> =>
      issue.type === "new-in-output",
  );

  const effectiveMismatch = issues.filter(
    (issue): issue is Extract<AuditIssue, { type: "effective-mismatch" }> =>
      issue.type === "effective-mismatch",
  );

  const localOverridesBase = issues.filter(
    (issue): issue is Extract<AuditIssue, { type: "local-overrides-base" }> =>
      issue.type === "local-overrides-base",
  );

  const redundantLocal = issues.filter(
    (issue): issue is Extract<AuditIssue, { type: "redundant-local" }> =>
      issue.type === "redundant-local",
  );

  const missingFromOutput = issues.filter(
    (issue): issue is Extract<AuditIssue, { type: "missing-from-output" }> =>
      issue.type === "missing-from-output",
  );

  printAuditGroup(
    "New settings found only in settings.json",
    newInOutput,
    (issue) => `${issue.key}: ${stringifyValue(issue.outputValue)}`,
    "No new output-only settings found.",
  );

  printAuditGroup(
    "Settings whose effective value differs from settings.json",
    effectiveMismatch,
    (issue) =>
      [
        `${issue.key}`,
        `  expected (${issue.source}): ${stringifyValue(issue.expectedValue)}`,
        `  actual   (output): ${stringifyValue(issue.outputValue)}`,
      ].join("\n"),
    "No effective mismatches found.",
  );

  printAuditGroup(
    "Settings present in both base and local where local overrides base",
    localOverridesBase,
    (issue) =>
      [
        `${issue.key}`,
        `  base:  ${stringifyValue(issue.baseValue)}`,
        `  local: ${stringifyValue(issue.localValue)}`,
      ].join("\n"),
    "No local overrides over base found.",
  );

  printAuditGroup(
    "Redundant local settings (same value as base)",
    redundantLocal,
    (issue) => `${issue.key}: ${stringifyValue(issue.value)}`,
    "No redundant local settings found.",
  );

  printAuditGroup(
    "Source settings that are shadowed or no longer effective in merged output",
    missingFromOutput,
    (issue) =>
      [
        `${issue.key}`,
        `  source: ${issue.source}`,
        `  value:  ${stringifyValue(issue.sourceValue)}`,
      ].join("\n"),
    "No source settings missing from merged output found.",
  );

  const expectedFormatted = JSON.stringify(merged, null, 2) + "\n";
  const currentFormatted = fs.readFileSync(outPath, "utf8");

  if (currentFormatted !== expectedFormatted) {
    console.log("Generated file drift:");
    console.log(
      "  settings.json does not match the current merge result from base + local.",
    );
    console.log("  Run the merge script to regenerate it.");
    console.log("");
  } else {
    console.log("Generated file status:");
    console.log("  settings.json matches the current merge result.");
    console.log("");
  }

  if (issues.length > 0 || currentFormatted !== expectedFormatted) {
    process.exit(3);
  }
}

function auditSettings(input: {
  base: JsonObject;
  local: JsonObject;
  output: JsonObject;
}): AuditIssue[] {
  const issues: AuditIssue[] = [];

  const baseEntries = flattenObject(input.base);
  const localEntries = flattenObject(input.local);
  const mergedEntries = flattenObject(deepMerge(input.base, input.local));
  const outputEntries = flattenObject(input.output);

  const baseMap = toEntryMap(baseEntries);
  const localMap = toEntryMap(localEntries);
  const mergedMap = toEntryMap(mergedEntries);
  const outputMap = toEntryMap(outputEntries);

  for (const [key, outputEntry] of outputMap.entries()) {
    if (!baseMap.has(key) && !localMap.has(key)) {
      issues.push({
        type: "new-in-output",
        key,
        outputValue: outputEntry.value,
      });
      continue;
    }

    const mergedEntry = mergedMap.get(key);
    if (!mergedEntry) {
      issues.push({
        type: "new-in-output",
        key,
        outputValue: outputEntry.value,
      });
      continue;
    }

    if (!isDeepEqual(mergedEntry.value, outputEntry.value)) {
      let source: "base" | "local" | "merged" = "merged";

      if (localMap.has(key)) {
        source = "local";
      } else if (baseMap.has(key)) {
        source = "base";
      }

      issues.push({
        type: "effective-mismatch",
        key,
        expectedValue: mergedEntry.value,
        outputValue: outputEntry.value,
        source,
      });
    }
  }

  for (const [key, baseEntry] of baseMap.entries()) {
    if (!mergedMap.has(key)) {
      issues.push({
        type: "missing-from-output",
        key,
        source: "base",
        sourceValue: baseEntry.value,
      });
    }
  }

  for (const [key, localEntry] of localMap.entries()) {
    if (!mergedMap.has(key)) {
      issues.push({
        type: "missing-from-output",
        key,
        source: "local",
        sourceValue: localEntry.value,
      });
    }
  }

  for (const [key, localEntry] of localMap.entries()) {
    const baseEntry = baseMap.get(key);

    if (!baseEntry) {
      continue;
    }

    if (isDeepEqual(baseEntry.value, localEntry.value)) {
      issues.push({
        type: "redundant-local",
        key,
        value: localEntry.value,
      });
      continue;
    }

    issues.push({
      type: "local-overrides-base",
      key,
      baseValue: baseEntry.value,
      localValue: localEntry.value,
    });
  }

  return sortAuditIssues(issues);
}

function flattenObject(
  value: JsonValue,
  prefix = "",
  accumulator: FlatEntry[] = [],
): FlatEntry[] {
  if (!isPlainObject(value)) {
    if (prefix) {
      accumulator.push({ path: prefix, value });
    }
    return accumulator;
  }

  for (const [key, child] of Object.entries(value)) {
    const nextPath = prefix ? `${prefix}.${key}` : key;

    if (isPlainObject(child)) {
      flattenObject(child, nextPath, accumulator);
      continue;
    }

    accumulator.push({ path: nextPath, value: child });
  }

  return accumulator;
}

function toEntryMap(entries: FlatEntry[]): Map<string, FlatEntry> {
  const map = new Map<string, FlatEntry>();

  for (const entry of entries) {
    map.set(entry.path, entry);
  }

  return map;
}

function sortAuditIssues(issues: AuditIssue[]): AuditIssue[] {
  return [...issues].sort((left, right) => {
    const typeCompare = left.type.localeCompare(right.type);
    if (typeCompare !== 0) {
      return typeCompare;
    }

    return left.key.localeCompare(right.key);
  });
}

function printAuditGroup<TIssue extends AuditIssue>(
  title: string,
  issues: TIssue[],
  formatter: (issue: TIssue) => string,
  emptyMessage: string,
): void {
  console.log(`${title}:`);

  if (issues.length === 0) {
    console.log(`  ✔ ${emptyMessage}`);
    console.log("");
    return;
  }

  for (const issue of issues) {
    const formatted = formatter(issue)
      .split("\n")
      .map((line) => `  ${line}`)
      .join("\n");

    console.log(formatted);
  }

  console.log("");
}

function isPlainObject(value: unknown): value is JsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isDeepEqual(left: JsonValue, right: JsonValue): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function stringifyValue(value: JsonValue): string {
  return JSON.stringify(value);
}

function resolvePathFromCwd(filePath: string): string {
  return path.isAbsolute(filePath)
    ? filePath
    : path.resolve(process.cwd(), filePath);
}

/**
 * Minimal .env loader (KEY=VALUE).
 * Loads .env from cwd first, then from ${HOME}/.env.
 * Does not overwrite existing process.env keys.
 */
function loadDotEnvIfPresent(verbose: boolean): void {
  const candidates = [
    path.resolve(process.cwd(), ".env"),
    path.resolve(os.homedir(), ".env"),
  ];

  for (const filePath of candidates) {
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) {
        continue;
      }

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) {
        continue;
      }

      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();

      if (!key) {
        continue;
      }

      if (Object.prototype.hasOwnProperty.call(process.env, key)) {
        continue;
      }

      if (
        (value.startsWith("\"") && value.endsWith("\"")) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    }

    if (verbose) {
      console.log(`[merge-vscode-config] Loaded env from: ${filePath}`);
    }
  }
}

function formatError(err: unknown): string {
  if (err instanceof Error) {
    return err.message;
  }

  return String(err);
}