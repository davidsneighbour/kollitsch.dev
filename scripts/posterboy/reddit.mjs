import { readFile, writeFile, access, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import xml2js from 'xml2js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { homedir } from 'os';

const userHomeDir = homedir();

// Load .env files
const GLOBAL_ENV_PATH = path.join(userHomeDir, '.env');
const LOCAL_ENV_PATH = path.resolve('.env');

/**
 * Load environment variables from a file if it exists.
 * @param {string} filePath
 * @returns {object} Parsed environment variables
 */
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    return dotenv.parse(fs.readFileSync(filePath));
  }
  return {};
}

// Merge global and local .env configurations
const globalEnv = loadEnvFile(GLOBAL_ENV_PATH);
const localEnv = loadEnvFile(LOCAL_ENV_PATH);
process.env = { ...globalEnv, ...process.env, ...localEnv };

// Default configurations
const DEFAULT_CACHE_DIR = './cache';
const DEFAULT_CACHE_FILE = 'rss-reddit.json';
const DEFAULT_RSS_FEED_URL = 'https://kollitsch.dev/rss.xml';
const DEBUG = process.env.DEBUG === 'true';

// Parse command-line arguments
const args = process.argv.slice(2);
const getArgValue = (argName, defaultValue) => {
  const arg = args.find(arg => arg.startsWith(`--${argName}=`));
  return arg ? arg.split('=')[1] : defaultValue;
};

const isDebugEnabled = DEBUG || args.includes('--debug');

// Check for --help argument
if (args.includes('--help')) {
  console.log(`
Usage: node reddit.mjs [options]

Options:
  --help                 Show this help message and exit.
  --feed=<url>           Specify the RSS feed URL (default: ${DEFAULT_RSS_FEED_URL}).
  --cache-dir=<path>     Specify the cache directory (default: ${DEFAULT_CACHE_DIR}).
  --cache-file=<name>    Specify the cache file name (default: ${DEFAULT_CACHE_FILE}).
  --debug                Enable debug logging.

Environment Variables:
  REDDIT_CLIENT_ID       Reddit Client ID (required).
  REDDIT_CLIENT_SECRET   Reddit Client Secret (required).
  RSS_FEED_URL           RSS feed URL (overrides default).
  CACHE_DIR              Cache directory path (overrides default).
  CACHE_FILE             Cache file name (overrides default).
  DEBUG                  Enable debug logging (true/false).

Examples:
  Use defaults:
    node reddit.mjs

  Enable debugging:
    node reddit.mjs --debug
  `);
  process.exit(0);
}

// Configurable values
const REDDIT_CLIENT_ID = process.env.REDDIT_CLIENT_ID;
const REDDIT_CLIENT_SECRET = process.env.REDDIT_CLIENT_SECRET;
const RSS_FEED_URL = getArgValue('feed', process.env.RSS_FEED_URL || DEFAULT_RSS_FEED_URL);
const CACHE_DIR = getArgValue('cache-dir', process.env.CACHE_DIR || DEFAULT_CACHE_DIR);
const CACHE_FILE = getArgValue('cache-file', process.env.CACHE_FILE || DEFAULT_CACHE_FILE);
const CACHE_FILE_PATH = path.join(CACHE_DIR, CACHE_FILE);

// Ensure required credentials are available
if (!REDDIT_CLIENT_ID || !REDDIT_CLIENT_SECRET) {
  console.error('Missing required Reddit credentials. Ensure REDDIT_CLIENT_ID and REDDIT_CLIENT_SECRET are set in your .env file.');
  process.exit(1);
}

/**
 * Logs debugging information if debugging is enabled.
 * @param {...any} args - The values to log.
 */
function debugLog(...args) {
  if (isDebugEnabled) {
    console.log('[DEBUG]', ...args);
  }
}

/**
 * Ensures the cache directory exists, creating it if necessary.
 * @returns {Promise<void>}
 */
async function ensureCacheDirectory() {
  try {
    await access(CACHE_DIR);
  } catch {
    try {
      await mkdir(CACHE_DIR, { recursive: true });
    } catch (err) {
      console.error(`Failed to create cache directory: ${err.message}`);
      process.exit(1);
    }
  }
}

/**
 * Reads the cache file or returns an empty array if not found.
 * @returns {Promise<string[]>}
 */
async function readCache() {
  try {
    const data = await readFile(CACHE_FILE_PATH, 'utf8');
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

/**
 * Writes data to the cache file.
 * @param {string[]} data
 */
async function writeCache(data) {
  await writeFile(CACHE_FILE_PATH, JSON.stringify(data, null, 2));
}

/**
 * Fetches and parses the RSS feed, returning the latest uncached item.
 * @returns {Promise<{ title: string, link: string } | null>}
 */
async function fetchLatestRSSItem() {
  const response = await fetch(RSS_FEED_URL);
  const feedData = await response.text();
  debugLog('Fetched RSS feed:', feedData);

  const parsedFeed = await xml2js.parseStringPromise(feedData);
  const items = parsedFeed.rss.channel[0].item;

  const cachedIds = await readCache();
  debugLog('Cached IDs:', cachedIds);

  // Find the first item with a valid GUID that isn't already cached
  const newItem = items.find((item) => {
    const guid = item.guid?.[0]?._ || item.guid?.[0];
    return guid && !cachedIds.includes(guid);
  });

  if (newItem) {
    const guid = newItem.guid?.[0]?._ || newItem.guid?.[0]; // Get valid GUID
    if (guid) {
      cachedIds.push(guid); // Add to cache
      await writeCache(cachedIds); // Save cache
      return { title: newItem.title[0], link: newItem.link[0] };
    }
  }

  return null;
}

/**
 * Posts a message to Reddit.
 * @param {string} title
 * @param {string} url
 */
async function postToReddit(title, url) {
  try {
    debugLog('Starting Reddit OAuth2 flow...');
    const tokenResponse = await fetch('https://www.reddit.com/api/v1/access_token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
      }),
    });

    const tokenData = await tokenResponse.json();
    debugLog('Reddit OAuth2 Response:', tokenData);

    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(`Failed to authenticate with Reddit: ${tokenData.error || 'Unknown error'}`);
    }

    const accessToken = tokenData.access_token;

    debugLog('Posting to Reddit...');
    const postResponse = await fetch('https://oauth.reddit.com/api/submit', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sr: 'davidsneighbour', // Subreddit name
        kind: 'link',
        title,
        url,
      }),
    });

    const postData = await postResponse.json();
    debugLog('Reddit Post Response:', postData);

    // Check if the post was successful
    if (!postResponse.ok || postData.success === false) {
      throw new Error(
        `Failed to post to Reddit: ${postData.jquery?.[1]?.[3]?.[0]?.[0] || 'Unknown error'}`
      );
    }

    console.log(`Posted to Reddit successfully. Post ID: ${postData.id}`);
  } catch (err) {
    console.error('Failed to post to Reddit:', err);
  }
}


/**
 * Main function to fetch the latest RSS item and post it to Reddit.
 */
async function main() {
  try {
    await ensureCacheDirectory();

    const latestItem = await fetchLatestRSSItem();

    if (latestItem) {
      debugLog('Latest RSS Item:', latestItem);
      await postToReddit(latestItem.title, latestItem.link);
    } else {
      console.log('No new RSS items to post.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
