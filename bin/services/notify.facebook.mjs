import { postToFacebookPage } from './utils.facebook.mjs'; // Import the utility function
import { config as dotenvConfig } from 'dotenv';
import { loadFeed, loadEnv } from './utils.mjs';

const main = async () => {
  try {

    await loadEnv();

    const pageId = process.env.FACEBOOK_PAGE_ID;
    const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    const message = 'Your post message here';
    const imageUrl = 'URL of the image you want to post';

    await postToFacebookPage(pageId, accessToken, message, imageUrl);
  } catch (error) {
    console.error('Error:', error);
  }
};

main();
