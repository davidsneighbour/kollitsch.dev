import { getCollection } from "astro:content";
import rss from "@astrojs/rss";
import sitedata from "@data/siteinfo.json";

export async function GET(context) {
	let blog = await getCollection("blog", ({ data }) => {
		return data?.draft !== true;
	});
	// ({ data }) => import.meta.env.DEV || !data?.draft)
	blog.sort((a, b) => Date.parse(b.data.date) - Date.parse(a.data.date));
	blog = blog.slice(0, 10);

	return rss({
		title: sitedata.title,
		description: sitedata.description,
		site: sitedata.url,
		items: blog.map((post) => ({
			title: post.data.title,
			pubDate: post.data.pubDate,
			description: post.data.description,
			// Compute RSS link from post `id`
			// This example assumes all posts are rendered as `/blog/[id]` routes
			link: `/blog/${post.id}/`,
		})),
	});
}
