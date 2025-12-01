
import type { APIRoute } from "astro";
import setup from "@data/setup.json";
import { llmsFullTxt, postsToLlmsFullItems } from "@utils/llms";
import { formatUrl } from "@utils/path";
import { getCollection } from "astro:content";

export const GET: APIRoute = async () => {

  const posts = await getCollection('blog', (post) => !post.data.draft);

  return llmsFullTxt({
    name: setup.title,
    description: setup.description,
    author: setup.author.name,
    site: setup.url,
    items: postsToLlmsFullItems(posts, formatUrl),
  });
};
