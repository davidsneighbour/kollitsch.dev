const defaultStandardVersion = {
  // for available options see https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md
  scripts: {
    prerelease: "./bin/repo/hooks/prerelease",
  },
  bumpFiles: [
    {
      filename: "package.json",
      type: "json",
    },
  ],
  types: [
    { type: "build", section: "Build System" },
    { type: "chore", section: "Chore" },
    { type: "ci", section: "CI" },
    { type: "docs", section: "Documentation" },
    { type: "feat", section: "Features" },
    { type: "fix", section: "Bug Fixes" },
    { type: "perf", section: "Performance" },
    { type: "refactor", section: "Refactors" },
    { type: "revert", section: "Reverts" },
    { type: "style", section: "Styling" },
    { type: "test", section: "Tests" },
    { type: "theme", section: "Theme" },
  ],
  "skip": {
    "changelog": true,
  }
};

module.exports = defaultStandardVersion;
