// https://www.npmjs.com/package/node-fetch
// https://stackabuse.com/making-http-requests-in-node-js-with-node-fetch/
// notify.discord.mjs

import { loadFeed } from './utils.mjs';
import { sendMessage } from './utils.discord.mjs';
import 'dotenv/config';
import { parseString } from 'xml2js';

const { FEED_LINK, DISCORD_WEBHOOK } = process.env;

const main = async () => {
  try {
    const feed = await loadFeed(FEED_LINK);
    let message = `New post on ${feed.rss.channel[0].title[0]}`;
    message += ` titled: [${feed.rss.channel[0].item[0].title[0]}](${feed.rss.channel[0].item[0].link[0]})`;
    sendMessage(DISCORD_WEBHOOK, message);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();




// import fetch from 'node-fetch';
// import 'dotenv/config';

// import { parseString } from 'xml2js';

// const { FEED_LINK } = process.env;
// const { DISCORD_WEBHOOK } = process.env;

// // https://discord.com/developers/docs/resources/webhook#execute-webhook

// function sendMessage(message) {
// 	fetch(DISCORD_WEBHOOK, {
// 		method: 'POST',
// 		headers: {
// 			'Content-Type': 'application/json',
// 		},
// 		body: JSON.stringify({
// 			username: 'DNBot',
// 			content: message
// 		}),
// 	});
// }

// fetch(FEED_LINK)
// 	.then((response) => response.text())
// 	.then((data) => {
// 		parseString(data, (error, result) => {
// 			let message = `New post on ${result.rss.channel[0].title[0]}`;
// 			message += ` titled: [${result.rss.channel[0].item[0].title[0]}](${result.rss.channel[0].item[0].link[0]})`;
// 			sendMessage(message);
// 		});
// 	});


// // https://developer.mozilla.org/en-US/docs/Web/API/fetch#options

// // (async () => {
// // 	const response = await fetch('https://webscrapingapi.com');
// // 	const body = await response.text();
// // 	console.log(body);
// // })();

// // (async () => {
// // 	const response = await fetch('http://httpbin.org/post', {
// // 			method: 'POST',
// // 			body: JSON.stringify({
// // 					'key': 'value'
// // 			})
// // 	});
// // 	const body = await response.text();
// // 	console.log(body);
// // })();


// // (async () => {
// // 	try {
// // 			const response = await fetch('[INVALID_URL]');
// // 			const responseBody = await response.text();
// // 	} catch (error) {
// // 			console.log(error.message);
// // 	}
// // })();

// // fetch('[INVALID_URL]')
// // 	.then((response) => response.text())
// // 	.then((body) => {
// // 			console.log(body);
// // 	})
// // 	.catch((error) => {
// // 			console.log(error.message);
// // 	});

// // const cheerio = require("cheerio");
// // (async () => {
// //     const response = await fetch('https://www.webscrapingapi.com/');
// //     const responseBody = await response.text();
// //     const $ = cheerio.load(responseBody);
// //     console.log($('title').first().text());
// // })();
