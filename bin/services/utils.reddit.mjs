import fetch from 'node-fetch';
import { parseString } from 'xml2js';
import snoowrap from 'snoowrap';

/**
 *
 * @param {*} apiId
 * @param {*} secret
 * @param {*} refreshToken
 * @param {*} feedLink
 * @returns
 */
export const submitRedditPost = async (apiId, secret, refreshToken, feedLink) => {
  try {
    // Load feed using the loadFeed function
    const response = await fetch(feedLink);
    const data = await response.text();
    const result = await new Promise((resolve) => {
      parseString(data, (error, result) => {
        if (error) {
          console.error('Error parsing RSS:', error);
          resolve(null);
        } else {
          resolve(result);
        }
      });
    });

    if (!result) {
      console.error('RSS parsing failed.');
      return;
    }

    const title = `${result.rss.channel[0].item[0].title[0]}`;
    let message = `New post on ${result.rss.channel[0].title[0]}`;
    message += ` titled: [${result.rss.channel[0].item[0].title[0]}](${result.rss.channel[0].item[0].link[0]})`;
    const url = `${result.rss.channel[0].item[0].link[0]}`;

    const post = {
      sr: 'davidsneighbour',
      kind: 'self',
      title: title,
      text: message,
      url: url,
    };

    const r = new snoowrap({
      userAgent: 'davidsneighbour/kollitsch-dev',
      clientId: apiId,
      clientSecret: secret,
      refreshToken: refreshToken,
    });

    await r.getSubreddit('davidsneighbour').submitSelfpost(post);
    console.log('Reddit post submitted successfully.');
  } catch (error) {
    console.error('Error:', error);
  }
};
