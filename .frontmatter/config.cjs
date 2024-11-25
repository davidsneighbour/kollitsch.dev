const dnbConfig = require("@davidsneighbour/frontmatter-config");

module.exports = async function (config) {
  let resolvedDnbConfig;

  try {
    resolvedDnbConfig = await (typeof dnbConfig === "function"
      ? dnbConfig()
      : dnbConfig);
  } catch (error) {
    throw new Error(`Failed to load dnbConfig: ${error.message}`);
  }

  if (typeof resolvedDnbConfig !== "object") {
    throw new Error("dnbConfig must resolve to an object.");
  }

  if (typeof config !== "object") {
    throw new Error("The provided config must be an object.");
  }

  return {
    ...resolvedDnbConfig,
    ...config,
  };
};
