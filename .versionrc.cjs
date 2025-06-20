const shared = require("./src/config/shared-config.json");

console.log(shared);

const standardVersion = {
  bumpFiles: [{ filename: "package.json", type: "json" }],

  // for available options in the conventional changelog configuration spec see
  // https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md
  header: "Changelog",
  releaseCount: 1,
  scripts: {
    prerelease: "./src/scripts/prerelease",
  },
  types: shared.map(({ type, header }) => ({
    section: header,
    type,
  })),
};

module.exports = standardVersion;
