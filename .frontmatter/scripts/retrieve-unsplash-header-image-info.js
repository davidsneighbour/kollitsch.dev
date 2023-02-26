const path = require('path');
const util = require('util');
const fs = require('fs');
require('dotenv').config();
const arguments = process.argv;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

(async () => {
  if (arguments && arguments.length > 0) {
    const folderArg = path.dirname(arguments[3]);
    const frontmatterArg = arguments[4];
    const data = frontmatterArg && typeof frontmatterArg === "string" ? JSON.parse(frontmatterArg) : null;
    const imageId = data.unsplash.imageid;

    const dataFeed = util.format('https://api.unsplash.com/photos/%s?client_id=%s', imageId, process.env.UNSPLASH_ACCESS_KEY);
    const writeFilePromise = util.promisify(fs.writeFile);

    async function downloadFile(url, outputPath) {
      const x = await fetch(url);
      const x_1 = await x.arrayBuffer();
      return await writeFilePromise(outputPath, Buffer.from(x_1));
    }

    const dataFile = './data/dnb/kollitsch/unsplash/' + imageId + '.json';
    downloadFile(dataFeed, dataFile);

    let rawdata = fs.readFileSync(dataFile);
    let imageData = JSON.parse(rawdata);
    downloadFile(imageData.urls.full, folderArg + "/header.jpg");

    console.log('{ "frontmatter": { "bla": "fasel" }}');

  }
})();
