const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, `.env`)
});

module.exports = async (config) => {
  return {
    ...config,
    "frontMatter.preview.host": "https://" + process.env.HOSTNAME + ':' + process.env.PORT,
    "frontMatter.taxonomy.seoTitleLength": process.env.SEO_TITLE_LENGTH,
    "frontMatter.extends": [
      "https://gist.githubusercontent.com/davidsneighbour/bbbd64da1d972fa3510af1da743db0fb/raw/5e9d3cfaba42bcdfbbd1057952131c27b015ca94/frontmatter.shared.json"
    ],
    "frontMatter.content.autoUpdateDate": true,
    "frontMatter.framework.id": "hugo",
    "frontMatter.experimental": true,
    "frontMatter.dashboard.openOnStart": true,
    "frontMatter.framework.startCommand": "npm run server",
    "frontMatter.content.publicFolder": "static",
    "frontMatter.taxonomy.seoDescriptionLength": 170,
    "frontMatter.content.supportedFileTypes": [
      "md"
    ],
    "frontMatter.taxonomy.dateFormat": "yyyy-MM-dd'T'HH:mm:ssxxx",
    "frontMatter.taxonomy.indentArrays": false,
    "frontMatter.taxonomy.noPropertyValueQuotes": [
      "date"
    ],
    "frontMatter.panel.actions.disabled": [
      "createContent",
      "optimizeSlug",
      "startStopServer"
    ],
    "frontMatter.git.enabled": false
  }
};
