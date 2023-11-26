// Create a Telegram Bot:

// Open the Telegram app and search for the "BotFather" bot.
// Start a chat with BotFather and use the /newbot command to create a new bot.
// Follow the instructions to choose a name and username for your bot.
// Once your bot is created, you will receive a token. Save this token; you'll need it for authentication.
// Create a Telegram Channel:

// Create a Telegram channel if you haven't already.
// Add your bot as an admin to the channel with publishing rights.

import fetch from 'node-fetch';

/**
 *
 * @param {*} botToken
 * @param {*} channelId
 * @param {*} message
 * @param {*} imageUrl
 */
export async function postToTelegramChannel(botToken, channelId, message, imageUrl) {
  try {
    const apiUrl = `https://api.telegram.org/bot${botToken}/sendPhoto`;

    const formData = new FormData();
    formData.append('chat_id', channelId);
    formData.append('caption', message);
    formData.append('photo', imageUrl);

    const response = await fetch(apiUrl, {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();

    if (data.ok) {
      console.log('Posted to Telegram successfully');
    } else {
      console.error('Failed to post to Telegram:', data.description);
    }
  } catch (error) {
    console.error('Error posting to Telegram:', error);
  }
}
