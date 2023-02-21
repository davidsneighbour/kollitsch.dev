const path = require('path');
const util = require('util');
const fs = require('fs');
const arguments = process.argv;
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

(async () => {
  if (arguments && arguments.length > 0) {
    const folderArg = path.dirname(arguments[3]);
    const frontmatterArg = arguments[4];
    const data = frontmatterArg && typeof frontmatterArg === "string" ? JSON.parse(frontmatterArg) : null;
    const videoId = data.video.youtube;
    // https://i.ytimg.com/vi/49FXjBiccG4/sddefault.jpg
    // https://i.ytimg.com/vi/49FXjBiccG4/maxresdefault.jpg
    // https://ytimg.googleusercontent.com/vi/49FXjBiccG4/sddefault.jpg
    // https://ytimg.googleusercontent.com/vi/49FXjBiccG4/maxresdefault.jpg
    const videoThumbnail = util.format('https://ytimg.googleusercontent.com/vi/%s/maxresdefault.jpg', videoId);
    const writeFilePromise = util.promisify(fs.writeFile);

    async function downloadFile(url, outputPath) {
      const x = await fetch(url);
      const x_1 = await x.arrayBuffer();
      return await writeFilePromise(outputPath, Buffer.from(x_1));
    }

    downloadFile(videoThumbnail, folderArg + "/header.jpg");

  }
})();
