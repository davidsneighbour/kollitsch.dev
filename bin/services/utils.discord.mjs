
// utils.discord.mjs

import fetch from 'node-fetch';

export const sendMessage = (webhook, message) => {
  fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: 'DNBot',
      content: message,
    }),
  });
};
