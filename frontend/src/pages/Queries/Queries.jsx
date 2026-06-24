import supabase from '../../config/supabaseClient';
import { useEffect, useState } from 'react';
import styles from './Queries.module.css';

function Queries() {
    // Fetching Data
    const [fetchError, setFetchError] = useState(null);
    const [books, setBooks] = useState(null);

    useEffect(() => {
        const fetchBooks = async () => {
            const { data, error } = await supabase.from('books').select();

            if (error) {
                setFetchError('Could not fetch the books data');
                setBooks(null);
                console.log(error);
            }
            if (data) {
                setBooks(data);
                setFetchError(null);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="b">
            <p className={styles.b}>Queries</p>

            {/* Book queries output */}
            {fetchError && <p>{fetchError}</p>}
            {books && (
                <div className={styles.books}>
                    {books.map((book) => (
                        <p>{book.title}</p>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Queries;
