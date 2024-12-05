import fs from "fs";
import { homedir } from "os";
import path from "path";
import dotenv from "dotenv";
import { access, mkdir, readFile, writeFile } from "fs/promises";
import fetch from "node-fetch";
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

// Default configurations
const DEFAULT_CACHE_DIR = "./cache";
const DEFAULT_CACHE_FILE = "rss-linkedin.json";
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
Usage: node linkedin.mjs [options]

Options:
  --help                 Show this help message and exit.
  --feed=<url>           Specify the RSS feed URL (default: ${DEFAULT_RSS_FEED_URL}).
  --cache-dir=<path>     Specify the cache directory (default: ${DEFAULT_CACHE_DIR}).
  --cache-file=<name>    Specify the cache file name (default: ${DEFAULT_CACHE_FILE}).

Environment Variables:
  LINKEDIN_ACCESS_TOKEN  LinkedIn access token (required).
  LINKEDIN_ORGANIZATION_ID LinkedIn organization (page) ID (required).
  RSS_FEED_URL           RSS feed URL (overrides default).
  CACHE_DIR              Cache directory path (overrides default).
  CACHE_FILE             Cache file name (overrides default).

Examples:
  Use defaults:
    node linkedin.mjs

  Custom RSS feed:
    node linkedin.mjs --feed=https://example.com/rss.xml
  `);
  process.exit(0);
}

// Configurable values
const LINKEDIN_ACCESS_TOKEN = process.env.LINKEDIN_ACCESS_TOKEN;
const LINKEDIN_USERID = process.env.LINKEDIN_USERID;

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

// Ensure required credentials are available
if (!LINKEDIN_ACCESS_TOKEN || !LINKEDIN_USERID) {
  console.error(
    "Missing required LinkedIn credentials. Ensure LINKEDIN_ACCESS_TOKEN and LINKEDIN_USERID are set in your .env file.",
  );
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
 * Posts a link share to a LinkedIn user's profile using the official LinkedIn API.
 * @param {string} message - The commentary text for the post.
 * @param {string} link - The URL to be shared.
 * @param {string} title - The title of the article or page.
 * @param {string} description - The description of the link.
 */
async function postLinkToLinkedIn(message, link, title, description) {
  try {
    const USER_ID = LINKEDIN_USERID; // Replace with the LinkedIn user ID retrieved from the "/me" endpoint
    const url = `https://api.linkedin.com/v2/ugcPosts`;

    const payload = {
      author: `urn:li:person:${USER_ID}`,
      lifecycleState: "PUBLISHED",
      specificContent: {
        "com.linkedin.ugc.ShareContent": {
          shareCommentary: {
            text: message, // Add your post commentary here
          },
          shareMediaCategory: "ARTICLE",
          media: [
            {
              status: "READY",
              description: {
                text: description, // Use the description for the link
              },
              originalUrl: link, // The URL being shared
              title: {
                text: title, // The title of the link
              },
            },
          ],
        },
      },
      visibility: {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };

    console.log("Posting payload to LinkedIn:", payload);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LINKEDIN_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Failed to post to LinkedIn: ${response.statusText} - ${errorText}`,
      );
    }

    const result = await response.json();
    console.log(`Posted to LinkedIn successfully. Post URN: ${result.id}`);
  } catch (err) {
    console.error("Failed to post to LinkedIn:", err.message);
  }
}

/**
 * Main function to fetch the latest RSS item and post it to LinkedIn.
 */
async function main() {
  try {
    await ensureCacheDirectory();

    const latestItem = await fetchLatestRSSItem();

    if (latestItem) {
      const message = `New post: ${latestItem.title} - ${latestItem.link}`;
      const link = latestItem.link;
      const title = latestItem.title;
      const description = "Read more...";
      await postLinkToLinkedIn(message, link, title, description);
    } else {
      console.log("No new RSS items to post.");
    }
  } catch (err) {
    console.error("Error:", err.message);
  }
}

main();
