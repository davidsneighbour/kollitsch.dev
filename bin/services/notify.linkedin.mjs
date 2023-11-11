// notify.linkedin.mjs

import { loadFeed, downloadImage } from './utils.mjs';
import { getUserProfile, postToLinkedIn } from './utils.linkedin.mjs';
import 'dotenv/config';
import path from 'path';

const main = async () => {
  const { LINKEDIN_ACCESS_TOKEN, FEED_LINK } = process.env;

  try {
    const profile = await getUserProfile(LINKEDIN_ACCESS_TOKEN);
    const feed = await loadFeed(FEED_LINK);
    const localFilePath = 'image' + path.parse(feed.rss.channel[0].item[0]['media:content'][0]['$']['url']).ext;
    await downloadImage(feed.rss.channel[0].item[0]['media:content'][0]['$']['url'], localFilePath);
    const postResponse = await postToLinkedIn(feed, profile, LINKEDIN_ACCESS_TOKEN);

    console.log(postResponse);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();

// import fetch from 'node-fetch';
// import 'dotenv/config';

// const { LINKEDIN_ACCESS_TOKEN } = process.env;
// const { FEED_LINK } = process.env;

// const headers = {
// 	'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
// 	'LinkedIn-Version': '202306',
// 	'X-Restli-Protocol-Version': '2.0.0',
// 	'Content-Type': 'application/json'
// };

// // Get user ID and cache it.
// const apiResp = await fetch('https://api.linkedin.com/v2/me', { headers: headers });
// const profile = await apiResp.json();
// import { parseString } from 'xml2js';

// fetch(FEED_LINK)
// 	.then((response) => response.text())
// 	.then((data) => {
// 		parseString(data, (error, result) => {

// 			const params = {
// 				"author": `urn:li:person:${profile.id}`,
// 				"commentary": "A new post on KOLLITSCH.dev*",
// 				"visibility": "PUBLIC",
// 				"distribution": {
// 					"feedDistribution": "MAIN_FEED",
// 					"targetEntities": [],
// 					"thirdPartyDistributionChannels": []
// 				},
// 				"content": {
// 					"article": {
// 						"source": result.rss.channel[0].item[0].link[0],
// 						// "thumbnail": "urn:li:image:C49klciosC89",
// 						"title": result.rss.channel[0].item[0].title[0],
// 						"description": result.rss.channel[0].item[0].description[0]
// 					}
// 				},
// 				"lifecycleState": "PUBLISHED",
// 				"isReshareDisabledByAuthor": false
// 			}

// 			const postResp = fetch(
// 				'https://api.linkedin.com/rest/posts', {
// 				method: 'POST',
// 				headers: headers,


// import fetch from 'node-fetch';
// import 'dotenv/config';

// const { LINKEDIN_ACCESS_TOKEN } = process.env;
// const { FEED_LINK } = process.env;

// const headers = {
// 	'Authorization': `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
// 	'LinkedIn-Version': '202306',
// 	'X-Restli-Protocol-Version': '2.0.0',
// 	'Content-Type': 'application/json'
// };

// // Get user ID and cache it.
// const apiResp = await fetch('https://api.linkedin.com/v2/me', { headers: headers });
// const profile = await apiResp.json();
// import { parseString } from 'xml2js';

// fetch(FEED_LINK)
// 	.then((response) => response.text())
// 	.then((data) => {
// 		parseString(data, (error, result) => {

// 			const params = {
// 				"author": `urn:li:person:${profile.id}`,
// 				"commentary": "A new post on KOLLITSCH.dev*",
// 				"visibility": "PUBLIC",
// 				"distribution": {
// 					"feedDistribution": "MAIN_FEED",
// 					"targetEntities": [],
// 					"thirdPartyDistributionChannels": []
// 				},
// 				"content": {
// 					"article": {
// 						"source": result.rss.channel[0].item[0].link[0],
// 						// "thumbnail": "urn:li:image:C49klciosC89",
// 						"title": result.rss.channel[0].item[0].title[0],
// 						"description": result.rss.channel[0].item[0].description[0]
// 					}
// 				},
// 				"lifecycleState": "PUBLISHED",
// 				"isReshareDisabledByAuthor": false
// 			}

// 			const postResp = fetch(
// 				'https://api.linkedin.com/rest/posts', {
// 				method: 'POST',
// 				headers: headers,
// 				body: JSON.stringify(params)
// 			}).then((response) => response.text())
// 				.then((data) => {
// 					console.log(data);
// 				});
// 		});
// 	});






// 				body: JSON.stringify(params)
// 			}).then((response) => response.text())
// 				.then((data) => {
// 					console.log(data);
// 				});
// 		});
// 	});





