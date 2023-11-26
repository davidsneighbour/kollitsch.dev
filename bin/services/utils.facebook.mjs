import axios from 'axios'; // You may choose to use axios or another HTTP library
import fs from 'node:fs';

/**
 *
 * @param {*} pageId
 * @param {*} accessToken
 * @param {*} message
 * @param {*} imageUrl
 */
export async function postToFacebookPage(pageId, accessToken, message, imageUrl) {
  try {
    // Create a FormData object for posting with an image
    const formData = new FormData();
    formData.append('message', message);
    formData.append('url', imageUrl);

    // Make a POST request to the Facebook Graph API to post to the page
    const response = await axios.post(
      `https://graph.facebook.com/v12.0/${pageId}/photos?access_token=${accessToken}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    if (response.data.id) {
      console.log('Posted to Facebook successfully:', response.data.id);
    } else {
      console.error('Failed to post to Facebook:', response.data);
    }
  } catch (error) {
    console.error('Error posting to Facebook:', error);
  }
}

// You can add more utility functions as needed
