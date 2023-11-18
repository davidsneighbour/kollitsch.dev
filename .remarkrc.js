import defaultRemarkConfig from "@davidsneighbour/remark-config";

const localRemarkConfig = [
  // add your changes here
];

const mergedConfiguration = {
  ...defaultRemarkConfig,
  ...localRemarkConfig,
};

export default mergedConfiguration;
