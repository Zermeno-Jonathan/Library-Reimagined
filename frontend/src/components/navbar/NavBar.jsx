import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from './NavBar.module.css';

function NavBar() {
    const { userRole, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    return (
        <div className={styles.navbar}>
            <ul className={styles.linksList}>
                {/* Public links */}
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/catalog">Catalog</Link>
                </li>

                {/* User links */}
                {userRole === 'user' && (
                    <li>
                        <Link to="/menuuser">Menu User</Link>
                    </li>
                )}

                {/* Admin links */}
                {userRole === 'admin' && (
                    <li>
                        <Link to="/menuadmin">Menu Admin</Link>
                    </li>
                )}

                {/* Auth links */}
                {!userRole ? (
                    <li>
                        <Link to="/login">Login</Link>
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
        </div>
    );
}

export default NavBar;
