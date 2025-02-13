import fs from "fs";
import { homedir } from "node:os";
import path from "path";
import dotenv from "dotenv";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import { createRestAPIClient } from "masto";
import xml2js from "xml2js";

// @todo add post message template

const userHomeDir = homedir();

// Load .env files
const GLOBAL_ENV_PATH = path.join(userHomeDir, ".env");
const LOCAL_ENV_PATH = path.resolve(".env");

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
const DEFAULT_MASTODON_INSTANCE_URL = "https://mas.to";
const DEFAULT_MASTODON_ACCESS_TOKEN = "";
const DEFAULT_CACHE_DIR = "./cache";
const DEFAULT_CACHE_FILE = "rss-mastodon.json";
const DEFAULT_RSS_FEED_URL = "https://kollitsch.dev/rss.xml";

// Parse command-line arguments
const args = process.argv.slice(2);
const getArgValue = (argName, defaultValue) => {
  const arg = args.find((arg) => arg.startsWith(`--${argName}=`));
  return arg ? arg.split("=")[1] : defaultValue;
};

// Check for --help argument
if (args.includes("--help")) {
  console.log(`
Usage: node mastodon.mjs [options]

Options:
  --help                 Show this help message and exit.
  --mastodon-url=<url>   Specify the Mastodon instance URL (default: ${DEFAULT_MASTODON_INSTANCE_URL}).
  --mastodon-token=<token> Specify the Mastodon access token (default: taken from .env or empty).
  --feed=<url>           Specify the RSS feed URL (default: ${DEFAULT_RSS_FEED_URL}).
  --cache-dir=<path>     Specify the cache directory (default: ${DEFAULT_CACHE_DIR}).
  --cache-file=<name>    Specify the cache file name (default: ${DEFAULT_CACHE_FILE}).

Environment Variables:
  MASTODON_INSTANCE_URL  Mastodon instance URL (overrides default).
  MASTODON_ACCESS_TOKEN  Mastodon access token (overrides default).
  RSS_FEED_URL           RSS feed URL (overrides default).
  CACHE_DIR              Cache directory path (overrides default).
  CACHE_FILE             Cache file name (overrides default).

Examples:
  Use defaults:
    node mastodon.mjs

  Custom RSS feed:
    node mastodon.mjs --feed=https://example.com/rss.xml

  Custom Mastodon instance:
    node mastodon.mjs --mastodon-url=https://custom.instance --mastodon-token=custom_access_token
  `);
  process.exit(0);
}

// Configurable values
const MASTODON_INSTANCE_URL = getArgValue(
  "mastodon-url",
  process.env.MASTODON_INSTANCE_URL || DEFAULT_MASTODON_INSTANCE_URL,
);
const MASTODON_ACCESS_TOKEN = getArgValue(
  "mastodon-token",
  process.env.MASTODON_ACCESS_TOKEN || DEFAULT_MASTODON_ACCESS_TOKEN,
);
const RSS_FEED_URL = getArgValue(
  "feed",
  process.env.RSS_FEED_URL || DEFAULT_RSS_FEED_URL,
);
const CACHE_DIR = getArgValue(
  "cache-dir",
  process.env.CACHE_DIR || DEFAULT_CACHE_DIR,
);
const CACHE_FILE = getArgValue(
  "cache-file",
  process.env.CACHE_FILE || DEFAULT_CACHE_FILE,
);
const CACHE_FILE_PATH = path.join(CACHE_DIR, CACHE_FILE);

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
    const data = await readFile(CACHE_FILE_PATH, "utf8");
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
 * Posts a message to Mastodon using `masto.js`.
 * @param {string} message
 */
async function postToMastodon(message) {
  try {
    const client = createRestAPIClient({
      url: MASTODON_INSTANCE_URL,
      accessToken: MASTODON_ACCESS_TOKEN,
    });

    await client.v1.statuses.create({ status: message });
    console.log("Posted to Mastodon successfully.");
  } catch (err) {
    console.error("Failed to post to Mastodon:", err.message);
  }
}

/**
 * Cleans the cache file by removing invalid entries.
 * @returns {Promise<void>}
 */
async function cleanCache() {
  const cachedIds = await readCache();
  const validIds = cachedIds.filter((id) => id !== null && id !== undefined);
  if (validIds.length !== cachedIds.length) {
    console.log("Cleaning invalid entries from cache...");
    await writeCache(validIds);
  }
}

/**
 * Main function to fetch the latest RSS item and post it to Mastodon.
 */
async function main() {
  try {
    await ensureCacheDirectory();
    await cleanCache(); // Clean cache

    const latestItem = await fetchLatestRSSItem();

    if (latestItem) {
      const message = `New post: ${latestItem.title} - ${latestItem.link}`;
      await postToMastodon(message);
    } else {
      console.log("No new RSS items to post.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
