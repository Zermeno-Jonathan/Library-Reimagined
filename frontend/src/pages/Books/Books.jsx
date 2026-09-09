import { useState, useEffect, useCallback } from 'react';
import supabase from '../../config/supabaseClient';
import FormInput from '../../components/FormInput/FormInput';
import styles from './Books.module.css';

const EMPTY_FORM = {
    title: '',
    author: '',
    year: '',
    isbn: '',
    stock: 3,
    category: '',
};

function Books() {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState('All');

    // Modal state
    const [modalOpen, setModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Delete confirm
    const [deletingId, setDeletingId] = useState(null);

    // Cover preview from Open Library
    const [coverUrl, setCoverUrl] = useState(null);

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

    useEffect(() => {
        fetchBooks('', activeCategory);
    }, [fetchBooks, activeCategory]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchBooks(search, activeCategory);
        }, 350);
        return () => clearTimeout(timer);
    }, [search, activeCategory, fetchBooks]);

    // Fetch cover from Open Library when ISBN changes
    useEffect(() => {
        if (!form.isbn || form.isbn.length < 10) {
            setCoverUrl(null);
            return;
        }
        const cleanIsbn = form.isbn.replace(/-/g, '');
        setCoverUrl(`https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg`);
    }, [form.isbn]);

    const openAdd = () => {
        setEditingBook(null);
        setForm(EMPTY_FORM);
        setFormErrors({});
        setCoverUrl(null);
        setModalOpen(true);
    };

    const openEdit = (book) => {
        setEditingBook(book);
        setForm({
            title: book.title,
            author: book.author,
            year: book.year?.split('T')[0] ?? '',
            isbn: book.isbn,
            stock: book.stock,
            category: book.category ?? '',
        });
        setFormErrors({});
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingBook(null);
        setForm(EMPTY_FORM);
        setFormErrors({});
        setCoverUrl(null);
    };

    const validate = () => {
        const errors = {};
        if (!form.title.trim()) errors.title = 'Title is required';
        if (!form.author.trim()) errors.author = 'Author is required';
        if (!form.year) errors.year = 'Year is required';
        if (!form.isbn.trim()) errors.isbn = 'ISBN is required';
        if (!form.stock || form.stock < 0)
            errors.stock = 'Stock must be 0 or more';
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
            const payload = {
                title: form.title.trim(),
                author: form.author.trim(),
                year: form.year,
                isbn: form.isbn.trim(),
                stock: parseInt(form.stock),
                category: form.category.trim() || null,
            };

            if (editingBook) {
                const { error } = await supabase
                    .from('books')
                    .update(payload)
                    .eq('id', editingBook.id);

                if (error) {
                    console.error('Error updating book:', error);
                    return;
                }
            } else {
                const { error } = await supabase.from('books').insert(payload);

                if (error) {
                    console.error('Error inserting book:', error);
                    return;
                }
            }

            closeModal();
            fetchBooks(search, activeCategory);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (deletingId !== id) {
            setDeletingId(id);
            return;
        }

        try {
            const { error } = await supabase
                .from('books')
                .delete()
                .eq('id', id);

            if (error) {
                console.error('Error deleting book:', error);
                return;
            }

            setDeletingId(null);
            fetchBooks(search, activeCategory);
        } catch (error) {
            console.error('Unexpected error:', error);
        }
    };

    const handleChange = (field) => (e) => {
        setForm((prev) => ({ ...prev, [field]: e.target.value }));
        setFormErrors((prev) => ({ ...prev, [field]: '' }));
    };

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.heading}>Books</h1>
                    <p className={styles.subheading}>
                        Manage the library collection.
                    </p>
                </div>
                <button className={styles.addButton} onClick={openAdd}>
                    + Add Book
                </button>
            </div>

            {/* Controls */}
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

            {/* Table */}
            {loading ? (
                <div className={styles.state}>
                    <p>Loading books...</p>
                </div>
            ) : books.length === 0 ? (
                <div className={styles.state}>
                    <p>No books found{search ? ` for "${search}"` : ''}.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Cover</th>
                                <th className={styles.th}>Title</th>
                                <th className={styles.th}>Author</th>
                                <th className={styles.th}>Year</th>
                                <th className={styles.th}>Category</th>
                                <th className={styles.th}>Stock</th>
                                <th className={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book) => (
                                <tr key={book.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <img
                                            src={`https://covers.openlibrary.org/b/isbn/${book.isbn.replace(/-/g, '')}-S.jpg`}
                                            alt={book.title}
                                            className={styles.coverThumb}
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </td>
                                    <td className={styles.td}>{book.title}</td>
                                    <td className={styles.td}>{book.author}</td>
                                    <td className={styles.td}>
                                        {new Date(book.year).getFullYear()}
                                    </td>
                                    <td className={styles.td}>
                                        {book.category ?? '—'}
                                    </td>
                                    <td className={styles.td}>{book.stock}</td>
                                    <td className={styles.td}>
                                        <div className={styles.actions}>
                                            <button
                                                className={styles.editBtn}
                                                onClick={() => openEdit(book)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className={`${styles.deleteBtn} ${deletingId === book.id ? styles.deleteBtnConfirm : ''}`}
                                                onClick={() =>
                                                    handleDelete(book.id)
                                                }
                                                onBlur={() =>
                                                    setDeletingId(null)
                                                }
                                            >
                                                {deletingId === book.id
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
                                {editingBook ? 'Edit Book' : 'Add Book'}
                            </h2>
                            <button
                                className={styles.closeBtn}
                                onClick={closeModal}
                                aria-label="Close modal"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Cover preview */}
                        {coverUrl && (
                            <div className={styles.coverPreview}>
                                <img
                                    src={coverUrl}
                                    alt="Book cover preview"
                                    className={styles.coverImg}
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className={styles.form}>
                            <FormInput
                                id="title"
                                label="Title"
                                type="text"
                                value={form.title}
                                onChange={handleChange('title')}
                                error={formErrors.title}
                            />
                            <FormInput
                                id="author"
                                label="Author"
                                type="text"
                                value={form.author}
                                onChange={handleChange('author')}
                                error={formErrors.author}
                            />
                            <FormInput
                                id="year"
                                label="Publication Date"
                                type="date"
                                value={form.year}
                                onChange={handleChange('year')}
                                error={formErrors.year}
                            />
                            <FormInput
                                id="isbn"
                                label="ISBN"
                                type="text"
                                value={form.isbn}
                                onChange={handleChange('isbn')}
                                error={formErrors.isbn}
                            />
                            <FormInput
                                id="stock"
                                label="Stock"
                                type="number"
                                value={form.stock}
                                onChange={handleChange('stock')}
                                error={formErrors.stock}
                            />
                            <FormInput
                                id="category"
                                label="Category (optional)"
                                type="text"
                                value={form.category}
                                onChange={handleChange('category')}
                                error={formErrors.category}
                            />

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
                                        : editingBook
                                          ? 'Save Changes'
                                          : 'Add Book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </main>
    );
}

export default Books;
