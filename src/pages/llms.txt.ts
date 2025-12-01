import type { APIRoute } from "astro";
import setup from "@data/setup.json";
import { llmsTxt, postsToLlmsItems } from "@utils/llms";
import { getCollection } from "astro:content";

const formatLlmsUrl = (slug: string) => `/llms/${slug}.txt`;

export const GET: APIRoute = async () => {

  const posts = await getCollection('blog', (post) => !post.data.draft);

  return llmsTxt({
    name: setup.title,
    description: setup.description,
    site: setup.url,
    items: postsToLlmsItems(posts, formatLlmsUrl),
    optional: [
      { title: "About", link: "/about", description: "About the author" },
      { title: "RSS Feed", link: "/rss.xml", description: "Subscribe to updates" },
      {
        title: "Full Content",
        link: "/llms-full.txt",
        description: "Complete post content for deeper context",
      },
    ],
  });
};
