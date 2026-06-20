import styles from './NavBar.module.css';

function NavBar() {
    return (
        <div className={styles.navbar}>
            <ul className={styles.linksList}>
                <li>
                    <a href="/">Home</a>
                </li>
                <li>
                    <a href="/Books">Books</a>
                </li>
                <li>
                    <a href="/Loans">Loans</a>
                </li>
                <li>
                    <a href="/MenuAdmin">Menu Admin</a>
                </li>
                <li>
                    <a href="/MenuUser">Menu User</a>
                </li>
                <li>
                    <a href="/Queries">Queries</a>
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
