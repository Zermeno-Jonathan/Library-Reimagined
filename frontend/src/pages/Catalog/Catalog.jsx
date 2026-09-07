import { useState, useEffect, useCallback } from 'react';
import supabase from '../../config/supabaseClient';
import styles from './Catalog.module.css';

function Catalog() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [userRole, setUserRole] = useState(null);
    const [requestStatus, setRequestStatus] = useState({});

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
    }, []);

    const fetchBooks = useCallback(async (query = '') => {
        setLoading(true);
        try {
            let request = supabase
                .from('books')
                .select('id, title, author, year, isbn, stock')
                .order('title', { ascending: true });

            if (query.trim()) {
                request = request.or(
                    `title.ilike.%${query}%,author.ilike.%${query}%`,
                );
            }

            const { data, error } = await request;

            if (error) {
                console.error('Error fetching books:', error);
                return;
            }

            setBooks(data || []);
        } finally {
            setLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchBooks();
    }, [fetchBooks]);

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBooks(search);
        }, 350);

        return () => clearTimeout(timer);
    }, [search, fetchBooks]);

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
                const msg = error.message?.includes('limit reached')
                    ? 'limit'
                    : error.message?.includes('already have')
                      ? 'duplicate'
                      : 'error';
                setRequestStatus((prev) => ({ ...prev, [book.id]: msg }));
                return;
            }

            // Decrementa stock localmente
            setBooks((prev) =>
                prev.map((b) =>
                    b.id === book.id ? { ...b, stock: b.stock - 1 } : b,
                ),
            );

            setRequestStatus((prev) => ({ ...prev, [book.id]: 'success' }));

            setTimeout(() => {
                setRequestStatus((prev) => {
                    const updated = { ...prev };
                    delete updated[book.id];
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
        if (status === 'limit') return 'Loan limit reached';
        if (status === 'duplicate') return 'Already borrowed';
        if (status === 'error') return 'Try again';
        if (book.stock <= 0) return 'Unavailable';
        return 'Request Loan';
    };

    return (
        <main className={styles.catalogContainer}>
            <div className={styles.header}>
                <h1 className={styles.heading}>Catalog</h1>
                <p className={styles.subheading}>
                    Browse our collection — search by title or author.
                </p>
            </div>

            <div className={styles.searchWrapper}>
                <input
                    className={styles.searchInput}
                    type="search"
                    placeholder="Search by title or author..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search books"
                />
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
                                <span className={styles.isbnBadge}>
                                    ISBN {book.isbn}
                                </span>
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
                                            requestStatus[book.id] === 'loading'
                                                ? styles.loanButtonDisabled
                                                : ''
                                        } ${requestStatus[book.id] === 'success' ? styles.loanButtonSuccess : ''}`}
                                        onClick={() => handleRequestLoan(book)}
                                        disabled={
                                            book.stock <= 0 ||
                                            requestStatus[book.id] === 'loading'
                                        }
                                    >
                                        {getButtonLabel(book)}
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Catalog;
