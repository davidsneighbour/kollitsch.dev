import { loadFeed, loadEnv } from './utils.mjs';
import { sendMessage } from './utils.discord.mjs';

const main = async () => {
  try {
    await loadEnv();
    const { FEED_LINK, DISCORD_WEBHOOK } = process.env;
    const feed = await loadFeed(FEED_LINK);
    let message = `New post on ${feed.rss.channel[0].title[0]}`;
    message += ` titled: [${feed.rss.channel[0].item[0].title[0]}](${feed.rss.channel[0].item[0].link[0]})`;
    sendMessage(DISCORD_WEBHOOK, message);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
