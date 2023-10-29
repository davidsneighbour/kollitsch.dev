// https://www.tumblr.com/docs/en/api/v2#posts---createreblog-a-post-neue-post-format
// https://www.tumblr.com/docs/npf

import tumblr from 'tumblr.js';
import fs from 'node:fs';
import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import path from "path";

import { config as dotenvConfig } from 'dotenv';
import { promises as fsPromises } from 'fs';

import https from "https"
import { pipeline } from "stream/promises"

let feed = "";

// loading the .env file using async/await
const loadEnv = async () => {
  try {
    const envFileContent = await fsPromises.readFile('.env', 'utf8');
    //console.log(envFileContent);
    dotenvConfig({ path: '.env' });
    //console.log(process.env);
  } catch (error) {
    console.error('Error loading .env file:', error);
  }
};


const getFeed = async () => {
  try {
    const { FEED_LINK } = process.env;
    //console.log(FEED_LINK);
    const response = await fetch(FEED_LINK);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    var origString = await response.text();
    var cleanedString = origString.replace("\ufeff", "");
    let data = await parseStringPromise(cleanedString);
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// // Usage:
// (async () => {
//   try {
//     const result = await fetchData();
//     console.log(result);
//   } catch (error) {
//     // Handle the error here
//     console.error('An error occurred:', error);
//   }
// })();

var localFileName = "";

const getArticleImage = async (feed) => {
  console.log(feed.rss.channel[0].item[0]['media:content'][0]['$']['url']);

  return new Promise(async (onSuccess) => {
    const imagePath = feed.rss.channel[0].item[0]['media:content'][0]['$']['url'];
    https.get(imagePath, async (res) => {
      localFileName = "image" + path.parse(imagePath).ext;
      console.log(localFileName);
      const fileWriteStream = fs.createWriteStream(path.join("./bin/services/", localFileName), {
        autoClose: true,
        flags: "w",
      })
      await pipeline(res, fileWriteStream)
      onSuccess("success")
    })
  })
}

const postToTumblr = async (feed) => {

  const client = tumblr.createClient({
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
    token: process.env.TUMBLR_TOKEN,
    token_secret: process.env.TUMBLR_TOKEN_SECRET,
  });
  client.createPost(process.env.TUMBLR_BLOGID, preparePostObject(feed));

}

const cleanup = async () => {
  fs.unlink(path.join("./bin/services", localFileName), (err => {
    if (err) console.log(err);
    else {
      console.info("\nDeleted file: " + localFileName);
    }
  }))
}

const preparePostObject = (feed) => {

  var link = path.parse(feed.rss.channel[0].item[0].link[0]).dir;

  return {
    content: [
      {
        type: "text",
        "subtype": "heading1",
        text: feed.rss.channel[0].item[0].title[0]
      },
      {
        type: 'image',
        media: fs.createReadStream(new URL(localFileName, import.meta.url)),
        alt_text: 'Article header image',
      },
      {
        type: "text",
        text: feed.rss.channel[0].item[0].description[0]
      },
      {
        type: "text",
        text: "Read on at kollitsch.dev",
        formatting: [
          {
            start: 11,
            end: 24,
            type: "link",
            url: feed.rss.channel[0].item[0].link[0]
          }
        ]
      }
    ],
    layout: [
      {
        type: "rows",
        display: [
          { blocks: [0] },
          { blocks: [1] },
          { blocks: [2] },
          { blocks: [3] }
        ]
      }
    ],
    slug: link,
  }

}
/**
 * @todo Add error handling
 * @todo Add logging
 */
const processPost = async () => {
  await loadEnv();
  const feed = await getFeed();
  await getArticleImage(feed);
  await postToTumblr(feed);
  await cleanup();
}

processPost();
