import fetch from 'node-fetch';
import { parseStringPromise } from 'xml2js';
import { pipeline } from 'stream/promises';
import fs from 'fs';
import { config as dotenvConfig } from 'dotenv';
import { promisify } from 'util';
import { promises as fsPromises } from 'fs';

export async function loadFeed(feedLink) {
  try {
    const response = await fetch(feedLink);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const xmlData = await response.text();
    const cleanedXmlData = xmlData.replace('\ufeff', '');
    const data = await parseStringPromise(cleanedXmlData);
    return data;
  } catch (error) {
    console.error('Error loading feed:', error);
    throw error;
  }
}

export async function downloadImage(imageUrl, localFilePath) {
  try {
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`HTTP error while downloading image! Status: ${response.status}`);
    }

    const fileStream = fs.createWriteStream(localFilePath);
    await pipeline(response.body, fileStream);
  } catch (error) {
    console.error('Error downloading image:', error);
    throw error;
  }
}

// loading the .env file using async/await
// @todo find out why it doesn't work without this
export const loadEnv = async () => {
  try {
    const envFileContent = await fsPromises.readFile('.env', 'utf8');
    //console.log(envFileContent);
    dotenvConfig({ path: '.env' });
    //console.log(process.env);
  } catch (error) {
    console.error('Error loading .env file:', error);
  }
};

export const readFileSync = async () => { promisify(fs.readFile); }
export const writeFileSync = async () => { promisify(fs.writeFile); }
