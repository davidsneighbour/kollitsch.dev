import path from 'node:path';
import util from 'node:util';
import fs from 'fs';
import fetch from 'node-fetch';

const args = process.argv;

(async () => {
  if (args && args.length > 0) {

    /**
     * @param {string} url
     * @param {fs.PathOrFileDescriptor} outputPath
     */
    async function downloadFile(url, outputPath) {
      try {
        const response = await fetch(url);

        // Check if response is OK and content type is an image
        if (!response.ok || !response.headers.get('content-type').includes('image')) {
          throw new Error('Failed to download image');
        }

        const buffer = await response.arrayBuffer();
        await writeFilePromise(outputPath, Buffer.from(buffer));
        return true; // Return true if download is successful
      } catch (error) {
        console.error(`Error downloading file from ${url}:`, error.message);
        return false; // Return false if download fails
      }
    }

    const folderArg = path.dirname(args[3]);
    const frontmatterArg = args[4];
    const data = frontmatterArg && typeof frontmatterArg === 'string' ? JSON.parse(frontmatterArg) : null;
    const videoId = data?.video?.youtube;
    const videoThumbnailHighRes = `https://ytimg.googleusercontent.com/vi/${videoId}/maxresdefault.jpg`;
    const videoThumbnailLowRes = `https://ytimg.googleusercontent.com/vi/${videoId}/sddefault.jpg`;
    const writeFilePromise = util.promisify(fs.writeFile);

    const downloadSuccessful = await downloadFile(videoThumbnailHighRes, path.join(folderArg, 'header.jpg'));

    // If the high resolution download fails, try the low resolution
    if (!downloadSuccessful) {
      console.log('High resolution image download failed, trying low resolution...');
      await downloadFile(videoThumbnailLowRes, path.join(folderArg, 'header.jpg'));
    }

  }
})();
// https://i.ytimg.com/vi/49FXjBiccG4/sddefault.jpg
// https://ytimg.googleusercontent.com/vi/49FXjBiccG4/sddefault.jpg
// https://i.ytimg.com/vi/49FXjBiccG4/maxresdefault.jpg
// https://ytimg.googleusercontent.com/vi/49FXjBiccG4/maxresdefault.jpg
