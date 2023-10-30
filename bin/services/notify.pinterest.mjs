import fetch from 'node-fetch';
import 'dotenv/config';

const { PINTEREST_ACCESS_TOKEN } = process.env;
const { FEED_LINK } = process.env;
const { PINTEREST_BOARD_ID } = process.env;

const headers = {
  'Authorization': `Bearer ${PINTEREST_ACCESS_TOKEN}`,
  'Content-Type': 'application/json'
};

function sendMessage(message) {
  fetch(`https://api.pinterest.com/v1/boards/${PINTEREST_BOARD_ID}/pins/`, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify({
      note: message,
      link: FEED_LINK,
    }),
  });
}

fetch(FEED_LINK)
  .then((response) => response.text())
  .then((data) => {
    // Parse the feed data as needed
    // ...

    const message = `New pin on Pinterest: [Title](${FEED_LINK})`;
    sendMessage(message);
  });



// In this script:

// We import the necessary libraries and load environment variables from the .env file.
// We define the Pinterest API endpoint for creating pins on a specific board.
// The sendMessage function sends a new pin to Pinterest with a message and a link to the feed item.
// We fetch the feed data, parse it (you may need to adjust the parsing logic), and then create a new pin on Pinterest with the parsed information.
// Don't forget to add the required environment variables for Pinterest (e.g., PINTEREST_ACCESS_TOKEN, FEED_LINK, and PINTEREST_BOARD_ID) to your .env file.

// Let me know if you need further assistance or if you have any specific modifications in mind for this Pinterest script.
