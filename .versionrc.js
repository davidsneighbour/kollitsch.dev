const defaultStandardVersion = require('@davidsneighbour/standard-version-config');
const localStandardVersion = {
  bumpFiles: [
    ...defaultStandardVersion.bumpFiles,
    {
      filename: 'data/dnb/dark-skies/build.json',
      type: 'json',
    },
  ],
  skip: {
    changelog: true
  }
};

const standardVersion = {
  ...defaultStandardVersion,
  ...localStandardVersion,
};
module.exports = standardVersion;
