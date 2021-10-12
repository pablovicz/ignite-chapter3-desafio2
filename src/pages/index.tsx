import { GetStaticProps } from 'next';
import Head from 'next/head';
import Link from 'next/link';
import Prismic from '@prismicio/client';
import { useEffect, useState } from 'react';

import { getPrismicClient, prismicToPostsList } from '../services/prismic';

import styles from './home.module.scss';
import { PostInfo } from '../components/PostInfo';


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
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {

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
      </main>

    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {

  const prismic = getPrismicClient();

  const postsResponse = await prismic.query([
    Prismic.Predicates.at('document.type', 'post')
  ], {
    fetch: ['post.title', 'post.subtitle', 'post.author', 'post.banner', 'post.content'],
    pageSize: 1
  });

  // console.log(JSON.stringify(postsResponse, null, 2));

  const postsPagination = {
    next_page: postsResponse.next_page,
    results: prismicToPostsList(postsResponse)
  }

  return {
    props: {
      postsPagination
    }
  }
};
