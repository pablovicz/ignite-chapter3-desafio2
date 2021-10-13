import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';
import { useRouter } from 'next/router';

import { getPaths, getPost } from '../../services/prismic';
import UtterancesComments from '../../components/UtterancesComments';
import { Navbar } from '../../components/Navbar';
import { PostInfo } from '../../components/PostInfo';
import { DateFormatter } from '../../utils/dateFormatter';
import { TextToReadingDuration } from '../../utils/wordsCounter';

import styles from './post.module.scss';


interface Post {
  first_publication_date: string | null;
  last_publication_date: string | null;
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
  nextPost?: {
    slug: string;
    title: string;
  };
  previousPost?: {
    slug: string;
    title: string;
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
      <img src={post.data.banner.url} alt="banner" className={styles.banner} />
      <main className={styles.container}>
        <article className={styles.content}>
          <h1>{post.data.title}</h1>
          <PostInfo
            publication_date={DateFormatter(post.first_publication_date)}
            last_updated_date={DateFormatter(post.last_publication_date, true)}
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
        <footer className={styles.footer}>
          <Navbar nextPost={post.nextPost} previousPost={post.previousPost}/>
          <UtterancesComments />
        </footer>
      </main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {

  const paths = await getPaths();

  return {
    paths: paths,
    fallback: true
  }
};

export const getStaticProps: GetStaticProps = async ({ params }) => {

  const { slug } = params;

  const post = await getPost(String(slug));

  return {
    props: {
      post

    },
    revalidate: 60 * 60 * 12, //12 horas
  }
};
