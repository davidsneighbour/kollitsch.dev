const dnbConfig = require('@davidsneighbour/frontmatter-config');

module.exports = async function (config) {
  return {
    ...dnbConfig,
    ...config,
  };
};
