import fetch from 'node-fetch';

/**
 *
 * @param {*} accessToken
 * @returns
 */
export const getUserProfile = async (accessToken) => {
  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'LinkedIn-Version': '202306',
    'X-Restli-Protocol-Version': '2.0.0',
    'Content-Type': 'application/json'
  };

  const apiResp = await fetch('https://api.linkedin.com/v2/me', { headers });
  return await apiResp.json();
};

/**
 *
 * @param {*} feed
 * @param {*} profile
 * @param {*} accessToken
 * @returns
 */
export const postToLinkedIn = async (feed, profile, accessToken) => {

  const headers = {
    'Authorization': `Bearer ${accessToken}`,
    'LinkedIn-Version': '202306',
    'X-Restli-Protocol-Version': '2.0.0',
    'Content-Type': 'application/json'
  };

  const params = {
    "author": `urn:li:person:${profile.id}`,
    "commentary": "A new post on KOLLITSCH.dev*",
    "visibility": "PUBLIC",
    "distribution": {
      "feedDistribution": "MAIN_FEED",
      "targetEntities": [],
      "thirdPartyDistributionChannels": []
    },
    "content": {
      "article": {
        "source": feed.rss.channel[0].item[0].link[0],
        "title": feed.rss.channel[0].item[0].title[0],
        "description": feed.rss.channel[0].item[0].description[0]
      }
    },
    "lifecycleState": "PUBLISHED",
    "isReshareDisabledByAuthor": false
  };

  const postResp = await fetch('https://api.linkedin.com/rest/posts', {
    method: 'POST',
    headers,
    body: JSON.stringify(params)
  });

  return await postResp.text();
};
