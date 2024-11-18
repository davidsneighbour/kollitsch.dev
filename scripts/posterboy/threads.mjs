import { readFile, writeFile, access, mkdir } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import xml2js from 'xml2js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { homedir } from 'os';

// https://developers.facebook.com/docs/threads/get-started
// https://developers.facebook.com/docs/threads/posts/

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
const DEFAULT_CACHE_FILE = 'rss-threads.json';
const DEFAULT_RSS_FEED_URL = 'https://kollitsch.dev/rss.xml';

// Parse command-line arguments
const args = process.argv.slice(2);
const getArgValue = (argName, defaultValue) => {
  const arg = args.find(arg => arg.startsWith(`--${argName}=`));
  return arg ? arg.split('=')[1] : defaultValue;
};

// Check for --help argument
if (args.includes('--help')) {
  console.log(`
Usage: node threads.mjs [options]

Options:
  --help                 Show this help message and exit.
  --feed=<url>           Specify the RSS feed URL (default: ${DEFAULT_RSS_FEED_URL}).
  --cache-dir=<path>     Specify the cache directory (default: ${DEFAULT_CACHE_DIR}).
  --cache-file=<name>    Specify the cache file name (default: ${DEFAULT_CACHE_FILE}).

Environment Variables:
  THREADS_APP_ID         Threads App ID (required).
  THREADS_APP_SECRET     Threads App Secret (required).
  THREADS_CLIENT_TOKEN   Threads Client Token (required).
  RSS_FEED_URL           RSS feed URL (overrides default).
  CACHE_DIR              Cache directory path (overrides default).
  CACHE_FILE             Cache file name (overrides default).

Examples:
  Use defaults:
    node threads.mjs

  Custom RSS feed:
    node threads.mjs --feed=https://example.com/rss.xml
  `);
  process.exit(0);
}

// Configurable values
const THREADS_APP_ID = process.env.THREADS_APP_ID;
const THREADS_APP_SECRET = process.env.THREADS_APP_SECRET;
const THREADS_CLIENT_TOKEN = process.env.THREADS_CLIENT_TOKEN;

const RSS_FEED_URL = getArgValue('feed', process.env.RSS_FEED_URL || DEFAULT_RSS_FEED_URL);
const CACHE_DIR = getArgValue('cache-dir', process.env.CACHE_DIR || DEFAULT_CACHE_DIR);
const CACHE_FILE = getArgValue('cache-file', process.env.CACHE_FILE || DEFAULT_CACHE_FILE);
const CACHE_FILE_PATH = path.join(CACHE_DIR, CACHE_FILE);

// Ensure required credentials are available
if (!THREADS_APP_ID || !THREADS_APP_SECRET || !THREADS_CLIENT_TOKEN) {
  console.error('Missing required THREADS credentials. Ensure THREADS_APP_ID, THREADS_APP_SECRET, and THREADS_CLIENT_TOKEN are set in your .env file or passed as arguments.');
  process.exit(1);
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
  const parsedFeed = await xml2js.parseStringPromise(feedData);
  const items = parsedFeed.rss.channel[0].item;

  const cachedIds = await readCache();

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
 * Posts a message to Threads using the official Threads API.
 * @param {string} message
 */
async function postToThreads(message) {
  try {
    const url = `https://graph.facebook.com/v17.0/${THREADS_APP_ID}/threads`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${THREADS_CLIENT_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message,
        access_token: THREADS_CLIENT_TOKEN,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to post to Threads: ${response.statusText}`);
    }

    const result = await response.json();
    console.log(`Posted to Threads successfully. Post ID: ${result.id}`);
  } catch (err) {
    console.error('Failed to post to Threads:', err.message);
  }
}

/**
 * Main function to fetch the latest RSS item and post it to Threads.
 */
async function main() {
  try {
    await ensureCacheDirectory();

    const latestItem = await fetchLatestRSSItem();

    if (latestItem) {
      const message = `New post: ${latestItem.title} - ${latestItem.link}`;
      await postToThreads(message);
    } else {
      console.log('No new RSS items to post.');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

main();
