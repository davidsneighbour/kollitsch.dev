// todo document
import fetch from 'node-fetch';
import 'dotenv/config';

import { parseString } from 'xml2js';
const { MASTODON_ACCESS_TOKEN } = process.env;
const { FEED_LINK } = process.env;

function sendMessage(message) {
	fetch('https://mas.to/api/v1/statuses', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + MASTODON_ACCESS_TOKEN
		},
		body: JSON.stringify({
			status: message
		}),
	});
}

fetch(FEED_LINK)
	.then((response) => response.text())
	.then((data) => {
		parseString(data, (error, result) => {
			let message = `New post on ${result.rss.channel[0].title[0]}`;
			message += ` titled: [${result.rss.channel[0].item[0].title[0]}](${result.rss.channel[0].item[0].link[0]})`;
			sendMessage(message);
		});
	});
