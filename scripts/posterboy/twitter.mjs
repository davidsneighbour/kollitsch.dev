import fs from "fs";
import { homedir } from "os";
import path from "path";
import dotenv from "dotenv";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import fetch from "node-fetch";
import { TwitterApi } from "twitter-api-v2";
import xml2js from "xml2js";

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

// Twitter API credentials
const TWITTER_API_KEY = process.env.TWITTER_API_KEY || "";
const TWITTER_API_SECRET = process.env.TWITTER_API_SECRET || "";
const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN || "";

if (!TWITTER_API_KEY || !TWITTER_API_SECRET || !TWITTER_BEARER_TOKEN) {
  console.error("Missing required Twitter API credentials in .env.");
  process.exit(1);
}

// RSS Feed and Cache Configuration
const DEFAULT_CACHE_DIR = "./cache";
const DEFAULT_CACHE_FILE = "rss-twitter.json";
const DEFAULT_RSS_FEED_URL = "https://kollitsch.dev/rss.xml";
const CACHE_DIR = path.resolve(DEFAULT_CACHE_DIR);
const CACHE_FILE_PATH = path.join(CACHE_DIR, DEFAULT_CACHE_FILE);
const RSS_FEED_URL = process.env.RSS_FEED_URL || DEFAULT_RSS_FEED_URL;

// Ensure cache directory exists
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

// Read and write cache
async function readCache() {
  try {
    const data = await readFile(CACHE_FILE_PATH, "utf8");
    return JSON.parse(data) || [];
  } catch {
    return [];
  }
}

async function writeCache(data) {
  await writeFile(CACHE_FILE_PATH, JSON.stringify(data, null, 2));
}

// Fetch and parse RSS feed
async function fetchLatestRSSItem() {
  try {
    const response = await fetch(RSS_FEED_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
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
  } catch (err) {
    console.error("Error fetching RSS feed:", err.message);
    return null;
  }
}

// Post to Twitter
async function postToTwitter(message) {
  try {
    const client = new TwitterApi({
      appKey: TWITTER_API_KEY,
      appSecret: TWITTER_API_SECRET,
      accessToken: TWITTER_BEARER_TOKEN,
    });

    const tweet = await client.v2.tweet(message);
    console.log("Tweeted successfully:", tweet.data);
  } catch (err) {
    console.error("Failed to post to Twitter:", err.message);
    if (err.response) {
      console.error("Error details:", err.response.data);
    }
  }
}

// Main function
async function main() {
  try {
    await ensureCacheDirectory();

    const latestItem = await fetchLatestRSSItem();
    if (!latestItem) {
      console.log("No new RSS items to post.");
      return;
    }

    const message = `New post: ${latestItem.title} - ${latestItem.link}`;
    await postToTwitter(message);
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
