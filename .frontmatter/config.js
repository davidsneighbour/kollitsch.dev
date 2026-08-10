const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, `../.env`)
});

// process.env.FRONTMATTER_PREVIEW_HOST
const previewHost = "https://localhost:4321";

module.exports = async (config) => {
  return {
    ...config,
    "frontMatter.preview.host": previewHost
  }
};
