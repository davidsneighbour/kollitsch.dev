// create app at https://ssl.reddit.com/prefs/apps/
// run npx reddit-oauth-helper

// https://www.reddit.com/r/davidsneighbour/

// notify.reddit.mjs

import 'dotenv/config';
import { submitRedditPost } from './utils.reddit.mjs';

const { REDDIT_API_ID, REDDIT_SECRET, REDDIT_REFRESH_TOKEN, FEED_LINK } = process.env;

const main = async () => {
  try {
    // Submit a post to Reddit using the submitRedditPost function
    await submitRedditPost(REDDIT_API_ID, REDDIT_SECRET, REDDIT_REFRESH_TOKEN, FEED_LINK);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();


// // todo document
// // todo move reddit api values into templates
// import fetch from 'node-fetch';
// import 'dotenv/config';
// import snoowrap from 'snoowrap';

// import { parseString } from 'xml2js';
// // @see https://github.com/not-an-aardvark/reddit-oauth-helper
// const { REDDIT_API_ID } = process.env;
// const { REDDIT_SECRET } = process.env;
// const { REDDIT_REFRESH_TOKEN } = process.env;
// const { FEED_LINK } = process.env;

// fetch(FEED_LINK)
// 	.then((response) => response.text())
// 	.then((data) => {
// 		parseString(data, (error, result) => {
// 			let title = `${result.rss.channel[0].item[0].title[0]}`;
// 			let message = `New post on ${result.rss.channel[0].title[0]}`;
// 			message += ` titled: [${result.rss.channel[0].item[0].title[0]}](${result.rss.channel[0].item[0].link[0]})`;
// 			let url = `${result.rss.channel[0].item[0].link[0]}`;

// 			// https://github.com/not-an-aardvark/snoowrap
// 			// see https://www.reddit.com/dev/api#POST_api_submit

// 			// @todo add summary
// 			let post = {
// 				'sr': 'davidsneighbour',
// 				'kind': 'self',
// 				'title': title,
// 				'text': message,
// 				'url': url,
// 				// 	flair_id
// 				// a string no longer than 36 characters

// 				// flair_text
// 				// a string no longer than 64 characters
// 			};

// 			const r = new snoowrap({
// 				userAgent: 'davidsneighbour/kollitsch-dev',
// 				clientId: REDDIT_API_ID,
// 				clientSecret: REDDIT_SECRET,
// 				refreshToken: REDDIT_REFRESH_TOKEN
// 			});

// 			r.getSubreddit('davidsneighbour')
// 				.submitSelfpost(post);

// 		});

// 	});
