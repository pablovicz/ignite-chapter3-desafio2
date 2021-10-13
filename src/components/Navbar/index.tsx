import Link from 'next/link';

import styles from './navbar.module.scss';

interface NavbarProps {
    nextPost: {
        slug: string;
        title: string;
    };
    previousPost: {
        slug: string;
        title: string;
    }
}


export function Navbar({ nextPost, previousPost }: NavbarProps) {

    function backToHome() {
        return (
            <Link href="/">
                <div>
                    <span>Home</span>
                    <a>Voltar</a>
                </div>
            </Link>
        );
    }

    return (
        <nav className={styles.navBar}>
            {previousPost !== null ? (
                <Link href={`/post/${previousPost.slug}`}>
                    <div>
                        <span>{previousPost.title}</span>
                        <a>Post Anterior</a>
                    </div>
                </Link>
            ) : (
                backToHome()
            )}
            {nextPost !== null ? (
                <Link href={`/post/${nextPost.slug}`}>
                    <div>
                        <span>{nextPost.title}</span>
                        <a>Próximo Post</a>
                    </div>
                </Link>
            ) : (
                backToHome()
            )}
        </nav>
    );
}