const algoliasearch = require('algoliasearch');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

// see https://github.com/algolia-samples/api-clients-quickstarts/blob/master/javascript/indexing.js
// eslint-disable-next-line unicorn/prefer-top-level-await
(async () => {
  try {
    console.log('Running Algolia index update…');

    // Algolia client credentials
    const { ALGOLIA_APP_ID } = process.env;
    const { ALGOLIA_API_KEY } = process.env;
    const { ALGOLIA_INDEX_NAME } = process.env;

    console.log('Working with index:', ALGOLIA_INDEX_NAME);

    // Initialize the client
    // https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/
    // @ts-ignore
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

    // Initialize an index
    // https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/#initialize-an-index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);
    const data = fs.readFileSync('./public/index.json');
    // @ts-ignore
    const objects = JSON.parse(data);

    // Save objects: Add multiple objects to an index
    // https://www.algolia.com/doc/api-reference/api-methods/add-objects/?client=javascript
    // https://www.algolia.com/doc/api-reference/api-methods/replace-all-objects/?client=javascript
    console.log('Save objects to index…');
    const result = await index.replaceAllObjects(objects).wait();
    console.log('Current objects in the index:', result.objectIDs.length);
  } catch (error) {
    console.error(error);
  }
})();
