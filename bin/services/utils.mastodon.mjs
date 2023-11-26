import fetch from 'node-fetch';

/**
 *
 * @param {*} accessToken
 * @param {*} message
 */
export const sendMessage = (accessToken, message) => {
  fetch('https://mas.to/api/v1/statuses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({
      status: message
    }),
  });
};
