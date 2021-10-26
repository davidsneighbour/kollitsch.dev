const defaultStandardVersion = require("@dnb-org/standard-version-config");
const localStandardVersion =  {
  bumpFiles: [
    {
      filename: "package.json",
      type: "json",
    },
    {
      filename: "data/dnb/build/info.json",
      type: "json",
    },
  ],
};

const standardVersion = {
  ...defaultStandardVersion,
  ...localStandardVersion,
};
module.exports = standardVersion;
