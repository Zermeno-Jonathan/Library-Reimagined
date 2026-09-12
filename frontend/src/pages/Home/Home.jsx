import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../../config/supabaseClient';
import styles from './Home.module.css';

const FALLBACK_TITLES = [
    'The Pragmatic Programmer',
    'Clean Code',
    'Dune',
    'Eloquent JavaScript',
    'Introduction to Algorithms',
    "You Don't Know JS",
    'The Design of Everyday Things',
];

const FALLBACK_CATEGORIES = [
    'Technology',
    'Sci-Fi',
    'Design',
    'History',
    'Literature',
    'Science',
    'Philosophy',
];

function Home() {
    const navigate = useNavigate();
    const [totalBooks, setTotalBooks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [titles, setTitles] = useState(FALLBACK_TITLES);
    const [categories, setCategories] = useState(FALLBACK_CATEGORIES);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data, count } = await supabase
                    .from('books')
                    .select('title, category', { count: 'exact' });

                if (data && data.length > 0) {
                    setTotalBooks(count || 0);
                    setTitles(data.map((b) => b.title));
                    const uniqueCats = [
                        ...new Set(data.map((b) => b.category).filter(Boolean)),
                    ];
                    if (uniqueCats.length > 0) setCategories(uniqueCats);
                }
            } catch (error) {
                console.error('Error fetching home data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Duplicate items for seamless loop
    const titlesTrack = [...titles, ...titles, ...titles];
    const categoriesTrack = [...categories, ...categories, ...categories];

    const handleExplore = () => {
        navigate('/catalog');
    };

    return (
        <main className={styles.homeContainer}>
            <div className={styles.heroGrid}>
                {/* Left — bookshelf illustration */}
                <div className={styles.illustrationWrapper}>
                    <svg
                        width="100%"
                        viewBox="0 0 320 400"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                    >
                        <rect
                            x="10"
                            y="30"
                            width="8"
                            height="340"
                            rx="2"
                            fill="#d0b387"
                        />
                        <rect
                            x="302"
                            y="30"
                            width="8"
                            height="340"
                            rx="2"
                            fill="#d0b387"
                        />
                        <rect
                            x="10"
                            y="30"
                            width="300"
                            height="10"
                            rx="2"
                            fill="#d0b387"
                        />
                        <rect
                            x="10"
                            y="168"
                            width="300"
                            height="10"
                            rx="2"
                            fill="#d0b387"
                        />
                        <rect
                            x="10"
                            y="306"
                            width="300"
                            height="10"
                            rx="2"
                            fill="#d0b387"
                        />
                        <rect
                            x="10"
                            y="368"
                            width="300"
                            height="10"
                            rx="2"
                            fill="#d0b387"
                        />
                        <rect
                            x="22"
                            y="50"
                            width="22"
                            height="118"
                            rx="2"
                            fill="#e8d0ac"
                        />
                        <rect
                            x="46"
                            y="60"
                            width="18"
                            height="108"
                            rx="2"
                            fill="#c49a6c"
                        />
                        <rect
                            x="66"
                            y="52"
                            width="25"
                            height="116"
                            rx="2"
                            fill="#a0522d"
                        />
                        <rect
                            x="93"
                            y="44"
                            width="20"
                            height="124"
                            rx="2"
                            fill="#d4a76a"
                        />
                        <rect
                            x="115"
                            y="58"
                            width="15"
                            height="110"
                            rx="2"
                            fill="#8b6914"
                        />
                        <rect
                            x="132"
                            y="48"
                            width="28"
                            height="120"
                            rx="2"
                            fill="#c8a882"
                        />
                        <rect
                            x="162"
                            y="62"
                            width="18"
                            height="106"
                            rx="2"
                            fill="#7b4f2e"
                        />
                        <rect
                            x="182"
                            y="46"
                            width="22"
                            height="122"
                            rx="2"
                            fill="#d4956a"
                        />
                        <rect
                            x="206"
                            y="55"
                            width="16"
                            height="113"
                            rx="2"
                            fill="#b8860b"
                        />
                        <rect
                            x="224"
                            y="50"
                            width="24"
                            height="118"
                            rx="2"
                            fill="#c8956c"
                        />
                        <rect
                            x="250"
                            y="60"
                            width="20"
                            height="108"
                            rx="2"
                            fill="#8b4513"
                        />
                        <rect
                            x="272"
                            y="48"
                            width="18"
                            height="120"
                            rx="2"
                            fill="#e0c090"
                        />
                        <line
                            x1="55"
                            y1="68"
                            x2="55"
                            y2="158"
                            stroke="#a08050"
                            strokeWidth="0.8"
                        />
                        <line
                            x1="143"
                            y1="56"
                            x2="143"
                            y2="158"
                            stroke="#b07040"
                            strokeWidth="0.8"
                        />
                        <line
                            x1="193"
                            y1="54"
                            x2="193"
                            y2="158"
                            stroke="#c09060"
                            strokeWidth="0.8"
                        />
                        <rect
                            x="22"
                            y="185"
                            width="30"
                            height="121"
                            rx="2"
                            fill="#b8860b"
                        />
                        <rect
                            x="54"
                            y="195"
                            width="20"
                            height="111"
                            rx="2"
                            fill="#e8d0ac"
                        />
                        <rect
                            x="76"
                            y="188"
                            width="18"
                            height="118"
                            rx="2"
                            fill="#c49a6c"
                        />
                        <rect
                            x="96"
                            y="192"
                            width="26"
                            height="114"
                            rx="2"
                            fill="#8b4513"
                        />
                        <rect
                            x="124"
                            y="182"
                            width="22"
                            height="124"
                            rx="2"
                            fill="#d4a76a"
                        />
                        <rect
                            x="148"
                            y="190"
                            width="15"
                            height="116"
                            rx="2"
                            fill="#7b4f2e"
                        />
                        <rect
                            x="165"
                            y="184"
                            width="28"
                            height="122"
                            rx="2"
                            fill="#c8a882"
                        />
                        <rect
                            x="195"
                            y="196"
                            width="18"
                            height="110"
                            rx="2"
                            fill="#a0522d"
                        />
                        <rect
                            x="215"
                            y="186"
                            width="24"
                            height="120"
                            rx="2"
                            fill="#d4956a"
                        />
                        <rect
                            x="241"
                            y="190"
                            width="20"
                            height="116"
                            rx="2"
                            fill="#c8956c"
                        />
                        <rect
                            x="263"
                            y="184"
                            width="22"
                            height="122"
                            rx="2"
                            fill="#8b6914"
                        />
                        <rect
                            x="287"
                            y="192"
                            width="13"
                            height="114"
                            rx="2"
                            fill="#e0c090"
                        />
                        <rect
                            x="22"
                            y="320"
                            width="26"
                            height="48"
                            rx="2"
                            fill="#c49a6c"
                        />
                        <rect
                            x="50"
                            y="324"
                            width="20"
                            height="44"
                            rx="2"
                            fill="#8b4513"
                        />
                        <rect
                            x="72"
                            y="318"
                            width="24"
                            height="50"
                            rx="2"
                            fill="#d4a76a"
                        />
                        <rect
                            x="98"
                            y="322"
                            width="18"
                            height="46"
                            rx="2"
                            fill="#e8d0ac"
                        />
                        <rect
                            x="118"
                            y="320"
                            width="22"
                            height="48"
                            rx="2"
                            fill="#b8860b"
                        />
                        <rect
                            x="142"
                            y="316"
                            width="16"
                            height="52"
                            rx="2"
                            fill="#c8a882"
                        />
                        <rect
                            x="160"
                            y="322"
                            width="20"
                            height="46"
                            rx="2"
                            fill="#7b4f2e"
                        />
                        <rect
                            x="182"
                            y="318"
                            width="28"
                            height="50"
                            rx="2"
                            fill="#d4956a"
                        />
                        <rect
                            x="212"
                            y="324"
                            width="18"
                            height="44"
                            rx="2"
                            fill="#a0522d"
                        />
                        <rect
                            x="232"
                            y="320"
                            width="22"
                            height="48"
                            rx="2"
                            fill="#c8956c"
                        />
                        <rect
                            x="256"
                            y="316"
                            width="20"
                            height="52"
                            rx="2"
                            fill="#8b6914"
                        />
                        <rect
                            x="278"
                            y="322"
                            width="22"
                            height="46"
                            rx="2"
                            fill="#e0c090"
                        />
                    </svg>
                </div>

                {/* Right — content */}
                <div className={styles.contentWrapper}>
                    <div className={styles.welcomeSection}>
                        <h1 className={styles.heading}>Welcome</h1>
                        <div className={styles.divider} />
                        <p className={styles.paragraph}>
                            Search, borrow, and track books from your university
                            collection. Everything in one place.
                        </p>
                    </div>

                    <div className={styles.statCard}>
                        {/* Titles carousel — left to right */}
                        <div className={styles.carouselWrapper}>
                            <div className={styles.carouselTrackForward}>
                                {titlesTrack.map((title, i) => (
                                    <span
                                        key={i}
                                        className={styles.carouselItem}
                                    >
                                        {title}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Stat content */}
                        <div className={styles.statContent}>
                            <h2 className={styles.statNumber}>
                                {loading ? '—' : totalBooks}
                            </h2>
                            <p className={styles.statLabel}>Books available</p>
                            <p className={styles.statSub}>
                                Find your next read
                            </p>
                        </div>

                        {/* Categories carousel — right to left */}
                        <div className={styles.carouselWrapper}>
                            <div className={styles.carouselTrackReverse}>
                                {categoriesTrack.map((cat, i) => (
                                    <span
                                        key={i}
                                        className={`${styles.carouselItem} ${styles.carouselItemCat}`}
                                    >
                                        {cat}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button
                        className={styles.exploreButton}
                        onClick={handleExplore}
                    >
                        Explore Catalog
                    </button>
                </div>
            </div>
        </main>
    );
}

export default Home;
