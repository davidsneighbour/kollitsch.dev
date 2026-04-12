import { execSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import process from "node:process";

type CliOptions = {
  apply: boolean;
  check: boolean;
  help: boolean;
  verbose: boolean;
  file: string;
};

type RecommendationsFile = {
  recommendations: string[];
  unwantedRecommendations: string[];
};

main();

function main(): void {
  try {
    const options = parseArgs(process.argv.slice(2));

    if (options.help) {
      printHelp();
      process.exit(0);
    }

    const workspaceRoot = process.cwd();
    const extensionsJsonPath = resolve(workspaceRoot, options.file);

    ensureCodeCliAvailable();

    const enabled = getEnabledExtensions();
    const installed = getInstalledExtensions();
    const { recommendations, unwantedRecommendations } = loadRecommendations(
      extensionsJsonPath,
      options.verbose,
    );

    const enabledNotRecommended = enabled.filter(
      (extensionId) => !recommendations.includes(extensionId),
    );
    const recommendedButDisabled = recommendations.filter(
      (extensionId) => !enabled.includes(extensionId),
    );
    const disabled = installed.filter(
      (extensionId) => !enabled.includes(extensionId),
    );

    printSection(
      "Enabled extensions (not in recommendations)",
      enabledNotRecommended,
      "All enabled extensions are recommended.",
    );

    printSection(
      "Recommended extensions (not installed or disabled)",
      recommendedButDisabled,
      "All recommended extensions are enabled.",
    );

    printSection(
      "Disabled extensions (installed but not enabled)",
      disabled,
      "No disabled extensions found.",
    );

    if (options.check) {
      const hasDrift =
        enabledNotRecommended.length > 0 || recommendedButDisabled.length > 0;

      if (hasDrift) {
        console.error(
          "\n[vscode-extensions] CHECK FAILED: Workspace recommendations are out of sync.",
        );
        process.exit(1);
      }

      console.log(
        "\n[vscode-extensions] CHECK OK: Workspace recommendations are in sync.",
      );
      process.exit(0);
    }

    if (!options.apply) {
      process.exit(0);
    }

    const updatedRecommendations = uniqueSorted([
      ...recommendations,
      ...enabled,
    ]);

    writeRecommendations(
      extensionsJsonPath,
      updatedRecommendations,
      unwantedRecommendations,
      options.verbose,
    );

    console.log("\n[vscode-extensions] Workspace recommendations updated.");
  } catch (error: unknown) {
    console.error(`[vscode-extensions] ERROR: ${formatError(error)}`);
    process.exit(1);
  }
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    apply: false,
    check: false,
    help: false,
    verbose: false,
    file: ".vscode/extensions.json",
  };

  if (argv.length === 0) {
    options.help = true;
    return options;
  }

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--help") {
      options.help = true;
    } else if (arg === "--apply") {
      options.apply = true;
    } else if (arg === "--check") {
      options.check = true;
    } else if (arg === "--verbose") {
      options.verbose = true;
    } else if (arg === "--file") {
      index += 1;
      options.file = requireValue(argv, index, "--file");
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }

  if (options.apply && options.check) {
    throw new Error("Use either --apply or --check, not both.");
  }

  return options;
}

function requireValue(argv: string[], index: number, flag: string): string {
  const value = argv[index];
  if (!value || value.startsWith("--")) {
    throw new Error(`Missing value for ${flag}`);
  }
  return value;
}

function printHelp(): void {
  const commandName = basename(process.argv[1] || "vscode-extensions.ts");

  console.log(
    [
      "Usage:",
      `  node ${commandName} --check [options]`,
      `  node ${commandName} --apply [options]`,
      "",
      "Options:",
      "  --apply           Add all currently enabled extensions to recommendations",
      "  --check           Exit non-zero if recommendations are out of sync",
      "  --file <path>     Path to extensions.json (default: .vscode/extensions.json)",
      "  --verbose         Show additional log output",
      "  --help            Show help",
      "",
      "What it does:",
      "  * lists enabled VS Code extensions",
      "  * compares them with workspace recommendations",
      "  * reports enabled-but-unrecommended extensions",
      "  * reports recommended-but-disabled or missing extensions",
      "  * reports installed-but-disabled extensions",
      "",
      "Examples:",
      `  node ${commandName} --check`,
      `  node ${commandName} --apply`,
      `  node ${commandName} --apply --verbose`,
      `  node ${commandName} --file .vscode/extensions.json --check`,
    ].join("\n"),
  );
}

function ensureCodeCliAvailable(): void {
  try {
    execSync("code --version", { encoding: "utf8", stdio: "ignore" });
  } catch (error: unknown) {
    throw new Error(
      `VS Code CLI 'code' is not available in PATH. ${formatError(error)}`,
    );
  }
}

function getList(command: string): string[] {
  const output = execSync(command, { encoding: "utf8" });

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function getEnabledExtensions(): string[] {
  const lines = getList("code --list-extensions --show-versions");

  return uniqueSorted(
    lines
      .filter((line) => !line.includes("[Disabled]"))
      .map((line) => line.split("@")[0] ?? line),
  );
}

function getInstalledExtensions(): string[] {
  return uniqueSorted(getList("code --list-extensions"));
}

function loadRecommendations(
  filePath: string,
  verbose: boolean,
): RecommendationsFile {
  if (!existsSync(filePath)) {
    if (verbose) {
      console.log(
        `[vscode-extensions] Recommendations file not found, using empty defaults: ${filePath}`,
      );
    }

    return {
      recommendations: [],
      unwantedRecommendations: [],
    };
  }

  try {
    const raw = readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<RecommendationsFile>;

    return {
      recommendations: Array.isArray(parsed.recommendations)
        ? uniqueSorted(parsed.recommendations.filter(isString))
        : [],
      unwantedRecommendations: Array.isArray(parsed.unwantedRecommendations)
        ? uniqueSorted(parsed.unwantedRecommendations.filter(isString))
        : [],
    };
  } catch (error: unknown) {
    throw new Error(
      `Failed to parse recommendations file '${filePath}': ${formatError(error)}`,
    );
  }
}

function writeRecommendations(
  filePath: string,
  recommendations: string[],
  unwantedRecommendations: string[],
  verbose: boolean,
): void {
  const output: RecommendationsFile = {
    recommendations: uniqueSorted(recommendations),
    unwantedRecommendations: uniqueSorted(unwantedRecommendations),
  };

  writeFileSync(filePath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

  if (verbose) {
    console.log(`[vscode-extensions] Wrote recommendations file: ${filePath}`);
  }
}

function printSection(
  title: string,
  values: string[],
  emptyMessage: string,
): void {
  console.log(`\n${title}:`);

  if (values.length === 0) {
    console.log(`✔ ${emptyMessage}`);
    return;
  }

  console.log(values.join("\n"));
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function formatError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}