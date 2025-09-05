#!/usr/bin/env node
/**
 * Update a fenced ```json code block inside a marked region of a Markdown file
 * with the current `tsc --showConfig` output.
 *
 * Markers:
 *   <!-- tsc-config:start id=YOUR_ID -->
 *   ... (some markdown and a single fenced code block) ...
 *   <!-- tsc-config:end id=YOUR_ID -->
 *
 * Usage:
 *   node update-tsc-config.mts --file README.md --id main
 *
 * Options:
 *   --file <path>           Path to the markdown file (required)
 *   --id <string>           Marker id to target (required)
 *   --tscPath <path>        Path or command name for `tsc` (default: "tsc")
 *   --lang <string>         Fence language label (default: "json")
 *   --backup                Write a timestamped .bak before modifying
 *   --dry-run               Print changes but do not write file
 *   --help                  Show help
 */

import { readFile, writeFile, access, constants, cp } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import process from "node:process";

type Mutable<T> = { -readonly [K in keyof T]: T[K] };

/** CLI options parsed from argv */
interface CliOptions {
  readonly file: string;
  readonly id: string;
  readonly tscPath: string;
  readonly lang: string;
  readonly backup: boolean;
  readonly dryRun: boolean;
  readonly help: boolean;
}

/** Exit with a readable error message */
function fail(msg: string, code = 1): never {
  console.error(`[update-tsc-config] ERROR: ${msg}`);
  process.exit(code);
}

/** Print help */
function printHelp(): void {
  const help = [
    "Usage:",
    "  node update-tsc-config.mts --file <markdown.md> --id <markerId> [options]",
    "",
    "Options:",
    "  --file <path>        Path to the markdown file (required)",
    "  --id <string>        Marker id to target (required)",
    "  --tscPath <path>     Path or command for `tsc` (default: tsc)",
    "  --lang <string>      Fence language label (default: json)",
    "  --backup             Write a timestamped backup before modifying",
    "  --dry-run            Show the result without writing to disk",
    "  --help               Show this help",
    "",
    "Markers must exist exactly once:",
    "  <!-- tsc-config:start id=YOUR_ID -->",
    "  ... your section with one fenced code block ...",
    "  <!-- tsc-config:end id=YOUR_ID -->",
  ].join("\n");
  console.log(help);
}

/** Parse argv into CliOptions (strict, no `any`) */
/**
 * Parse argv into CliOptions with sane defaults.
 * Uses a mutable accumulator to avoid readonly assignment errors.
 */
function parseArgs(argv: string[]): CliOptions {
  const opts: Partial<Mutable<CliOptions>> = {};

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];

    if (arg === "--help") {
      opts.help = true;
    } else if (arg === "--backup") {
      opts.backup = true;
    } else if (arg === "--dry-run") {
      opts.dryRun = true;
    } else if (arg === "--file") {
      const val = argv[i + 1];
      if (!val) fail("--file requires a value");
      opts.file = val;
      i += 1;
    } else if (arg === "--id") {
      const val = argv[i + 1];
      if (!val) fail("--id requires a value");
      opts.id = val;
      i += 1;
    } else if (arg === "--tscPath") {
      const val = argv[i + 1];
      if (!val) fail("--tscPath requires a value");
      opts.tscPath = val;
      i += 1;
    } else if (arg === "--lang") {
      const val = argv[i + 1];
      if (!val) fail("--lang requires a value");
      opts.lang = val;
      i += 1;
    } else if (arg.startsWith("--")) {
      fail(`Unknown option: ${arg}`);
    }
  }

  // Defaults so `node .../tsc-config-to-instructions.ts`
  // equals `--file .github/instructions/typescript.instructions --id main`
  return {
    file: opts.file ?? ".github/instructions/typescript.instructions",
    id: opts.id ?? "main",
    tscPath: opts.tscPath ?? "tsc",
    lang: opts.lang ?? "json",
    backup: opts.backup ?? false,
    dryRun: opts.dryRun ?? false,
    help: opts.help ?? false,
  };
}


/** Ensure file exists and is readable/writable */
async function assertFileAccessible(path: string): Promise<void> {
  try {
    await access(path, constants.R_OK | constants.W_OK);
  } catch {
    fail(`Cannot access file for read/write: ${path}`);
  }
}

