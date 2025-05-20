// https://www.npmjs.com/package/@frontmatter/extensibility
import { ContentScript } from "@frontmatter/extensibility";

// @ts-ignore
const { command, scriptPath, workspacePath, filePath, frontMatter, answers } = ContentScript.getArguments();
console.log(command, scriptPath, workspacePath, filePath, frontMatter, answers);

/**
 * Merge two config objects
 * @param {Object} baseConfig - The original config from frontmatter
 * @param {Object} overrideConfig - New key-value pairs to apply
 * @returns {Object} - The merged config object
 */
function mergeConfigs(baseConfig, overrideConfig) {
  return Object.assign({}, baseConfig, overrideConfig);
}

/**
 * Update the frontmatter with merged config
 * @param {Object} existingFrontMatter - The full frontmatter of the document
 * @param {Object} newConfig - New values to merge into the config
 */
function updateConfigInFrontMatter(existingFrontMatter, newConfig) {
  const currentConfig = existingFrontMatter && existingFrontMatter.config ? existingFrontMatter.config : {};
  const mergedConfig = mergeConfigs(currentConfig, newConfig);

  ContentScript.updateFrontMatter({
    config: mergedConfig
  });
}

// Define new values to add
const newConfigValues = {
  something2: "A value 21"
};

// Execute update
updateConfigInFrontMatter(frontMatter, newConfigValues);

// https://www.zachleat.com/web/extract-colors/
// https://www.npmjs.com/package/extract-colors
// https://github.com/zachleat/get-pixels

ContentScript.done("The script is done");
