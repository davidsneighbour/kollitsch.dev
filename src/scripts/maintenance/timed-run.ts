#!/usr/bin/env node

import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import process from "node:process";
import { performance } from "node:perf_hooks";

type ParsedArgs = {
  command: string[];
  label: string;
};

if (isMainModule()) {
  main().catch((error: unknown) => {
    console.error(`[timed-run] ERROR: ${formatError(error)}`);
    process.exit(1);
  });
}

async function main(): Promise<void> {
  const args = parseArgs(process.argv.slice(2));
  const exitCode = await runTimedCommand(args);

  process.exit(exitCode);
}

export async function runTimedCommand(args: ParsedArgs): Promise<number> {
  const start = performance.now();
  let exitCode = 1;

  try {
    exitCode = await runCommand(args.command);
    return exitCode;
  } finally {
    const elapsedMs = performance.now() - start;
    const status = exitCode === 0 ? "completed" : "failed";

    console.log(
      `[timed-run] ${args.label} ${status} in ${formatDuration(elapsedMs)}.`,
    );
  }
}

export function formatDuration(milliseconds: number): string {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    throw new Error("Duration must be a non-negative finite number.");
  }

  const totalSeconds = Math.floor(milliseconds / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((milliseconds % 1000) / 100);

  if (hours > 0) {
    return `${hours}h ${pad(minutes)}m ${pad(seconds)}.${tenths}s`;
  }

  if (minutes > 0) {
    return `${minutes}m ${pad(seconds)}.${tenths}s`;
  }

  return `${seconds}.${tenths}s`;
}

export function parseArgs(argv: string[]): ParsedArgs {
  const commandSeparatorIndex = argv.indexOf("--");

  if (commandSeparatorIndex === -1) {
    throw new Error("Missing command separator: --");
  }

  const command = argv.slice(commandSeparatorIndex + 1);

  if (command.length === 0) {
    throw new Error("Missing command after --.");
  }

  return {
    command,
    label: parseLabel(argv.slice(0, commandSeparatorIndex)),
  };
}

function parseLabel(argv: string[]): string {
  const labelIndex = argv.indexOf("--label");

  if (labelIndex === -1) {
    return "command";
  }

  const label = argv.at(labelIndex + 1);

  if (!label) {
    throw new Error("Missing value after --label.");
  }

  return label;
}

function runCommand(command: string[]): Promise<number> {
  return new Promise((resolve, reject) => {
    const child = spawn(command[0] ?? "", command.slice(1), {
      stdio: "inherit",
    });

    child.on("error", reject);
    child.on("close", (code, signal) => {
      if (typeof code === "number") {
        resolve(code);
        return;
      }

      resolve(signalToExitCode(signal));
    });
  });
}

function signalToExitCode(signal: NodeJS.Signals | null): number {
  if (!signal) {
    return 1;
  }

  const signalNumber = signalNumbers[signal];

  return Number.isFinite(signalNumber) ? 128 + signalNumber : 1;
}

const signalNumbers: Partial<Record<NodeJS.Signals, number>> = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGQUIT: 3,
  SIGILL: 4,
  SIGTRAP: 5,
  SIGABRT: 6,
  SIGBUS: 7,
  SIGFPE: 8,
  SIGKILL: 9,
  SIGUSR1: 10,
  SIGSEGV: 11,
  SIGUSR2: 12,
  SIGPIPE: 13,
  SIGALRM: 14,
  SIGTERM: 15,
};

function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

function formatError(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function isMainModule(): boolean {
  return process.argv[1] === fileURLToPath(import.meta.url);
}
