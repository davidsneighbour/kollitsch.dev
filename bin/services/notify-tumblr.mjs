// https://www.tumblr.com/docs/en/api/v2#posts---createreblog-a-post-neue-post-format
// https://www.tumblr.com/docs/npf

import 'dotenv/config';
import tumblr from 'tumblr.js';
import fs from 'node:fs';
import fetch from 'node-fetch';
import { parseString } from 'xml2js';

const { TUMBLR_BLOGID } = process.env;
const { TUMBLR_CONSUMER_KEY } = process.env;
const { TUMBLR_CONSUMER_SECRET } = process.env;
const { TUMBLR_TOKEN } = process.env;
const { TUMBLR_TOKEN_SECRET } = process.env;
const { FEED_LINK } = process.env;

const client = tumblr.createClient({
  consumer_key: TUMBLR_CONSUMER_KEY,
  consumer_secret: TUMBLR_CONSUMER_SECRET,
  token: TUMBLR_TOKEN,
  token_secret: TUMBLR_TOKEN_SECRET,
});

let message = "";
let description = "";
let title = "";
let link = "";

fetch(FEED_LINK)
  .then((response) => response.text())
  .then((data) => {
    parseString(data, (error, result) => {
      // console.log(error);
      // console.log(result);

      message = `Read on at kollitsch.dev`;
      title = result.rss.channel[0].item[0].title[0];
      description = result.rss.channel[0].item[0].description[0];
      link = result.rss.channel[0].item[0].link[0];

    })
  })
  .then((data) => {
    client.createPost(TUMBLR_BLOGID, {
      content: [
        {
          type: "text",
          "subtype": "heading1",
          text: title
        },
        // {
        //   type: 'image',
        //   media: fs.createReadStream(new URL('./image.jpg', import.meta.url)),
        //   alt_text: 'Article header image',
        // },
        {
          type: "text",
          text: description
        },
        {
          "type": "text",
          "text": message,
          "formatting": [
            {
              "start": 11,
              "end": 24,
              "type": "link",
              "url": link
            }
          ]
        }
      ],
      // layout: [
      //   {
      //     type: "rows",
      //     display: [
      //       { "blocks": [0] },
      //       { "blocks": [1] }
      //     ]
      //   }
      // ],
      tags: 'test,test2',
      slug: 'test',
    });
  });



