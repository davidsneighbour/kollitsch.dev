// registering ts-node so TypeScript can be imported at runtime
try {
  require("ts-node").register({ transpileOnly: true });
} catch (err) {
  console.error("✖ install ts-node to load .ts configs:", err.message);
  process.exit(1);
}

let shared;
try {
  shared = require("./src/config/shared-config.ts").items;
} catch (err) {
  console.error("✖ could not load shared-types.ts:", err.message);
  process.exit(1);
}

const standardVersion = {
  scripts: {
    prerelease: "./scripts/prerelease",
  },
  releaseCount: 1,
  bumpFiles: [{ filename: "package.json", type: "json" }],

  // for available options in the conventional changelog configuration spec see
  // https://github.com/conventional-changelog/conventional-changelog-config-spec/blob/master/versions/2.2.0/README.md
  header: "Changelog",
  types: shared.map(({ type, header }) => ({
    type,
    section: header,
  })),
};

module.exports = standardVersion;
