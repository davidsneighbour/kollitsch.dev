// @vitest-environment node

import { describe, expect, it } from "vitest";

import packageJson from "../../../package.json" with { type: "json" };
import { formatDuration, parseArgs } from "./timed-run.ts";

describe("formatDuration", () => {
  it("formats sub-minute durations", () => {
    expect(formatDuration(1423)).toBe("1.4s");
  });

  it("formats minute durations", () => {
    expect(formatDuration(62_345)).toBe("1m 02.3s");
  });

  it("formats hour durations", () => {
    expect(formatDuration(3_723_456)).toBe("1h 02m 03.4s");
  });
});

describe("parseArgs", () => {
  it("extracts the label and command", () => {
    expect(parseArgs(["--label", "npm run deploy", "--", "wireit"])).toEqual({
      command: ["wireit"],
      label: "npm run deploy",
    });
  });
});

describe("deploy timing package wiring", () => {
  it("keeps the timed deploy wrapper outside Wireit configuration", () => {
    expect(packageJson.scripts.deploy).toContain("timed-run.ts");
    expect(packageJson.wireit).not.toHaveProperty("deploy");
  });

  it("uses plain wireit scripts for npm scripts with Wireit config", () => {
    for (const [scriptName, scriptCommand] of Object.entries(packageJson.scripts)) {
      if (scriptName in packageJson.wireit) {
        expect(scriptCommand).toBe("wireit");
      }
    }
  });
});
