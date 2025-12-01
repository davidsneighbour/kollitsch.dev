import type { GetStaticPaths } from "astro";
import siteConfig from "@data/setup.json";
import { llmsPost } from "@utils/llms";
import { formatUrl } from "@utils/path";
import { type BlogPost } from "@utils/content";
import { getCollection } from "astro:content";

export const getStaticPaths: GetStaticPaths = async () => {

  const posts = await getCollection('blog', (post) => !post.data.draft);
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { post },
  }));
};

interface Props {
  post: BlogPost;
}

export const GET = ({ props }: { props: Props }) => {
  const { post } = props;

  return llmsPost({
    post,
    site: siteConfig.url,
    link: formatUrl(post.id),
  });
};
