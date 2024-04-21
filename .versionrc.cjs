const defaultStandardVersion = {
  // for available options see https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.1.0/README.md
  scripts: {
    prerelease: "./bin/repo/hooks/prerelease",
  },
  "releaseCount": 1,
  bumpFiles: [
    {
      filename: "package.json",
      type: "json",
    },
    {
      filename: "assets/data/build.json",
      type: "json",
    }
  ],
  types: [
    { type: "feat", section: "Features" },
    { type: "theme", section: "Theme" },
    { type: "style", section: "Styling" },
    { type: "docs", section: "Documentation" },
    { type: "fix", section: "Bug Fixes" },
    { type: "perf", section: "Performance" },
    { type: "refactor", section: "Refactors" },
    { type: "revert", section: "Reverts" },
    { type: "test", section: "Tests" },
    { type: "chore", section: "Chore" },
    { type: "build", section: "Build System" },
    { type: "ci", section: "CI" },
  ]
};

module.exports = defaultStandardVersion;