/** Execute `tsc --showConfig` and return pretty JSON string */
function getTscConfig(tscCmd: string): string {
  const result = spawnSync(tscCmd, ["--showConfig"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    shell: false,
  });

  if (result.error) {
    fail(
      `Failed to run "${tscCmd} --showConfig": ${String(result.error.message ?? result.error)}`
    );
  }
  const stderr = result.stderr?.trim() ?? "";
  if (result.status !== 0) {
    fail(
      `\`${tscCmd} --showConfig\` exited with code ${result.status}:\n${stderr || "(no stderr)"}`
    );
  }

  const raw = result.stdout?.trim() ?? "";
  if (!raw) fail("Empty output from `tsc --showConfig`");

  // Validate JSON (and reformat with 2 spaces to keep diffs clean)
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (e: unknown) {
    const reason = e instanceof Error ? e.message : "unknown JSON parse error";
    fail(`Output from \`${tscCmd} --showConfig\` is not valid JSON: ${reason}`);
  }

  return JSON.stringify(parsed, null, 2);
}

/** Replace the first fenced block between markers with new content */
function replaceBetweenMarkers(
  markdown: string,
  id: string,
  lang: string,
  replacementJson: string
): string {
  const startMarker = `<!-- tsc-config:start id=${id} -->`;
  const endMarker = `<!-- tsc-config:end id=${id} -->`;

  const startIdx = markdown.indexOf(startMarker);
  if (startIdx === -1) fail(`Start marker not found: ${startMarker}`);

  const endIdx = markdown.indexOf(endMarker, startIdx + startMarker.length);
  if (endIdx === -1) fail(`End marker not found for id "${id}"`);

  const before = markdown.slice(0, startIdx + startMarker.length);
  const middle = markdown.slice(startIdx + startMarker.length, endIdx);
  const after = markdown.slice(endIdx);

  // Find the first fenced block in `middle`.
  // Supports ```json ... ``` or ``` ... ```
  // We will preserve the original fence language if present, but default to `lang`.
  const fenceOpenRegex = /```([a-zA-Z0-9+-]*)?[ \t]*\n/;
  const openMatch = middle.match(fenceOpenRegex);

  if (!openMatch) {
    // No fenced block found; insert one just before end of middle, preserving middle as-is
    const injected =
      `${middle.trimEnd()}\n\n\`\`\`${lang}\n${replacementJson}\n\`\`\`\n`;
    return `${before}${injected}${after}`;
  }

  // We have an opening fence; locate its position and the closing fence
  const openIndex = openMatch.index as number;
  const openFull = openMatch[0];
  const originalLang = openMatch[1] && openMatch[1].length > 0 ? openMatch[1] : lang;

  // Find the closing fence AFTER the opening fence
  const afterOpen = middle.slice(openIndex + openFull.length);
  const closeIndexLocal = afterOpen.indexOf("```");
  if (closeIndexLocal === -1) {
    fail(
      `Malformed fenced block between markers id="${id}" (missing closing \`\`\`)`
    );
  }

  const beforeFence = middle.slice(0, openIndex);
  const afterFence = afterOpen.slice(closeIndexLocal + 3);

  const newBlock = `\`\`\`${originalLang}\n${replacementJson}\n\`\`\``;

  // Reassemble
  return `${before}${beforeFence}${newBlock}${afterFence}${after}`;
}

/** Build a timestamp like YYYYMMDD-HHMMSS */
function ts(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return [
    d.getFullYear(),
    pad(d.getMonth() + 1),
    pad(d.getDate()),
  ].join("") + "-" + [pad(d.getHours()), pad(d.getMinutes()), pad(d.getSeconds())].join("");
}

(async () => {
  const args = process.argv.slice(2);
  const opts = parseArgs(args);

  if (opts.help || !opts.file || !opts.id) {
    printHelp();
    if (!opts.help) process.exit(2);
    process.exit(0);
  }

  const filePath = resolve(process.cwd(), opts.file);
  await assertFileAccessible(filePath);

  const original = await readFile(filePath, "utf8").catch(() => {
    fail(`Failed to read file: ${filePath}`);
  });

  const configJson = getTscConfig(opts.tscPath);

  const updated = replaceBetweenMarkers(original, opts.id, opts.lang, configJson);

  if (updated === original) {
    console.log("[update-tsc-config] No changes detected.");
    process.exit(0);
  }

  if (opts.dryRun) {
    console.log(`[update-tsc-config] DRY RUN. Preview of updated content for ${basename(filePath)}:\n`);
    console.log(updated);
    process.exit(0);
  }

  if (opts.backup) {
    const backupPath = `${filePath}.${ts()}.bak`;
    await cp(filePath, backupPath).catch(() => {
      fail(`Failed to create backup at: ${backupPath}`);
    });
    console.log(`[update-tsc-config] Backup written: ${backupPath}`);
  }

  await writeFile(filePath, updated, "utf8").catch(() => {
    fail(`Failed to write updated file: ${filePath}`);
  });

  console.log("[update-tsc-config] Markdown updated successfully.");
})().catch((e: unknown) => {
  const msg = e instanceof Error ? e.message : "unknown error";
  fail(msg);
});
