import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { useState } from 'react';

import { getPrismicClient, prismicToPostsList } from '../services/prismic';
import { PostInfo } from '../components/PostInfo';
import { ExitPreviewButton } from '../components/ExitPreviewButton';

import styles from './home.module.scss';



interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  preview: boolean;
  postsPagination: PostPagination;
}

export default function Home({ preview, postsPagination }: HomeProps) {

  const [posts, setPosts] = useState<Post[]>(postsPagination?.results);
  const [nextPage, setNextPage] = useState<string>(postsPagination?.next_page);
  const [loading, setLoading] = useState(false);

  async function handleLoadMorePosts() {
    setLoading(true);
    if (nextPage) {
      var headers = new Headers();
      fetch(nextPage, {
        method: 'GET',
        headers: headers,
        mode: 'cors'
      })
        .then(response => response.json())
        .then((response) => {
          const newPosts = prismicToPostsList(response);
          const newPostList = [...posts, ...newPosts];

          setPosts(newPostList);
          setNextPage(response.next_page);
          setLoading(false);
        })
    }
  }


  return (
    <>
      <Head>
        <title>Home | spacetraveling</title>
      </Head>
      <main className={styles.container}>
        <div className={styles.posts}>
          {posts.map(post => (
            <Link href={`/post/${post.uid}`} key={post.uid}>
              <a>
                <strong>{post.data.title}</strong>
                <p>{post.data.subtitle}</p>
                <PostInfo
                  publication_date={post.first_publication_date}
                  author={post.data.author}
                />
              </a>
            </Link>
          ))}

        </div>
        {nextPage !== null && (
          <button
            type="button"
            onClick={handleLoadMorePosts}
            className={loading ? 'disabled' : ''}
          >
            {!loading ? 'Carregar mais posts' : 'Carregando...'}
          </button>
        )}
        {preview && (
          <ExitPreviewButton />
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps<HomeProps> = async ({ preview = false, previewData }) => {

  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.subtitle', 'post.author', 'post.banner', 'post.content'],
    pageSize: 2,
    ref: previewData?.ref ?? null,
  });

  // console.log(JSON.stringify(postsResponse, null, 2));

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: prismicToPostsList(postsResponse)
  }

  return {
    props: {
      postsPagination,
      preview
    }
  }
};
