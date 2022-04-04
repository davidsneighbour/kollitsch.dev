// eslint-disable-next-line import/no-extraneous-dependencies
const fetch = require('node-fetch');
const dotenv = require('dotenv').config();
const { parseString } = require('xml2js');

const { FEED_LINK } = process.env;
const { DISCORD_WEBHOOK } = process.env;

// https://discord.com/developers/docs/resources/webhook#execute-webhook
function sendMessage(message) {
  fetch(DISCORD_WEBHOOK, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'DNBot',
      content: message,
      // avatar_url: '',
    }),
  });
}

fetch(FEED_LINK)
  .then((response) => response.text())
  .then((data) => {
    parseString(data, function (error, result) {
      let message = `New post on [${result.rss.channel[0].title[0]}](${result.rss.channel[0].link[0]})`;
      message += ` titled: [${result.rss.channel[0].item[0].title[0]}](${result.rss.channel[0].item[0].link[0]})`;
      sendMessage(message);
    });
  });
