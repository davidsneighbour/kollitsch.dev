
'use strict';

const algoliasearch = require("algoliasearch");
const dotenv = require("dotenv");
const fs = require('fs');

dotenv.config();

// see https://github.com/algolia-samples/api-clients-quickstarts/blob/master/javascript/indexing.js
(async () => {
  try {
    // Algolia client credentials
    const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID;
    const ALGOLIA_API_KEY = process.env.ALGOLIA_API_KEY;
    const ALGOLIA_INDEX_NAME = process.env.ALGOLIA_INDEX_NAME;

    // Initialize the client
    // https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/
    const client = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_API_KEY);

    // Initialize an index
    // https://www.algolia.com/doc/api-client/getting-started/instantiate-client-index/#initialize-an-index
    const index = client.initIndex(ALGOLIA_INDEX_NAME);

    let data = fs.readFileSync('./public/index.json');
    let objects = JSON.parse(data);

    // Save objects: Add multiple objects to an index
    // https://www.algolia.com/doc/api-reference/api-methods/add-objects/?client=javascript
    console.log("Save objects - Adding multiple objects: ", objects);
    await index.saveObjects(objects).wait();

    let res = await index.search("");
    console.log("Current objects: ", res.hits);

  } catch (error) {
    console.error(error);
  }
})();
