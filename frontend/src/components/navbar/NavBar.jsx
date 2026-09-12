import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './NavBar.module.css';

function NavBar() {
    const { userRole, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setIsMenuOpen(false);
        navigate('/');
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className={styles.navbar}>
            <button
                className={styles.menuButton}
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label="Toggle navigation menu"
                aria-expanded={isMenuOpen}
            >
                ☰
            </button>

            <ul
                className={`${styles.linksList} ${
                    isMenuOpen ? styles.linksListOpen : ''
                }`}
            >
                <li>
                    <Link to="/" onClick={closeMenu}>
                        Home
                    </Link>
                </li>

                <li>
                    <Link to="/catalog" onClick={closeMenu}>
                        Catalog
                    </Link>
                </li>

                {userRole === 'user' && (
                    <li>
                        <Link to="/menuuser" onClick={closeMenu}>
                            Menu User
                        </Link>
                    </li>
                )}

                {userRole === 'admin' && (
                    <li>
                        <Link to="/menuadmin" onClick={closeMenu}>
                            Menu Admin
                        </Link>
                    </li>
                )}

                {!userRole ? (
                    <li>
                        <Link to="/login" onClick={closeMenu}>
                            Login
                        </Link>
                    </li>
                ) : (
                    <li>
                        <button
                            className={styles.logoutBtn}
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default NavBar;
