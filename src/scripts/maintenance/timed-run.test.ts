// @vitest-environment node

import { describe, expect, it } from "vitest";

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
