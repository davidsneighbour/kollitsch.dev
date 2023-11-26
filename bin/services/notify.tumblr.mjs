// https://www.tumblr.com/docs/en/api/v2#posts---createreblog-a-post-neue-post-format
// https://www.tumblr.com/docs/npf

import tumblr from 'tumblr.js';
import 'dotenv/config';
import { loadFeed, downloadImage, loadEnv } from './utils.mjs';
import { preparePostObject } from './utils.tumblr.mjs';

const main = async () => {
  try {
    await loadEnv();
    const { FEED_LINK } = process.env;
    const feed = await loadFeed(FEED_LINK);
    await downloadImage(feed);
    const client = tumblr.createClient({
      consumer_key: process.env.TUMBLR_CONSUMER_KEY,
      consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
      token: process.env.TUMBLR_TOKEN,
      token_secret: process.env.TUMBLR_TOKEN_SECRET,
    });
    client.createPost(process.env.TUMBLR_BLOGID, preparePostObject(feed, localFileName));
  } catch (error) {
    console.error('Error:', error);
  }
};

main();

// import tumblr from 'tumblr.js';
// import path from 'path';
// import dotenv from 'dotenv';
// import fs from 'fs';

// import { loadFeed, downloadImage } from './utils.mjs'; // Import functions from feedUtils.js

// dotenv.config(); // Load environment variables from .env

// const postToTumblr = async (feed, localFilePath) => {
//   try {
//     const client = tumblr.createClient({
//       consumer_key: process.env.TUMBLR_CONSUMER_KEY,
//       consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
//       token: process.env.TUMBLR_TOKEN,
//       token_secret: process.env.TUMBLR_TOKEN_SECRET,
//     });

//     const postObject = preparePostObject(feed, localFilePath);
//     await client.createPost(process.env.TUMBLR_BLOGID, postObject);
//   } catch (error) {
//     console.error('Error posting to Tumblr:', error);
//     throw error;
//   }
// };

// const cleanup = async (localFilePath) => {
//   try {
//     await writeFileAsync(localFilePath, ''); // Clear the image file
//     console.info(`Deleted file: ${localFilePath}`);
//   } catch (error) {
//     console.error('Error cleaning up:', error);
//     throw error;
//   }
// };


// const processPost = async () => {
//   const feedLink = process.env.FEED_LINK;
//   const feed = await loadFeed(feedLink);
//   const localFilePath = 'image' + path.parse(feed.rss.channel[0].item[0]['media:content'][0]['$']['url']).ext;

//   await downloadImage(feed.rss.channel[0].item[0]['media:content'][0]['$']['url'], localFilePath);
//   await postToTumblr(feed, localFilePath);
//   await cleanup(localFilePath);
// };

// processPost();





// // import tumblr from 'tumblr.js';
// // import fs from 'node:fs';
// // import fetch from 'node-fetch';
// // import { parseStringPromise } from 'xml2js';
// // import path from "path";

// // import { config as dotenvConfig } from 'dotenv';

// // import https from "https"
// // import { pipeline } from "stream/promises"

// // let feed = "";




// // const getFeed = async () => {
// //   try {
// //     const { FEED_LINK } = process.env;
// //     //console.log(FEED_LINK);
// //     const response = await fetch(FEED_LINK);
// //     if (!response.ok) {
// //       throw new Error(`HTTP error! Status: ${response.status}`);
// //     }

// //     var origString = await response.text();
// //     var cleanedString = origString.replace("\ufeff", "");
// //     let data = await parseStringPromise(cleanedString);
// //     return data;
// //   } catch (error) {
// //     console.error('Error:', error);
// //     throw error;
// //   }
// // }

// // var localFileName = "";

// // const getArticleImage = async (feed) => {
// //   console.log(feed.rss.channel[0].item[0]['media:content'][0]['$']['url']);

// //   return new Promise(async (onSuccess) => {
// //     const imagePath = feed.rss.channel[0].item[0]['media:content'][0]['$']['url'];
// //     https.get(imagePath, async (res) => {
// //       localFileName = "image" + path.parse(imagePath).ext;
// //       console.log(localFileName);
// //       const fileWriteStream = fs.createWriteStream(path.join("./bin/services/", localFileName), {
// //         autoClose: true,
// //         flags: "w",
// //       })
// //       await pipeline(res, fileWriteStream)
// //       onSuccess("success")
// //     })
// //   })
// // }

// // const postToTumblr = async (feed) => {

// //   const client = tumblr.createClient({
// //     consumer_key: process.env.TUMBLR_CONSUMER_KEY,
// //     consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
// //     token: process.env.TUMBLR_TOKEN,
// //     token_secret: process.env.TUMBLR_TOKEN_SECRET,
// //   });
// //   client.createPost(process.env.TUMBLR_BLOGID, preparePostObject(feed));

// // }

// // const cleanup = async () => {
// //   fs.unlink(path.join("./bin/services", localFileName), (err => {
// //     if (err) console.log(err);
// //     else {
// //       console.info("\nDeleted file: " + localFileName);
// //     }
// //   }))
// // }


// // /**
// //  * @todo Add error handling
// //  * @todo Add logging
// //  */
// // const processPost = async () => {
// //   await loadEnv();
// //   const feed = await getFeed();
// //   await getArticleImage(feed);
// //   await postToTumblr(feed);
// //   await cleanup();
// // }


// // processPost();
