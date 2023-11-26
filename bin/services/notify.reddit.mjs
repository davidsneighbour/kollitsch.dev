// create app at https://ssl.reddit.com/prefs/apps/
// run npx reddit-oauth-helper

// https://www.reddit.com/r/davidsneighbour/
import 'dotenv/config';
import { submitRedditPost } from './utils.reddit.mjs';

const { REDDIT_API_ID, REDDIT_SECRET, REDDIT_REFRESH_TOKEN, FEED_LINK } = process.env;

/**
 * @todo better post content (markdown is not parsed server side)
 */
const main = async () => {
  try {
    await submitRedditPost(REDDIT_API_ID, REDDIT_SECRET, REDDIT_REFRESH_TOKEN, FEED_LINK);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
