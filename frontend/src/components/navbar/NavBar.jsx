import styles from './NavBar.module.css';
import { Link } from 'react-router-dom';

function NavBar() {
    return (
        <div className={styles.navbar}>
            <ul className={styles.linksList}>
                <li>
                    <Link to="/">Home</Link>
                </li>
                <li>
                    <Link to="/Books">Books</Link>
                </li>
                <li>
                    <Link to="/Loans">Loans</Link>
                </li>
                <li>
                    <Link to="/MenuAdmin">Menu Admin</Link>
                </li>
                <li>
                    <Link to="/MenuUser">Menu User</Link>
                </li>
                <li>
                    <Link to="/Queries">Queries</Link>
                </li>
                <li>
                    <a className={styles.logButton} href="/Login">
                        Login
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default NavBar;
