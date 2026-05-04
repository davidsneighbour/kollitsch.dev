#!/usr/bin/env node
/**
 * Merge VS Code settings files (JSONC):
 * * base (committed) + local (gitignored) -> settings.json (generated)
 *
 * Default paths:
 * * base:  .vscode/settings.base.jsonc
 * * local: .vscode/settings.local.jsonc (optional)
 * * out:   .vscode/settings.json
 *
 * Local values override base values.
 * Objects are deep-merged, arrays are replaced.
 *
 * Exit codes:
 * * 0 success
 * * 1 invalid arguments or runtime error
 * * 2 missing required files
 */

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import process from "node:process";
import { parse as parseJsonc, printParseErrorCode, type ParseError } from "jsonc-parser";

type JsonObject = Record<string, unknown>;

type CliOptions = {
  base: string;
  local: string;
  out: string;
  verbose: boolean;
  dryRun: boolean;
  check: boolean;
  help: boolean;
};

main().catch((err: unknown) => {
  console.error(`[merge-code-config] ERROR: ${formatError(err)}`);
  process.exit(1);
});

async function main(): Promise<void> {
  const opts = parseArgs(process.argv.slice(2));

  if (opts.help) {
    printHelp();
    process.exit(0);
  }

  if (!opts.base || !opts.out) {
    console.error("[merge-code-config] ERROR: Missing required parameters.");
    printHelp();
    process.exit(1);
  }

  loadDotEnvIfPresent(opts.verbose);

  const basePath = resolvePathFromCwd(opts.base);
  const localPath = resolvePathFromCwd(opts.local);
  const outPath = resolvePathFromCwd(opts.out);

  if (!fs.existsSync(basePath)) {
    console.error(`[merge-code-config] ERROR: Base file not found: ${basePath}`);
    process.exit(2);
  }

  const baseJson = readJsoncObject(basePath, opts.verbose);

  let localJson: JsonObject = {};
  const hasLocal = fs.existsSync(localPath);

  if (hasLocal) {
    localJson = readJsoncObject(localPath, opts.verbose);
  } else if (opts.verbose) {
    console.log(`[merge-code-config] Local file not found (ok): ${localPath}`);
  }

  const merged = deepMerge(baseJson, localJson);
  const formatted = JSON.stringify(merged, null, 2) + "\n";

  const outDir = path.dirname(outPath);
  if (!fs.existsSync(outDir)) {
    if (opts.verbose) console.log(`[merge-code-config] Creating directory: ${outDir}`);
    fs.mkdirSync(outDir, { recursive: true });
  }

  if (opts.check) {
    if (!fs.existsSync(outPath)) {
      console.error(`[merge-code-config] CHECK FAILED: Output file does not exist: ${outPath}`);
      process.exit(1);
    }
    const current = fs.readFileSync(outPath, "utf8");
    if (current !== formatted) {
      console.error(`[merge-code-config] CHECK FAILED: ${outPath} is out of date. Run the merge script.`);
      process.exit(1);
    }
    if (opts.verbose) console.log("[merge-code-config] CHECK OK: Output matches merged settings.");
    process.exit(0);
  }

  if (opts.dryRun) {
    process.stdout.write(formatted);
    process.exit(0);
  }

  fs.writeFileSync(outPath, formatted, "utf8");

  if (opts.verbose) {
    console.log(`[merge-code-config] Wrote: ${outPath}`);
    console.log(`[merge-code-config] base:  ${basePath}`);
    console.log(`[merge-code-config] local: ${hasLocal ? localPath : "(none)"}`);
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
    help: false,
  };

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];

    if (a === "--help") opts.help = true;
    else if (a === "--verbose") opts.verbose = true;
    else if (a === "--dry-run") opts.dryRun = true;
    else if (a === "--check") opts.check = true;
    else if (a === "--base") opts.base = requireValue(argv, ++i, "--base");
    else if (a === "--local") opts.local = requireValue(argv, ++i, "--local");
    else if (a === "--out") opts.out = requireValue(argv, ++i, "--out");
    else {
      console.error(`[merge-code-config] ERROR: Unknown argument: ${a}`);
      printHelp();
      process.exit(1);
    }
  }

  return opts;
}

function requireValue(argv: string[], idx: number, flag: string): string {
  const v = argv[idx];
  if (!v || v.startsWith("--")) throw new Error(`Missing value for ${flag}`);
  return v;
}

function printHelp(): void {
  const cmd = path.basename(process.argv[1] || "merge-code-config.ts");
  console.log(
    [
      "Usage:",
      `  node ${cmd} --base .vscode/settings.base.jsonc --out .vscode/settings.json [options]`,
      "",
      "Options:",
      "  --base <path>     Base settings JSONC (default: .vscode/settings.base.jsonc)",
      "  --local <path>    Local override JSONC, optional (default: .vscode/settings.local.jsonc)",
      "  --out <path>      Output JSON (default: .vscode/settings.json)",
      "  --dry-run         Print merged JSON to stdout, do not write file",
      "  --check           Exit non-zero if output is missing or out of date",
      "  --verbose         More logs",
      "  --help            Show help",
      "",
      "Examples:",
      "  node src/scripts/merge-code-config.ts --verbose",
      "  node src/scripts/merge-code-config.ts --dry-run",
      "  node src/scripts/merge-code-config.ts --check",
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
      .map((e) => `${printParseErrorCode(e.error)} at offset ${e.offset}`)
      .join("; ");
    if (verbose) {
      console.error(`[merge-code-config] Failed to parse JSONC: ${filePath}`);
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
  const out: JsonObject = { ...base };

  for (const [k, v] of Object.entries(override)) {
    const bv = out[k];
    if (isPlainObject(bv) && isPlainObject(v)) {
      out[k] = deepMerge(bv as JsonObject, v as JsonObject);
      continue;
    }
    out[k] = v;
  }

  return out;
}

function isPlainObject(v: unknown): v is JsonObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function resolvePathFromCwd(p: string): string {
  return path.isAbsolute(p) ? p : path.resolve(process.cwd(), p);
}

/**
 * Minimal .env loader (KEY=VALUE).
 * Loads .env from cwd first, then from ${HOME}/.env.
 * Does not overwrite existing process.env keys.
 */
function loadDotEnvIfPresent(verbose: boolean): void {
  const candidates = [path.resolve(process.cwd(), ".env"), path.resolve(os.homedir(), ".env")];

  for (const file of candidates) {
    if (!fs.existsSync(file)) continue;

    const content = fs.readFileSync(file, "utf8");
    const lines = content.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const eq = trimmed.indexOf("=");
      if (eq === -1) continue;

      const key = trimmed.slice(0, eq).trim();
      let val = trimmed.slice(eq + 1).trim();
      if (!key) continue;
      if (Object.prototype.hasOwnProperty.call(process.env, key)) continue;

      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }

      process.env[key] = val;
    }

    if (verbose) console.log(`[merge-code-config] Loaded env from: ${file}`);
  }
}

function formatError(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}
