import { createReleaseConfig } from "@dnbhq/release-config";
import type { Config } from "release-it";

const config: Config = createReleaseConfig({
  scopes: {
    minorTypes: ["feat", "content"],
    patchTypes: [
      "fix",
      "build",
      "chore",
      "ci",
      "docs",
      "perf",
      "refactor",
      "revert",
      "style",
      "test",
    ],
  },
  overrides: {
    plugins: {
      "@release-it/conventional-changelog": {
        infile: "CHANGELOG.md",
        preset: {
          name: "conventionalcommits",
          types: [
            { type: "content", section: "Content" },
            { type: "feat", section: "Features" },
            { type: "fix", section: "Bug Fixes" },
            { type: "build", section: "Build" },
            { type: "chore", section: "Chores" },
            { type: "ci", section: "CI" },
            { type: "docs", section: "Documentation" },
            { type: "perf", section: "Performance" },
            { type: "refactor", section: "Refactoring" },
            { type: "revert", section: "Reverts" },
            { type: "style", section: "Styles" },
            { type: "test", section: "Tests" },
          ],
        },
      },
    },
  },
});

export default config;
