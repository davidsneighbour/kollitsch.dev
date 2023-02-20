// create app at https://ssl.reddit.com/prefs/apps/
// run npx reddit-oauth-helper

// https://www.reddit.com/r/davidsneighbour/

// todo document
// todo move reddit api values into templates

import 'dotenv/config';

// @see https://github.com/not-an-aardvark/reddit-oauth-helper
const { REDDIT_API_ID } = process.env;
const { REDDIT_SECRET } = process.env;
const { REDDIT_REFRESH_TOKEN } = process.env;

console.log(REDDIT_REFRESH_TOKEN);

// https://github.com/not-an-aardvark/snoowrap
// see https://www.reddit.com/dev/api#POST_api_submit
let post = {
  'sr': 'davidsneighbour',
  'kind': 'self',
  'title': 'title',
  'text': 'text',
  'url': 'https://kollitsch.dev',
  // 	flair_id
  // a string no longer than 36 characters

  // flair_text
  // a string no longer than 64 characters
};

import snoowrap from 'snoowrap';

const r = new snoowrap({
  userAgent: 'davidsneighbour/kollitsch-dev',
  clientId: REDDIT_API_ID,
  clientSecret: REDDIT_SECRET,
  refreshToken: REDDIT_REFRESH_TOKEN
});

r.getSubreddit('davidsneighbour')
  .submitSelfpost(post);
