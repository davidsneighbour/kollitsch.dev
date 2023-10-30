// @todo document
// @see https://docs.joinmastodon.org/methods/statuses/#create

// notify.mastodon.mjs

import { loadFeed } from './utils.mjs';
import { sendMessage } from './utils.mastodon.mjs';
import 'dotenv/config';
import { parseString } from 'xml2js';

const { MASTODON_ACCESS_TOKEN, FEED_LINK } = process.env;

const main = async () => {
  try {
    const feed = await loadFeed(FEED_LINK);
    let message = `New post on ${feed.rss.channel[0].title[0]}`;
    message += ` titled: [${feed.rss.channel[0].item[0].title[0]}](${feed.rss.channel[0].item[0].link[0]})`;
    sendMessage(MASTODON_ACCESS_TOKEN, message);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();


// import fetch from 'node-fetch';
// import 'dotenv/config';

// import { parseString } from 'xml2js';
// const { MASTODON_ACCESS_TOKEN } = process.env;
// const { FEED_LINK } = process.env;

// function sendMessage(message) {
// 	fetch('https://mas.to/api/v1/statuses', {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'Authorization': 'Bearer ' + MASTODON_ACCESS_TOKEN
// 			// 			Idempotency-Key
// 			// Provide this header with any arbitrary string to prevent duplicate submissions of the same status. Consider using a hash or UUID generated client-side. Idempotency keys are stored for up to 1 hour.
// 		},
// 		body: JSON.stringify({
// 			status: message
// 		}),
// 	});
// }

// fetch(FEED_LINK)
// 	.then((response) => response.text())
// 	.then((data) => {
// 		parseString(data, (error, result) => {
// 			console.log(error);
// 			console.log(result);

// 			let message = `New post on ${result.rss.channel[0].title[0]}`;
// 			message += ` titled: [${result.rss.channel[0].item[0].title[0]}](${result.rss.channel[0].item[0].link[0]})`;
// 			sendMessage(message);
// 		});
// 	});

// // @todo response

// // 	200: OK
// // 401: Unauthorized
// // Invalid or missing Authorization header.

// // {
// //   "error": "The access token is invalid"
// // }
// // 422: Unprocessable entity
