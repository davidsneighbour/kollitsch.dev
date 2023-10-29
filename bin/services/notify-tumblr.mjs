// https://www.tumblr.com/docs/en/api/v2#posts---createreblog-a-post-neue-post-format
// https://www.tumblr.com/docs/npf
// notify.tumblr.mjs


import tumblr from 'tumblr.js';
import fs from 'node:fs';
import 'dotenv/config';
import { getFeed, getArticleImage } from './utils.mjs'; // Import getFeed and getArticleImage from utils.mjs
import { preparePostObject } from './utils.tumblr.mjs';


const main = async () => {
  try {
    // Load environment variables using loadEnv function
    await loadEnv();

    // Load feed using the getFeed function
    const { FEED_LINK } = process.env;
    const feed = await getFeed(FEED_LINK);

    // Download article image using the getArticleImage function
    await getArticleImage(feed);

    // Create post object using the preparePostObject function
    const client = tumblr.createClient({
      consumer_key: process.env.TUMBLR_CONSUMER_KEY,
      consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
      token: process.env.TUMBLR_TOKEN,
      token_secret: process.env.TUMBLR_TOKEN_SECRET,
    });
    client.createPost(process.env.TUMBLR_BLOGID, preparePostObject(feed));
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

// const preparePostObject = (feed, localFilePath) => {
//   const link = path.parse(feed.rss.channel[0].item[0].link[0]).dir;

//   return {
//     content: [
//       {
//         type: 'text',
//         subtype: 'heading1',
//         text: feed.rss.channel[0].item[0].title[0],
//       },
//       {
//         type: 'image',
//         media: fs.createReadStream(localFilePath),
//         alt_text: 'Article header image',
//       },
//       {
//         type: 'text',
//         text: feed.rss.channel[0].item[0].description[0],
//       },
//       {
//         type: 'text',
//         text: 'Read on at kollitsch.dev',
//         formatting: [
//           {
//             start: 11,
//             end: 24,
//             type: 'link',
//             url: feed.rss.channel[0].item[0].link[0],
//           },
//         ],
//       },
//     ],
//     layout: [
//       {
//         type: 'rows',
//         display: [
//           { blocks: [0] },
//           { blocks: [1] },
//           { blocks: [2] },
//           { blocks: [3] },
//         ],
//       },
//     ],
//     slug: link,
//   };
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

// // const preparePostObject = (feed) => {

// //   var link = path.parse(feed.rss.channel[0].item[0].link[0]).dir;

// //   return {
// //     content: [
// //       {
// //         type: "text",
// //         "subtype": "heading1",
// //         text: feed.rss.channel[0].item[0].title[0]
// //       },
// //       {
// //         type: 'image',
// //         media: fs.createReadStream(new URL(localFileName, import.meta.url)),
// //         alt_text: 'Article header image',
// //       },
// //       {
// //         type: "text",
// //         text: feed.rss.channel[0].item[0].description[0]
// //       },
// //       {
// //         type: "text",
// //         text: "Read on at kollitsch.dev",
// //         formatting: [
// //           {
// //             start: 11,
// //             end: 24,
// //             type: "link",
// //             url: feed.rss.channel[0].item[0].link[0]
// //           }
// //         ]
// //       }
// //     ],
// //     layout: [
// //       {
// //         type: "rows",
// //         display: [
// //           { blocks: [0] },
// //           { blocks: [1] },
// //           { blocks: [2] },
// //           { blocks: [3] }
// //         ]
// //       }
// //     ],
// //     slug: link,
// //   }

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
