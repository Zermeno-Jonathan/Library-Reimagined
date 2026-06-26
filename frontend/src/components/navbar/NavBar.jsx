import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import styles from './NavBar.module.css';

function NavBar() {
    const [userRole, setUserRole] = useState(null);

    useEffect(() => {
        const role = localStorage.getItem('userRole');
        setUserRole(role);
    }, []);

    return (
        <div className={styles.navbar}>
            <ul className={styles.linksList}>
                {/* Links accesible to everyone */}
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/books">Books</Link>
                </li>
                <li>
                    <Link to="/loans">Loans</Link>
                </li>
                <li>
                    <Link to="/queries">Queries</Link>
                </li>

                {/* links only accessible if userRole is 'user' show this links */}
                {userRole === 'user' && (
                    <li>
                        <Link to="/menuUser">Menu User</Link>
                    </li>
                )}

                {/* links only accessible if userRole is 'admin' show this links */}
                {userRole === 'admin' && (
                    <>
                        <li>
                            <Link to="/menuAdmin">Menu Admin</Link>
                        </li>
                        <li>
                            <Link to="/users">Users</Link>
                        </li>
                    </>
                )}

                <li>
                    <Link to="/login">Login</Link>
                </li>
            </ul>
        </div>
    );
}

export default NavBar;
