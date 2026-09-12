import { useState, useEffect, useCallback } from 'react';
import supabase from '../../config/supabaseClient';
import styles from './Catalog.module.css';
import { useAuth } from '../../context/AuthContext';

function Catalog() {
    const { userRole } = useAuth();

    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [requestStatus, setRequestStatus] = useState({});
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');

    const fetchBooks = useCallback(async (query = '', category = 'All') => {
        setLoading(true);
        try {
            let request = supabase
                .from('books')
                .select('id, title, author, year, isbn, stock, category')
                .order('title', { ascending: true });

            if (query.trim()) {
                request = request.or(
                    `title.ilike.%${query}%,author.ilike.%${query}%`,
                );
            }

            if (category !== 'All') {
                request = request.eq('category', category);
            }

            const { data, error } = await request;

            if (error) {
                console.error('Error fetching books:', error);
                return;
            }

            const fetched = data || [];
            setBooks(fetched);

            if (category === 'All' && !query.trim()) {
                const unique = [
                    'All',
                    ...new Set(
                        fetched
                            .map((b) => b.category)
                            .filter(Boolean)
                            .sort(),
                    ),
                ];
                setCategories(unique);
            }
        } finally {
            setLoading(false);
        }
    }, []);

    const logQuery = useCallback(async (query) => {
        if (!query.trim()) return;
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) return;
            await supabase.from('queries').insert({
                user_id: user.id,
                query_text: query.trim(),
            });
        } catch (error) {
            console.error('Error logging query:', error);
        }
    }, []);

    useEffect(() => {
        fetchBooks('', activeCategory);
    }, [fetchBooks, activeCategory]);

    useEffect(() => {
        const searchTimer = setTimeout(() => {
            fetchBooks(search, activeCategory);
        }, 350);

        const logTimer = setTimeout(() => {
            if (search.trim().length >= 3) {
                logQuery(search);
            }
        }, 1500);

        return () => {
            clearTimeout(searchTimer);
            clearTimeout(logTimer);
        };
    }, [search, activeCategory, fetchBooks, logQuery]);

    const handleRequestLoan = async (book) => {
        if (book.stock <= 0) return;

        setRequestStatus((prev) => ({ ...prev, [book.id]: 'loading' }));

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setRequestStatus((prev) => ({ ...prev, [book.id]: 'error' }));
                return;
            }

            const { error } = await supabase.rpc('request_loan', {
                p_book_id: book.id,
                p_user_id: user.id,
            });

            if (error) {
                console.error('Error requesting loan:', error);
                if (error.message?.includes('limit reached')) {
                    setBooks((prev) =>
                        prev.map((b) => ({ ...b, _limitReached: true })),
                    );
                } else {
                    const msg = error.message?.includes('already have')
                        ? 'duplicate'
                        : 'error';
                    setRequestStatus((prev) => ({ ...prev, [book.id]: msg }));
                }
                return;
            }

            setBooks((prev) =>
                prev.map((b) =>
                    b.id === book.id ? { ...b, stock: b.stock - 1 } : b,
                ),
            );

            setRequestStatus((prev) => ({ ...prev, [book.id]: 'success' }));

            setTimeout(() => {
                setRequestStatus((prev) => {
                    const updated = { ...prev };
                    if (updated[book.id] === 'success') {
                        delete updated[book.id];
                    }
                    return updated;
                });
            }, 2000);
        } catch (error) {
            console.error('Unexpected error:', error);
            setRequestStatus((prev) => ({ ...prev, [book.id]: 'error' }));
        }
    };

    const getButtonLabel = (book) => {
        const status = requestStatus[book.id];
        if (status === 'loading') return 'Requesting...';
        if (status === 'success') return 'Requested!';
        if (status === 'duplicate') return 'Already borrowed';
        if (status === 'error') return 'Try again';
        if (book._limitReached) return 'Loan limit reached';
        if (book.stock <= 0) return 'Unavailable';
        return 'Request Loan';
    };

    const getCoverUrl = (isbn) => {
        const clean = isbn.replace(/-/g, '');
        return `https://covers.openlibrary.org/b/isbn/${clean}-M.jpg`;
    };

    return (
        <main className={styles.catalogContainer}>
            <div className={styles.header}>
                <h1 className={styles.heading}>Catalog</h1>
                <p className={styles.subheading}>
                    Browse our collection — search by title or author.
                </p>
            </div>

            {/* Search + Category row */}
            <div className={styles.controlsRow}>
                <input
                    className={styles.searchInput}
                    type="search"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search books"
                />
                {categories.length > 1 && (
                    <select
                        className={styles.categorySelect}
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        aria-label="Filter by category"
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                )}
            </div>

            {loading ? (
                <div className={styles.state}>
                    <p>Loading books...</p>
                </div>
            ) : books.length === 0 ? (
                <div className={styles.state}>
                    <p>No books found{search ? ` for "${search}"` : ''}.</p>
                </div>
            ) : (
                <div className={styles.grid}>
                    {books.map((book) => (
                        <div
                            key={book.id}
                            className={`${styles.card} ${book.stock <= 0 ? styles.cardBorrowed : ''}`}
                        >
                            {/* Cover */}
                            <div className={styles.coverWrapper}>
                                <img
                                    src={getCoverUrl(book.isbn)}
                                    alt={`Cover of ${book.title}`}
                                    className={styles.coverImg}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display =
                                            'flex';
                                    }}
                                />
                                <div className={styles.coverFallback}>
                                    <span className={styles.coverFallbackText}>
                                        {book.title.charAt(0)}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className={styles.cardRight}>
                                <div className={styles.cardBody}>
                                    <h2 className={styles.bookTitle}>
                                        {book.title}
                                    </h2>
                                    <p className={styles.bookAuthor}>
                                        {book.author}
                                    </p>
                                    <p className={styles.bookYear}>
                                        {new Date(book.year).getFullYear()}
                                    </p>
                                    <div className={styles.badges}>
                                        {book.category && (
                                            <span
                                                className={styles.categoryBadge}
                                            >
                                                {book.category}
                                            </span>
                                        )}
                                        <span className={styles.isbnBadge}>
                                            ISBN {book.isbn}
                                        </span>
                                    </div>
                                </div>

                                <div className={styles.cardFooter}>
                                    <span
                                        className={`${styles.statusBadge} ${
                                            book.stock > 0
                                                ? styles.available
                                                : styles.borrowed
                                        }`}
                                    >
                                        {book.stock > 0
                                            ? `${book.stock} available`
                                            : 'Unavailable'}
                                    </span>

                                    {userRole === 'user' && (
                                        <button
                                            className={`${styles.loanButton} ${
                                                book.stock <= 0 ||
                                                book._limitReached ||
                                                requestStatus[book.id] ===
                                                    'loading'
                                                    ? styles.loanButtonDisabled
                                                    : ''
                                            } ${requestStatus[book.id] === 'success' ? styles.loanButtonSuccess : ''}`}
                                            onClick={() =>
                                                handleRequestLoan(book)
                                            }
                                            disabled={
                                                book.stock <= 0 ||
                                                book._limitReached ||
                                                requestStatus[book.id] ===
                                                    'loading'
                                            }
                                        >
                                            {getButtonLabel(book)}
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Catalog;
