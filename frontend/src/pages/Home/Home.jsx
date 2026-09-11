import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
import styles from './Home.module.css';

function Home() {
    const navigate = useNavigate();
    const [totalBooks, setTotalBooks] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooksCount = async () => {
            try {
                const { count } = await supabase
                    .from('books')
                    .select('*', { count: 'exact', head: true });
                setTotalBooks(count || 0);
            } catch (error) {
                console.error('Error fetching books count:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooksCount();
    }, []);

    const handleExplore = () => {
        navigate('/catalog');
    };

    return (
        <main className={styles.homeContainer}>
            {/* Welcome Section */}
            <section className={styles.welcomeSection}>
                <h1 className={styles.heading}>
                    Welcome, what reading are you looking for today?
                </h1>
                <p className={styles.paragraph}>
                    In this platform you can easily manage, search, and borrow
                    books. Explore our collection, track your loans, and
                    discover new titles.
                </p>
            </section>

            {/* Stats Section */}
            <section className={styles.statsSection}>
                <div className={styles.statCard}>
                    <h2 className={styles.statNumber}>
                        {loading ? '—' : totalBooks}
                    </h2>
                    <p className={styles.statLabel}>Books Available.</p>
                    <p className={styles.statLabel}>Find your next read.</p>
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <button
                    className={styles.exploreButton}
                    onClick={handleExplore}
                >
                    Explore Catalog
                </button>
            </section>
        </main>
    );
}

export default Home;
