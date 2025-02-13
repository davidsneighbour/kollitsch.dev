import fs from "fs";
import { homedir } from "os";
import path from "path";
import dotenv from "dotenv";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import fetch from "node-fetch";
import xml2js from "xml2js";

// Load .env files
const userHomeDir = homedir();
const GLOBAL_ENV_PATH = path.join(userHomeDir, ".env");
const LOCAL_ENV_PATH = path.resolve(".env");
console.log("Resolved GLOBAL_ENV_PATH:", GLOBAL_ENV_PATH);

/**
 * Load environment variables from a file if it exists.
 * @param filePath
 * @returns Parsed environment variables
 */
function loadEnvFile(filePath) {
  if (fs.existsSync(filePath)) {
    const envContent = fs.readFileSync(filePath, "utf8");
    console.log("Loaded .env content:", envContent); // Debug the content
    return dotenv.parse(envContent);
  }
  return {};
}

// Merge global and local .env configurations
const globalEnv = loadEnvFile(GLOBAL_ENV_PATH);
const localEnv = loadEnvFile(LOCAL_ENV_PATH);
process.env = { ...globalEnv, ...process.env, ...localEnv };

// Tumblr API keys from environment variables
const TUMBLR_CONSUMER_KEY = process.env.TUMBLR_CONSUMER_KEY || "";
const TUMBLR_CONSUMER_SECRET = process.env.TUMBLR_CONSUMER_SECRET || "";
const TUMBLR_BLOG_IDENTIFIER =
  process.env.TUMBLR_BLOG_IDENTIFIER || "davidsneighbour.tumblr.com"; // e.g., myblog.tumblr.com

console.log("TUMBLR_CONSUMER_KEY:", TUMBLR_CONSUMER_KEY);
console.log("TUMBLR_CONSUMER_SECRET:", TUMBLR_CONSUMER_SECRET);
console.log("TUMBLR_BLOG_IDENTIFIER:", TUMBLR_BLOG_IDENTIFIER);

if (
  !TUMBLR_CONSUMER_KEY ||
  !TUMBLR_CONSUMER_SECRET ||
  !TUMBLR_BLOG_IDENTIFIER
) {
  console.error(
    "Missing Tumblr API keys or blog identifier in environment variables.",
  );
  process.exit(1);
}

// Default configurations
const DEFAULT_CACHE_DIR = "./cache";
const DEFAULT_CACHE_FILE = "rss-tumblr.json";
const DEFAULT_RSS_FEED_URL = "https://kollitsch.dev/rss.xml";

const CACHE_DIR = DEFAULT_CACHE_DIR;
const CACHE_FILE = DEFAULT_CACHE_FILE;
const CACHE_FILE_PATH = path.join(CACHE_DIR, CACHE_FILE);
const RSS_FEED_URL = DEFAULT_RSS_FEED_URL;

/**
 * Ensures the cache directory exists, creating it if necessary.
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
 * @param data
 */
async function writeCache(data) {
  await writeFile(CACHE_FILE_PATH, JSON.stringify(data, null, 2));
}

/**
 * Fetches and parses the RSS feed, returning the latest uncached item.
 */
async function fetchLatestRSSItem() {
  const response = await fetch(RSS_FEED_URL);
  const feedData = await response.text();
  const parsedFeed = await xml2js.parseStringPromise(feedData);
  const items = parsedFeed.rss.channel[0].item;

  const cachedIds = await readCache();

  const newItem = items.find((item) => {
    const guid = item.guid?.[0]?._ || item.guid?.[0];
    return guid && !cachedIds.includes(guid);
  });

  if (newItem) {
    const guid = newItem.guid?.[0]?._ || newItem.guid?.[0];
    if (guid) {
      cachedIds.push(guid);
      await writeCache(cachedIds);
      return { title: newItem.title[0], link: newItem.link[0] };
    }
  }

  return null;
}

/**
 * Fetches an OAuth 2.0 Bearer Token.
 */
async function fetchBearerToken() {
  const tokenUrl = "https://api.tumblr.com/v2/oauth2/token";
  const credentials = Buffer.from(
    `${TUMBLR_CONSUMER_KEY}:${TUMBLR_CONSUMER_SECRET}`,
  ).toString("base64");

  const response = await fetch(tokenUrl, {
    method: "POST",
    headers: {
      Authorization: `Basic ${credentials}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to fetch bearer token: ${error}`);
  }

  const { access_token } = await response.json();
  return access_token;
}

/**
 * Posts a message to Tumblr.
 * @param bearerToken
 * @param title
 * @param body
 */
async function postToTumblr(bearerToken, title, body) {
  const url = `https://api.tumblr.com/v2/blog/${TUMBLR_BLOG_IDENTIFIER}/post`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${bearerToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ type: "text", title, body }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to post to Tumblr: ${error}`);
  }

  console.log("Posted to Tumblr successfully.");
}

/**
 * Main function to fetch the latest RSS item and post it to Tumblr.
 */
async function main() {
  try {
    await ensureCacheDirectory();

    const latestItem = await fetchLatestRSSItem();

    if (latestItem) {
      const bearerToken = await fetchBearerToken();
      const title = `New post: ${latestItem.title}`;
      const body = `<a href="${latestItem.link}">${latestItem.title}</a>`;
      await postToTumblr(bearerToken, title, body);
    } else {
      console.log("No new RSS items to post.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
