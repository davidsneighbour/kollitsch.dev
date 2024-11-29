import fs from "fs";
import { homedir } from "os";
import path from "path";
import dotenv from "dotenv";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import fetch from "node-fetch";
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
const DEFAULT_TELEGRAM_BOT_TOKEN = "";
const DEFAULT_TELEGRAM_CHAT_ID = "";
const DEFAULT_CACHE_DIR = "./cache";
const DEFAULT_CACHE_FILE = "rss-telegram.json";
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
Usage: node telegram.mjs [options]

Options:
  --help                 Show this help message and exit.
  --bot-token=<token>    Specify the Telegram bot token (default: taken from .env or empty).
  --chat-id=<id>         Specify the Telegram chat ID (default: taken from .env or empty).
  --feed=<url>           Specify the RSS feed URL (default: ${DEFAULT_RSS_FEED_URL}).
  --cache-dir=<path>     Specify the cache directory (default: ${DEFAULT_CACHE_DIR}).
  --cache-file=<name>    Specify the cache file name (default: ${DEFAULT_CACHE_FILE}).

Environment Variables:
  TELEGRAM_BOT_TOKEN     Telegram bot token (overrides default).
  TELEGRAM_CHAT_ID       Telegram chat ID (overrides default).
  RSS_FEED_URL           RSS feed URL (overrides default).
  CACHE_DIR              Cache directory path (overrides default).
  CACHE_FILE             Cache file name (overrides default).

Examples:
  Use defaults:
    node telegram.mjs

  Custom RSS feed:
    node telegram.mjs --feed=https://example.com/rss.xml

  Custom Telegram bot:
    node telegram.mjs --bot-token=YOUR_BOT_TOKEN --chat-id=CHAT_ID
  `);
  process.exit(0);
}

// Configurable values
const TELEGRAM_BOT_TOKEN = getArgValue(
  "bot-token",
  process.env.TELEGRAM_BOT_TOKEN || DEFAULT_TELEGRAM_BOT_TOKEN,
);
const TELEGRAM_CHAT_ID = getArgValue(
  "chat-id",
  process.env.TELEGRAM_CHAT_ID || DEFAULT_TELEGRAM_CHAT_ID,
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
 * Posts a message to a Telegram channel using a bot.
 * @param {string} message
 */
async function postToTelegram(message) {
  try {
    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        disable_web_page_preview: false,
      }),
    });

    console.log(response);
    if (!response.ok) {
      throw new Error(`Failed to post to Telegram: ${response.statusText}`);
    }

    console.log("Posted to Telegram successfully.");
  } catch (err) {
    console.error("Failed to post to Telegram:", err.message);
  }
}

/**
 * Main function to fetch the latest RSS item and post it to Telegram.
 */
async function main() {
  try {
    await ensureCacheDirectory();

    const latestItem = await fetchLatestRSSItem();

    if (latestItem) {
      const message = `New post: ${latestItem.title} - ${latestItem.link}`;
      await postToTelegram(message);
    } else {
      console.log("No new RSS items to post.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
