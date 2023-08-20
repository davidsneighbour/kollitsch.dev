require("dotenv").config();
var axios = require("axios");

exports.handler = async function (event: any, context: any) {

  try {

    var apiResponse = await axios({
      method: "get",
      url: "https://kollitsch.dev",
      timeout: 3000
    });

  } catch (error) {

    if (error.response) {

      console.log(`Healthcheck returned with non-200 status code [${error.response.status}].`);
      await sendEmail(error.response.status);

    } else {

      console.log("Probe could not make outbound request.");
      console.log(error.message);

    }

  }

  return ({
    statusCode: 200,
    body: ""
  });

};

async function sendEmail(statusCode: any) {

  try {

    var apiResponse = await axios({
      method: "post",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-Postmark-Server-Token": process.env.POSTMARK_SERVER_TOKEN
      },
      url: "https://api.postmarkapp.com/email",
      data: {
        From: "from@example.com",
        To: "to@example.com",
        Subject: "Healthcheck failed with non-200 status code.",
        HtmlBody: `<h1>Not Responding</h1>
          <p>
            The healthcheck has responded with a non-200 status code
            [${statusCode}]. You best check the site to see if it is up.
          </p>
        `,
        MessageStream: "outbound"
      },
      timeout: 5000
    });

  } catch (error) {

    console.log("Failed to send alert email.");
    console.log(error);

  }

}
