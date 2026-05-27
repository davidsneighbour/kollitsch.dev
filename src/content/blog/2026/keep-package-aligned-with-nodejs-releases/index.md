---
title: "Keeping `engines.node` aligned with the Node release schedule"
description: "A script to automatically update `package.json` with the supported Node.js versions based on the official release schedule."
summary: "A script to automatically update `package.json` with the supported Node.js versions based on the official release schedule."
tags:
  - node
  - configuration
  - how-to
  - automation
cover:
  src: a-c-1pB9i4SBoMM-unsplash.jpg
  type: image
  title: "Nodes. JS."
date: 2026-05-26T22:55:46.612Z
---

Supporting "all maintained Node.js versions" sounds simple until you look closer.

Node.js release lines do not all live for the same amount of time. Even-numbered majors traditionally become LTS releases and stay around longer. Odd-numbered majors are shorter-lived Current releases. That means a simple range like this can become wrong quickly:

```json
{
  "engines": {
    "node": ">=22"
  }
}
```

It accepts every future major too, including versions that did not exist when the package was tested. For libraries, I prefer being explicit, which leads to this monster:

```json
{
  "engines": {
    "node": "^22.0.0 || ^24.0.0 || ^25.0.0 || ^26.0.0"
  }
}
```

That string says exactly what I mean: support every currently maintained, non-EOL Node.js major release line, including odd-numbered majors while they are still supported.

The problem is maintenance. Node.js versions move through the release calendar, and I do not want to remember every date manually.

## The official source

