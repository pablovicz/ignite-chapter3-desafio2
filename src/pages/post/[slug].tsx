import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import Prismic from '@prismicio/client';
import { PostInfo } from '../../components/PostInfo';

import { getPrismicClient } from '../../services/prismic';


import { DateFormatter } from '../../utils/dateFormatter';
import { TextToReadingDuration } from '../../utils/wordsCounter';
import styles from './post.module.scss';
import { useRouter } from 'next/router';

interface Post {
  first_publication_date: string | null;
  data: {
    title: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface PostProps { 
  post: Post;
}

export default function Post({ post }: PostProps) {


  const router = useRouter();

  if (router.isFallback) {
    return <p>Carregando...</p>;
  }


  return (
    <>
      <Head>
        <title>Post | spacetraveling</title>
      </Head>
      <img src={post.data.banner.url} alt="banner" className={styles.banner}/>
      <main className={styles.container}>
        <article className={styles.content}>
          <h1>{post.data.title}</h1>
          <PostInfo
            publication_date={DateFormatter(post.first_publication_date)}
            author={post.data.author}
            duration={TextToReadingDuration(post.data.content)}
          />
          {post.data.content.map(content => (
            <div key={content.heading}>
              <h3>{content.heading}</h3>
              <div
                className={styles.postContent}
                dangerouslySetInnerHTML={{ __html: RichText.asHtml(content.body) }}
              />
            </div>
          ))}
        </article>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const prismic = getPrismicClient();
  const posts = await prismic.query([Prismic.predicates.at('document.type', 'posts')],{
      pageSize: 2,
    }
  );

  const paths = posts.results.map(post => ({params: { slug: post.uid }}));

  return {
    paths: paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug } = params;

  // console.log(slug)

  const prismic = getPrismicClient();
  const response = await prismic.getByUID('post', String(slug), {});

  // console.log(JSON.stringify(response.data.content, null, 2));

  const content = response.data.content.map(c => {
    return {
        heading: c.heading,
        body: c.body
    }
  })


  const post = {
    uid: response.uid,
    first_publication_date: response.first_publication_date,
    data: {
      title: response.data.title,
      subtitle: response.data.subtitle,
      banner: response.data.banner,
      author: response.data.author,
      content: content,
    }

  }

  // console.log(post)

  return {
    props: {
      post
    },
    revalidate: 60 * 60 * 12, //12 horas
  }
};
