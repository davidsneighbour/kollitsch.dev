const path = require('path');
require('dotenv').config({
  path: path.join(__dirname, `.env`)
});

module.exports = async (config) => {
  return {
    ...config,
    "frontMatter.extends": [
      "https://dnbhub.xyz/frontmatter/settings.global.json"
    ],
    "frontMatter.preview.host": "https://" + process.env.HOSTNAME + ':' + process.env.PORT,
    "frontMatter.taxonomy.seoTitleLength": process.env.SEO_TITLE_LENGTH,
    "frontMatter.site.baseURL": "https://kollitsch.dev/",
  }
};
