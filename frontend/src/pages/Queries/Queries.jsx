import { useState, useEffect, useCallback } from 'react';
import supabase from '../../config/supabaseClient';
import styles from './Queries.module.css';

function Queries() {
    const [queries, setQueries] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchQueries = useCallback(async (query = '') => {
        setLoading(true);
        try {
            let request = supabase
                .from('queries')
                .select(
                    `
                    id,
                    query_text,
                    created_at,
                    users!queries_user_id_fkey (
                        email
                    )
                `,
                )
                .order('created_at', { ascending: false });

            const { data, error } = await request;

            if (error) {
                console.error('Error fetching queries:', error);
                return;
            }

            let filtered = data || [];

            if (query.trim()) {
                const q = query.toLowerCase();
                filtered = filtered.filter(
                    (item) =>
                        item.query_text?.toLowerCase().includes(q) ||
                        item.users?.email?.toLowerCase().includes(q),
                );
            }

            setQueries(filtered);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchQueries();
    }, [fetchQueries]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchQueries(search);
        }, 350);
        return () => clearTimeout(timer);
    }, [search, fetchQueries]);

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('es-MX', {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>Queries</h1>
                    <p className={styles.subheading}>
                        Monitor user search activity.
                    </p>
                </div>
            </div>

            {/* Search */}
            <div className={styles.controlsRow}>
                <input
                    className={styles.searchInput}
                    type="search"
                    placeholder="Search by user email or query text..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search queries"
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.state}>
                    <p>Loading queries...</p>
                </div>
            ) : queries.length === 0 ? (
                <div className={styles.state}>
                    <p>No queries found{search ? ` for "${search}"` : ''}.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>User</th>
                                <th className={styles.th}>Search Term</th>
                                <th className={styles.th}>Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            {queries.map((item) => (
                                <tr key={item.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        {item.users?.email ?? '—'}
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.queryText}>
                                            {item.query_text}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        {formatDate(item.created_at)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </main>
    );
}

export default Queries;
