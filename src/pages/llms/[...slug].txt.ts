import { getCollection } from 'astro:content';
import setup from '@data/setup.json' with { type: 'json' };
import { type BlogPost } from '@utils/content';
import { llmsPost } from '@utils/llms';
import { formatUrl } from '@utils/path';
import type { GetStaticPaths } from 'astro';

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
    link: formatUrl(post.id),
    post,
    site: setup.url,
  });
};
