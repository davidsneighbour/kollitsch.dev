import { postToTelegramChannel } from './utils.telegram.mjs'; // Import the utility function
import { config as dotenvConfig } from 'dotenv';

const main = async () => {
  try {
    dotenvConfig();

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;
    const message = 'Your message here';
    const imageUrl = 'URL of the image you want to post';

    await postToTelegramChannel(botToken, channelId, message, imageUrl);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
