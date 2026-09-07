import { useState, useEffect, useCallback } from 'react';
import supabase from '../../config/supabaseClient';
import styles from './MyLoans.module.css';

const FILTERS = ['All', 'Active', 'Returned'];

function MyLoans() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [returnStatus, setReturnStatus] = useState({});

    const fetchLoans = useCallback(async () => {
        setLoading(true);
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            let query = supabase
                .from('loans')
                .select(
                    `
                    id,
                    loan_date,
                    return_date,
                    status,
                    books (
                        title,
                        author
                    )
                `,
                )
                .eq('user_id', user.id)
                .order('loan_date', { ascending: false });

            if (filter === 'Active') query = query.eq('status', 'active');
            if (filter === 'Returned') query = query.eq('status', 'returned');

            const { data, error } = await query;

            if (error) {
                console.error('Error fetching loans:', error);
                return;
            }

            setLoans(data || []);
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchLoans();
    }, [fetchLoans]);

    const handleReturn = async (loan) => {
        setReturnStatus((prev) => ({ ...prev, [loan.id]: 'loading' }));

        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) {
                setReturnStatus((prev) => ({ ...prev, [loan.id]: 'error' }));
                return;
            }

            const { error } = await supabase.rpc('return_loan', {
                p_loan_id: loan.id,
                p_user_id: user.id,
            });

            if (error) {
                console.error('Error returning loan:', error);
                setReturnStatus((prev) => ({ ...prev, [loan.id]: 'error' }));
                return;
            }

            setReturnStatus((prev) => ({ ...prev, [loan.id]: 'success' }));

            // Refresca la tabla después de devolver
            setTimeout(() => {
                fetchLoans();
                setReturnStatus((prev) => {
                    const updated = { ...prev };
                    delete updated[loan.id];
                    return updated;
                });
            }, 1000);
        } catch (error) {
            console.error('Unexpected error:', error);
            setReturnStatus((prev) => ({ ...prev, [loan.id]: 'error' }));
        }
    };

    const getReturnLabel = (loanId) => {
        const status = returnStatus[loanId];
        if (status === 'loading') return 'Returning...';
        if (status === 'success') return 'Returned!';
        if (status === 'error') return 'Try again';
        return 'Return';
    };

    const formatDate = (dateStr) =>
        new Date(dateStr).toLocaleDateString('es-MX', {
            timeZone: 'America/Mexico_City',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.heading}>My Loans</h1>
                <p className={styles.subheading}>
                    Track your active and returned books.
                </p>
            </div>

            {/* Filter */}
            <div className={styles.filterRow}>
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.state}>
                    <p>Loading loans...</p>
                </div>
            ) : loans.length === 0 ? (
                <div className={styles.state}>
                    <p>
                        No {filter !== 'All' ? filter.toLowerCase() : ''} loans
                        found.
                    </p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Book</th>
                                <th className={styles.th}>Author</th>
                                <th className={styles.th}>Loan Date</th>
                                <th className={styles.th}>Return Date</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loans.map((loan) => (
                                <tr key={loan.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        {loan.books?.title ?? '—'}
                                    </td>
                                    <td className={styles.td}>
                                        {loan.books?.author ?? '—'}
                                    </td>
                                    <td className={styles.td}>
                                        {formatDate(loan.loan_date)}
                                    </td>
                                    <td className={styles.td}>
                                        {formatDate(loan.return_date)}
                                    </td>
                                    <td className={styles.td}>
                                        <span
                                            className={`${styles.badge} ${loan.status === 'active' ? styles.active : styles.returned}`}
                                        >
                                            {loan.status === 'active'
                                                ? 'Active'
                                                : 'Returned'}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        {loan.status === 'active' && (
                                            <button
                                                className={`${styles.returnBtn} ${
                                                    returnStatus[loan.id] ===
                                                    'loading'
                                                        ? styles.returnBtnDisabled
                                                        : ''
                                                } ${
                                                    returnStatus[loan.id] ===
                                                    'success'
                                                        ? styles.returnBtnSuccess
                                                        : ''
                                                }`}
                                                onClick={() =>
                                                    handleReturn(loan)
                                                }
                                                disabled={
                                                    returnStatus[loan.id] ===
                                                    'loading'
                                                }
                                            >
                                                {getReturnLabel(loan.id)}
                                            </button>
                                        )}
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

export default MyLoans;