The human-readable calendar is [the official Node.js release overview](https://nodejs.org/en/about/previous-releases). That page shows release lines, their status, codenames, first release dates, latest update dates, and whether a line is LTS, Current, or EOL.

For automation, the better source is [the machine-readable release schedule](https://raw.githubusercontent.com/nodejs/Release/main/schedule.json) maintained by the Node.js Release Working Group.

This file is the useful one for calculating support ranges. It contains release line metadata like:

* the start date
* the LTS date, if applicable
* the maintenance date, if applicable
* the end date, which marks EOL

There is also [https://nodejs.org/dist/index.json](https://nodejs.org/dist/index.json), which is useful when you need individual released versions, for example `v24.16.0` or `v26.2.0`. It is not the right primary source for deciding whether a major release line is still supported. For support ranges, `schedule.json` above is the better fit.

## The policy

For my libraries and use cases, the policy is:

* Include every Node.js major release line that has already started.
* Exclude every release line whose EOL date has passed.
* Include Current releases.
* Include Active LTS releases.
* Include Maintenance releases.
* Include odd-numbered majors while they are not EOL.
* Do not add an artificial upper limit like `<27`.

So if Node.js 25 is still not EOL, it stays in the range. When it reaches EOL, it disappears. When Node.js 27 starts and is listed as current, it appears.

That gives a range like this:

```json
{
  "engines": {
    "node": "^22.0.0 || ^24.0.0 || ^25.0.0 || ^26.0.0"
  }
}
```

## Automating the update

Keeping this up-to-date should not be hard. The following script reads the official `schedule.json`, calculates the supported Node.js major versions, and updates `package.json`.

It also handles projects that do not have an `engines` property yet.

```ts
#!/usr/bin/env -S node

import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const CONFIG = {
  packageJsonPath: resolve(process.cwd(), "package.json"),
  scheduleUrl: "https://raw.githubusercontent.com/nodejs/Release/main/schedule.json",
  indentation: 2,
} as const;

type NodeScheduleEntry = {
  start: string;
  end: string;
  codename?: string;
  lts?: string | false;
  maintenance?: string;
};

type NodeSchedule = Record<string, NodeScheduleEntry>;

type PackageJson = {
  engines?: {
    node?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

/**
 * Prints the CLI help text.
 *
 * @returns Nothing.
 */
function printHelp(): void {
  const command = "node --experimental-strip-types scripts/update-node-engines.ts";

  console.log(`
Usage:
  ${command} [--check] [--help]

Options:
  --check   Check whether package.json is current without writing changes.
  --help    Show this help message.

Behaviour:
  - Reads the official Node.js release schedule from:
    ${CONFIG.scheduleUrl}
  - Selects every released Node.js major whose EOL date is still in the future.
  - Includes odd-numbered majors while they are not EOL.
  - Updates package.json engines.node to an explicit semver range.
  - Adds the engines object when it is missing.
`.trim());
}

/**
 * Parses CLI arguments.
 *
 * @param args - Raw CLI arguments.
 * @returns Parsed command options.
 */
function parseArgs(args: readonly string[]): { check: boolean; help: boolean } {
  const allowed = new Set(["--check", "--help"]);
  const unknown = args.filter((arg) => !allowed.has(arg));

  if (unknown.length > 0) {
    throw new Error(`Unknown option: ${unknown.join(", ")}`);
  }

  return {
    check: args.includes("--check"),
    help: args.includes("--help"),
  };
}

/**
 * Checks whether a value is a plain object.
 *
 * @param value - Value to check.
 * @returns True when the value is a plain object.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Validates and converts unknown JSON into a Node.js release schedule.
 *
 * @param value - Unknown parsed JSON value.
 * @returns Validated Node.js release schedule.
 */
function parseSchedule(value: unknown): NodeSchedule {
  if (!isRecord(value)) {
    throw new Error("Node.js release schedule must be a JSON object.");
  }

  const schedule: NodeSchedule = {};

  for (const [major, rawEntry] of Object.entries(value)) {
    if (!major.startsWith("v")) {
      continue;
    }

    if (!isRecord(rawEntry)) {
      throw new Error(`Schedule entry for ${major} must be an object.`);
    }

    const start = rawEntry.start;
    const end = rawEntry.end;
    const maintenance = rawEntry.maintenance;
    const lts = rawEntry.lts;
    const codename = rawEntry.codename;

    if (typeof start !== "string") {
      throw new Error(`Schedule entry for ${major} is missing string field "start".`);
    }

    if (typeof end !== "string") {
      throw new Error(`Schedule entry for ${major} is missing string field "end".`);
    }

    schedule[major] = {
      start,
      end,
      ...(typeof codename === "string" ? { codename } : {}),
      ...(typeof maintenance === "string" ? { maintenance } : {}),
      ...(typeof lts === "string" || lts === false ? { lts } : {}),
    };
  }

  return schedule;
}

/**
 * Validates and converts unknown JSON into a package.json object.
 *
 * @param value - Unknown parsed JSON value.
 * @returns Validated package.json object.
 */
function parsePackageJson(value: unknown): PackageJson {
  if (!isRecord(value)) {
    throw new Error("package.json must contain a JSON object.");
  }

  const packageJson: PackageJson = { ...value };

  if (packageJson.engines !== undefined && !isRecord(packageJson.engines)) {
    throw new Error("package.json field engines must be an object when present.");
  }

  if (
    packageJson.engines !== undefined &&
    packageJson.engines.node !== undefined &&
    typeof packageJson.engines.node !== "string"
  ) {
    throw new Error("package.json field engines.node must be a string when present.");
  }

  return packageJson;
}

/**
 * Parses an ISO date string into a UTC timestamp at midnight.
 *
 * @param value - Date string in YYYY-MM-DD format.
 * @returns UTC timestamp.
 */
function parseDate(value: string): number {
  const timestamp = Date.parse(`${value}T00:00:00.000Z`);

  if (Number.isNaN(timestamp)) {
    throw new Error(`Invalid date in Node.js release schedule: ${value}`);
  }

  return timestamp;
}

/**
 * Returns today's date as a UTC midnight timestamp.
 *
 * @returns UTC timestamp for today's date.
 */
function getTodayUtcTimestamp(): number {
  const now = new Date();

  return Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}

/**
 * Extracts the numeric major version from a schedule key like "v22".
 *
 * @param key - Schedule key.
 * @returns Numeric major version.
 */
function getMajorVersion(key: string): number {
  const major = Number.parseInt(key.replace(/^v/u, ""), 10);

  if (!Number.isInteger(major) || major < 1) {
    throw new Error(`Invalid Node.js major version key: ${key}`);
  }

  return major;
}

/**
 * Builds the engines.node string from the official Node.js release schedule.
 *
 * @param schedule - Validated Node.js release schedule.
 * @param todayTimestamp - UTC timestamp for the comparison date.
 * @returns Explicit engines.node semver range.
 */
function buildNodeEnginesRange(schedule: NodeSchedule, todayTimestamp: number): string {
  const supportedMajors = Object.entries(schedule)
    .filter(([, entry]) => {
      const startTimestamp = parseDate(entry.start);
      const endTimestamp = parseDate(entry.end);

      return startTimestamp <= todayTimestamp && endTimestamp > todayTimestamp;
    })
    .map(([major]) => getMajorVersion(major))
    .sort((left, right) => left - right);

  if (supportedMajors.length === 0) {
    throw new Error("No supported Node.js release lines found in schedule.");
  }

  return supportedMajors.map((major) => `^${major}.0.0`).join(" || ");
}

/**
 * Reads and parses JSON from a local file.
 *
 * @param filePath - JSON file path.
 * @returns Parsed JSON value.
 */
async function readJsonFile(filePath: string): Promise<unknown> {
  const content = await readFile(filePath, "utf8");

  try {
    return JSON.parse(content) as unknown;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(`Failed to parse JSON file ${filePath}: ${message}`);
  }
}

/**
 * Fetches and parses JSON from a URL.
 *
 * @param url - JSON URL.
 * @returns Parsed JSON value.
 */
async function fetchJson(url: string): Promise<unknown> {
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "User-Agent": "node-engines-updater",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  try {
    return (await response.json()) as unknown;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);

    throw new Error(`Failed to parse JSON response from ${url}: ${message}`);
  }
}

/**
 * Updates package.json with the given Node.js engines range.
 *
 * @param packageJson - Parsed package.json object.
 * @param nextNodeRange - New engines.node range.
 * @returns Updated package.json object.
 */
function updatePackageJsonEngines(packageJson: PackageJson, nextNodeRange: string): PackageJson {
  const engines = packageJson.engines ?? {};

  return {
    ...packageJson,
    engines: {
      ...engines,
      node: nextNodeRange,
    },
  };
}

/**
 * Main CLI entrypoint.
 *
 * @returns Nothing.
 */
async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    printHelp();
    return;
  }

  const packageJson = parsePackageJson(await readJsonFile(CONFIG.packageJsonPath));
  const schedule = parseSchedule(await fetchJson(CONFIG.scheduleUrl));
  const nextNodeRange = buildNodeEnginesRange(schedule, getTodayUtcTimestamp());
  const currentNodeRange = packageJson.engines?.node;

  if (currentNodeRange === nextNodeRange) {
    console.log(`engines.node is already current: ${nextNodeRange}`);
    return;
  }

  if (currentNodeRange === undefined) {
    console.log(`Adding missing engines.node: ${nextNodeRange}`);
  } else {
    console.log(`Updating engines.node: ${currentNodeRange} -> ${nextNodeRange}`);
  }

  if (options.check) {
    throw new Error("package.json engines.node is missing or outdated.");
  }

  const updatedPackageJson = updatePackageJsonEngines(packageJson, nextNodeRange);

  await writeFile(
    CONFIG.packageJsonPath,
    `${JSON.stringify(updatedPackageJson, null, CONFIG.indentation)}\n`,
    "utf8",
  );

  console.log(`Updated ${CONFIG.packageJsonPath}`);
}

try {
  await main();
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error);

  console.error(`update-node-engines failed: ${message}`);
  process.exitCode = 1;
}
```

Add the scripts to `package.json`:

```json
{
  "scripts": {
    "update:node-engines": "node --experimental-strip-types scripts/update-node-engines.ts",
    "check:node-engines": "node --experimental-strip-types scripts/update-node-engines.ts --check"
  }
}
```

`--experimental-strip-types` is not required anymore if your minimum Node.js version is already at 24.

Run it locally with:

```bash
npm run update:node-engines
```

If the project has no `engines` property yet, the script adds it:

```json
{
  "name": "@davidsneighbour/example",
  "version": "0.1.0",
  "engines": {
    "node": "^22.0.0 || ^24.0.0 || ^25.0.0 || ^26.0.0"
  }
}
```

## Opening pull requests automatically

The script can run from GitHub Actions once per week and open a pull request when `package.json` changes.

Create `.github/workflows/update-node-engines.yml`:

```yaml
name: Update Node.js engines

on:
  schedule:
    - cron: "0 22 * * 5"
  workflow_dispatch:

permissions:
  contents: write
  pull-requests: write

jobs:
  update-node-engines:
    name: Update package.json engines.node
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v5

      - name: Set up Node.js
        uses: actions/setup-node@v5
        with:
          node-version: 26

      - name: Update engines.node
        run: node --experimental-strip-types scripts/update-node-engines.ts

      - name: Create pull request
        uses: peter-evans/create-pull-request@v8
        with:
          branch: chore/update-node-engines
          delete-branch: true
          title: "chore: update Node.js engines range"
          commit-message: "chore: update Node.js engines range"
          body: |
            Updates `package.json#engines.node` from the official Node.js release schedule.

            Policy:
            - Include every released Node.js major that is not EOL.
            - Include odd-numbered majors while they are still supported.
            - Include Current, Active LTS, and Maintenance release lines.
            - Do not cap the newest supported major artificially.
          labels: dependencies
```

The workflow runs on Friday night UTC. For me, that means it runs early Saturday morning in Thailand, which is fine for a low-noise maintenance task.

## Why not hard-code the calendar?

The Node.js release calendar is planned, but it is still data. Dates can change. Policies can change. The transition from the older even/odd rhythm to newer release planning is exactly the kind of thing I do not want encoded manually in every library repository.

The script follows the official data instead:

* `start <= today`
* `end > today`

That is the whole rule.

If a release line has started and is not EOL, it belongs in the range.

If it is EOL, it does not.

## The result

This turns `engines.node` into a maintained contract instead of a forgotten string.

The package stays explicit about what it supports. Odd-numbered majors are included while they are valid. EOL versions are removed automatically. New supported majors are added after the official schedule says they have started.

That is the right amount of automation for a field that is easy to neglect but important for library consumers.

## What's next?

I have this weird idea of automating everything, so I will probably look into something that updates the matrixes in my Github workflows to supported Node.js versions too. It never ends ;)
