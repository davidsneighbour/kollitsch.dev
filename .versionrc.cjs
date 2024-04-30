const defaultStandardVersion = require('@davidsneighbour/release-config');
const localStandardVersion = {
  bumpFiles: [
    {
      filename: "package.json",
      type: "json",
    },
    {
      filename: "assets/data/build.json",
      type: "json",
    },
  ],
};
const standardVersion = {
  ...defaultStandardVersion,
  ...localStandardVersion,
};
module.exports = standardVersion;
