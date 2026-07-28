import { getCollection } from 'astro:content';
import setup from '@data/setup.json' with { type: 'json' };
import { type BlogPost } from '@utils/content';
import { filterDraftEntries } from '@utils/content.pure';
import { formatBlogPostPath, llmsPost } from '@utils/llms';
import type { GetStaticPaths } from 'astro';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = filterDraftEntries(await getCollection('blog'));

  return posts.flatMap((post) => {
    const parts = post.id.split('/');
    if (parts.length !== 2) {
      console.warn(`[blog.md] Skipping invalid slug: ${post.id}`);
      return [];
    }
    const [year, slug] = parts;
    return [
      {
        params: { slug, year },
        props: { post },
      },
    ];
  });
};

interface Props {
  post: BlogPost;
}

export const GET = ({ props }: { props: Props }) => {
  const { post } = props;
  const htmlPath = formatBlogPostPath(post.id);
  const response = llmsPost({
    link: htmlPath,
    post,
    site: setup.url,
  });

  response.headers.set(
    'Link',
    `<${new URL(htmlPath, setup.url).toString()}>; rel="alternate"; type="text/html"`,
  );
  response.headers.set('Vary', 'Accept');

  return response;
};
