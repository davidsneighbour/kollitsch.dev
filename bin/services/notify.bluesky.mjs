import blue from "@atproto/api";
import fs from "node:fs/promises";
import 'dotenv/config';

import { loadFeed, downloadImage, loadEnv } from './utils.mjs';
import { createBlueSkyPost, createBlueskyEmbed, parseMentions, parseUrls } from './utils.bluesky.mjs';

const main = async () => {
  // @ts-ignore
  const { BskyAgent, RichText } = blue;
  try {
    await loadEnv();
    const { FEED_LINK, BLUESKY_BOT_USERNAME, BLUESKY_BOT_PASSWORD } = process.env;
    // @ts-ignore
    const feed = await loadFeed(FEED_LINK);

    const fileContent = {
      "body": await createBlueSkyPost(feed.rss.channel[0].item[0]),
    };
    console.log(fileContent);

    const agent = new BskyAgent({
      service: "https://bsky.social/"
    });
    await agent.login({
      identifier: BLUESKY_BOT_USERNAME,
      password: BLUESKY_BOT_PASSWORD,
    });
    const rt = new RichText({ text: fileContent.body });

    await downloadImage(
      feed.rss.channel[0].item[0]['media:content'][0]['$'].url,
      "./image"
    );

    // Read the image file
    const imgBytes = await fs.readFile("./image");

    // Check size limit
    if (imgBytes.length > 1000000) {

      throw new Error(`Image file size too large. 1000000 bytes maximum, got: ${imgBytes.length}`);
    }

    // Upload the image to the server
    const testUpload = await agent.uploadBlob(imgBytes, { encoding: "image/webp" });
    console.log("Upload successful, blob:", testUpload);

    const mentions = parseMentions(rt.text);
    const urls = parseUrls(rt.text);
    const facets = mentions.concat(urls);
    console.log(facets);

    const postRecord = {
      $type: "app.bsky.feed.post",
      text: rt.text,
      facets: facets,
      langs: ["en"],
      createdAt: new Date().toISOString(),
      embed: await createBlueskyEmbed(feed.rss.channel[0].item[0], testUpload.data.blob),
    };

    console.log(postRecord);

    await agent.post(postRecord);

  } catch (error) {
    console.error('Error:', error);
    process.exit();
  }
};

main();
