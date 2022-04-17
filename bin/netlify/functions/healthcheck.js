// Using the dotenv package allows us to have local-versions of our ENV variables in a
// .env file while still using different build-time ENV variables in production.
require('dotenv').config();

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

// Import node modules.
const axios = require('axios');

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

/**
 * I provide the Netlify serverless function logic.
 */
exports.handler = async function (event, context) {
  try {
    const apiResponse = await axios({
      method: 'get',
      url: 'https://kollitsch.dev/',
      timeout: 3000,
    });
  } catch (error) {
    if (error.response) {
      console.log(
        `Healthcheck returned with non-200 status code [${error.response.status}].`
      );
      // CAUTION: Even though we don't care about the underlying API call to
      // Postmark, we still have to AWAIT the call otherwise the Postmark API call
      // will timeout. I assume this has to do with the Function being torn-down
      // once the handler() returns.
      await sendEmail(error.response.status);
    } else {
      console.log('Probe could not make outbound request.');
      console.log(error.message);
    }
  }

  return {
    statusCode: 200,
    body: '',
  };
};

// ----------------------------------------------------------------------------------- //
// ----------------------------------------------------------------------------------- //

/**
 * I send an alert email to the boss.
 */
async function sendEmail(statusCode) {
  try {
    const authorizationBasic = window.btoa(
      `${process.env.MAILJET_API_KEY}` +
      ':' +
      `${process.env.MAILJET_API_SECRET}`
    );
    const apiResponse = await axios({
      method: 'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Basic ${authorizationBasic}`,
      },
      url: 'https://api.mailjet.com/v3.1/send',
      Messages: [
        {
          From: {
            Email: 'patrick@davids-neighbour.com',
            Name: 'Patrick Kollitsch',
          },
          To: [
            {
              Email: 'patrick@davids-neighbour.com',
              Name: 'Patrick Kollitsch',
            },
          ],
          Subject: 'Healthcheck failed on kollitsch.dev',
          HtmlPart: `
            <h1>Kollitsch.dev Not Responding</h1>
            <p>The healthcheck has responded with a non-200 status code
            [${statusCode}]. You best check the site to see if it is up.
            </p>`,
        },
      ],
      timeout: 5000,
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('Failed to send alert email.');
    // eslint-disable-next-line no-console
    console.log(error);
  }
}
