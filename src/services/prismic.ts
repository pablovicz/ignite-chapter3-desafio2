import Prismic from '@prismicio/client';
import { DefaultClient } from '@prismicio/client/types/client';
import { getStaticPaths } from '../pages/post/[slug]';

export function getPrismicClient(req?: unknown): DefaultClient {
  const prismic = Prismic.client(
    process.env.PRISMIC_API_ENDPOINT, 
    {
      req,
      accessToken: process.env.PRISMIC_ACCESS_TOKEN
    }
  );

  return prismic;
}


export async function getPost(slug: string) {
  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', slug, {});
  // console.log(JSON.stringify(response.data.content, null, 2));

  const content = response.data.content.map(c => {
    return {
      heading: c.heading,
      body: c.body
    }
  });

  const posts = await prismic.query([Prismic.predicates.at('document.type', 'post')]);
  const paths = posts.results.map(post => ({ slug: post.uid, title: post.data.title}));
  const actualPost = paths.find(path => path.slug === response.uid);
  const nextPost = paths.indexOf(actualPost) !== paths.length - 1 ? paths[paths.indexOf(actualPost) + 1] : null;
  const previousPost = paths.indexOf(actualPost) !== 0 ? paths[paths.indexOf(actualPost) - 1] : null;


  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: response.data.banner,
      author: response.data.author,
      content: content,
    },
    nextPost: nextPost,
    previousPost: previousPost
  };

  return post;

}


export async function getPaths(){

  const prismic = getPrismicClient();
  const posts = await prismic.query([Prismic.predicates.at('document.type', 'post')], {
    pageSize: 2,
  });
  const paths = posts.results.map(post => ({ params: { slug: post.uid } }));

  return paths;
}


export function prismicToPostsList(prismicResponse) {
  const posts = prismicResponse.results.map(post => {
    return {
      uid: post.uid,
      first_publication_date: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }),
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      }
    }
  });


  return posts;
}
