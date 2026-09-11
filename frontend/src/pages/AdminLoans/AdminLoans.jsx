import { useState, useEffect, useCallback } from 'react';
import supabase from '../../config/supabaseClient';
import styles from './AdminLoans.module.css';

const STATUS_OPTIONS = ['All', 'Active', 'Returned'];

function AdminLoans() {
    const [loans, setLoans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [returnStatus, setReturnStatus] = useState({});

    const fetchLoans = useCallback(async (query = '', status = 'All') => {
        setLoading(true);
        try {
            let request = supabase
                .from('loans')
                .select(
                    `
                    id,
                    loan_date,
                    return_date,
                    status,
                    user_id,
                    books (
                        title,
                        author
                    ),
                    users!loans_user_id_fkey (
                        email
                    )
                `,
                )
                .order('loan_date', { ascending: false });

            if (status !== 'All') {
                request = request.eq('status', status.toLowerCase());
            }

            const { data, error } = await request;

            if (error) {
                console.error('Error fetching loans:', error);
                return;
            }

            let filtered = data || [];

            // Filter by search query (email or book title)
            if (query.trim()) {
                const q = query.toLowerCase();
                filtered = filtered.filter(
                    (loan) =>
                        loan.users?.email?.toLowerCase().includes(q) ||
                        loan.books?.title?.toLowerCase().includes(q),
                );
            }

            setLoans(filtered);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLoans('', statusFilter);
    }, [fetchLoans, statusFilter]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchLoans(search, statusFilter);
        }, 350);
        return () => clearTimeout(timer);
    }, [search, statusFilter, fetchLoans]);

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

            // Admin uses the loan's user_id to return on their behalf
            const { error } = await supabase.rpc('admin_return_loan', {
                p_loan_id: loan.id,
            });

            if (error) {
                console.error('Error returning loan:', error);
                setReturnStatus((prev) => ({ ...prev, [loan.id]: 'error' }));
                return;
            }

            setReturnStatus((prev) => ({ ...prev, [loan.id]: 'success' }));

            setTimeout(() => {
                fetchLoans(search, statusFilter);
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
        return 'Mark Returned';
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
                <div>
                    <h1 className={styles.heading}>Admin Loans</h1>
                    <p className={styles.subheading}>
                        Manage all library loans.
                    </p>
                </div>
            </div>

            {/* Controls */}
            <div className={styles.controlsRow}>
                <input
                    className={styles.searchInput}
                    type="search"
                    placeholder="Search by user email or book title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search loans"
                />
                <select
                    className={styles.statusSelect}
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    aria-label="Filter by status"
                >
                    {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                            {s}
                        </option>
                    ))}
                </select>
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.state}>
                    <p>Loading loans...</p>
                </div>
            ) : loans.length === 0 ? (
                <div className={styles.state}>
                    <p>No loans found{search ? ` for "${search}"` : ''}.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>User</th>
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
                                        {loan.users?.email ?? '—'}
                                    </td>
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
                                            className={`${styles.badge} ${
                                                loan.status === 'active'
                                                    ? styles.active
                                                    : styles.returned
                                            }`}
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

export default AdminLoans;
