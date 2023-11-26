// @todo document
// @see https://docs.joinmastodon.org/methods/statuses/#create

import { loadFeed } from './utils.mjs';
import { sendMessage } from './utils.mastodon.mjs';
import 'dotenv/config';
import { parseString } from 'xml2js';

const { MASTODON_ACCESS_TOKEN, FEED_LINK } = process.env;

/**
 * @todo better post content (markdown is not parsed server side)
 */
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
