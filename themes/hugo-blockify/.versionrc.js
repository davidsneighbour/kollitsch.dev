const defaultStandardVersion = require("@davidsneighbour/standard-version-config");

const localStandardVersion = {
  bumpFiles: [
    ...defaultStandardVersion.bumpFiles,
    { filename: "data/dnb/blockify/build.json", type: "json" },
  ],
  skip: {
    changelog: true
  }
};

module.exports = {
  ...defaultStandardVersion,
  ...localStandardVersion,
};
