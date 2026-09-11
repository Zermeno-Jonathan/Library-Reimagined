import { useState, useEffect, useCallback } from 'react';
import supabase from '../../config/supabaseClient';
import FormInput from '../../components/FormInput/FormInput';
import styles from './Users.module.css';

const EMPTY_FORM = {
    email: '',
    password: '',
    rol: 'user',
};

function Users() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Modal
    const [modalOpen, setModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // Delete confirm
    const [deletingId, setDeletingId] = useState(null);

    const fetchUsers = useCallback(async (query = '') => {
        setLoading(true);
        try {
            let request = supabase
                .from('users')
                .select('id, email, name, rol, created_at, auth_id')
                .order('created_at', { ascending: false });

            if (query.trim()) {
                request = request.ilike('email', `%${query}%`);
            }

            const { data, error } = await request;

            if (error) {
                console.error('Error fetching users:', error);
                return;
            }

            setUsers(data || []);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchUsers(search);
        }, 350);
        return () => clearTimeout(timer);
    }, [search, fetchUsers]);

    // Add button - open modal (maybe later)
    // const openAdd = () => {
    //     setEditingUser(null);
    //     setForm(EMPTY_FORM);
    //     setFormErrors({});
    //     setModalOpen(true);
    // };

    const openEdit = (user) => {
        setEditingUser(user);
        setForm({ email: user.email, password: '', rol: user.rol });
        setFormErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingUser(null);
        setForm(EMPTY_FORM);
        setFormErrors({});
    };

    const validate = () => {
        const errors = {};
        if (!editingUser && !form.email.trim())
            errors.email = 'Email is required';
        if (!editingUser && !form.password.trim())
            errors.password = 'Password is required';
        if (!editingUser && form.password.length < 6)
            errors.password = 'Password must be at least 6 characters';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validate();
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        setSubmitting(true);
        try {
            if (editingUser) {
                // Solo actualiza rol en public.users
                const { error } = await supabase
                    .from('users')
                    .update({ rol: form.rol })
                    .eq('id', editingUser.id);

                if (error) {
                    console.error('Error updating user:', error);
                    return;
                }
            } else {
                // Crea usuario via Edge Function
                const {
                    data: { session },
                } = await supabase.auth.getSession();

                const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-user`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${session.access_token}`,
                        },
                        body: JSON.stringify({
                            email: form.email.trim(),
                            password: form.password,
                            rol: form.rol,
                        }),
                    },
                );

                const result = await response.json();

                if (!response.ok) {
                    console.error('Error creating user:', result.error);
                    setFormErrors({ email: result.error });
                    return;
                }
            }

            closeModal();
            await fetchUsers(search);
            fetchUsers(search);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (user) => {
        if (deletingId !== user.id) {
            setDeletingId(user.id);
            return;
        }

        setDeleting(true);
        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const response = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/delete-user`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${session.access_token}`,
                    },
                    body: JSON.stringify({ targetUserId: user.auth_id }),
                },
            );

            const result = await response.json();

            if (!response.ok) {
                console.error('Error deleting user:', result.error);
                setDeletingId(null);
                return;
            }

            setDeletingId(null);
            await fetchUsers(search);
        } catch (error) {
            console.error('Unexpected error:', error);
            setDeletingId(null);
        } finally {
            setDeleting(false);
        }
    };

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setFormErrors((prev) => ({ ...prev, [field]: '' }));
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
                    <h1 className={styles.heading}>Users</h1>
                    <p className={styles.subheading}>Manage system users.</p>
                </div>
                {/* Add button - open modal (maybe later) */}
                {/* <button className={styles.addButton} onClick={openAdd}>
                    + Add User
                </button> */}
            </div>

            {/* Search */}
            <div className={styles.controlsRow}>
                <input
                    className={styles.searchInput}
                    type="search"
                    placeholder="Search by email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    aria-label="Search users"
                />
            </div>

            {/* Table */}
            {loading ? (
                <div className={styles.state}>
                    <p>Loading users...</p>
                </div>
            ) : users.length === 0 ? (
                <div className={styles.state}>
                    <p>No users found{search ? ` for "${search}"` : ''}.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Email</th>
                                <th className={styles.th}>Role</th>
                                <th className={styles.th}>Registered</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        {user.name ?? '—'}
                                    </td>
                                    <td className={styles.td}>{user.email}</td>
                                    <td className={styles.td}>
                                        <span
                                            className={`${styles.roleBadge} ${user.rol === 'admin' ? styles.admin : styles.user}`}
                                        >
                                            {user.rol}
                                        </span>
                                    </td>
                                    <td className={styles.td}>
                                        {formatDate(user.created_at)}
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => openEdit(user)}
                                            >
                                                Edit Role
                                            </button>
                                            <button
                                                className={`${styles.deleteBtn} ${deletingId === user.id ? styles.deleteBtnConfirm : ''}`}
                                                onClick={() =>
                                                    handleDelete(user)
                                                }
                                                disabled={
                                                    deleting &&
                                                    deletingId === user.id
                                                }
                                            >
                                                {deletingId === user.id
                                                    ? 'Confirm?'
                                                    : 'Delete'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal */}
            {modalOpen && (
                <div className={styles.overlay} onClick={closeModal}>
                    <div
                        className={styles.modal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {editingUser ? 'Edit User Role' : 'Add User'}
                            </h2>
                            <button
                                className={styles.closeBtn}
                                onClick={closeModal}
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className={styles.form}>
                            {!editingUser && (
                                <>
                                    <FormInput
                                        id="email"
                                        label="Email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange('email')}
                                        error={formErrors.email}
                                    />
                                    <FormInput
                                        id="password"
                                        label="Password"
                                        type="password"
                                        value={form.password}
                                        onChange={handleChange('password')}
                                        error={formErrors.password}
                                    />
                                </>
                            )}

                            {/* Role select */}
                            <div className={styles.fieldGroup}>
                                <label
                                    className={styles.fieldLabel}
                                    htmlFor="rol"
                                >
                                    Role
                                </label>
                                <select
                                    id="rol"
                                    className={styles.roleSelect}
                                    value={form.rol}
                                    onChange={handleChange('rol')}
                                >
                                    <option value="user">user</option>
                                    <option value="admin">admin</option>
                                </select>
                            </div>

                            <div className={styles.modalFooter}>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={closeModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className={styles.submitBtn}
                                    disabled={submitting}
                                >
                                    {submitting
                                        ? 'Saving...'
                                        : editingUser
                                          ? 'Save Role'
                                          : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Users;
