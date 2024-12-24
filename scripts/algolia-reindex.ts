const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

// see https://github.com/algolia-samples/api-clients-quickstarts/blob/master/javascript/indexing.js
(async () => {
  try {
    console.log('Starting Algolia update...');

    // Algolia client credentials
    const { ALGOLIA_APP_ID } = process.env;
    const { ALGOLIA_API_KEY } = process.env;
    const { ALGOLIA_INDEX_NAME } = process.env;

    // Initialize the client
    // https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

    // Initialize an index
    // https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/#initialize-an-index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    const data = fs.readFileSync('./public/index.json');
    const objects = JSON.parse(data);

    // Save objects: Add multiple objects to an index
    // https://www.algolia.com/doc/api-reference/api-methods/add-objects/?client=javascript
    console.log('Save objects - Updating index now...');
    await index.saveObjects(objects).wait();

    const result = await index.search('');
    console.log('Current objects in the index:', result.hits.length);
  } catch (error) {
    console.error(error);
  }
})();
