import styles from './Header.module.css';
import { Link } from 'react-router-dom';

function Header() {
    return (
        <div className={styles.header}>
            <Link to="/">
                <img
                    className={styles.logo}
                    src="/books_icon.png"
                    alt="library icon"
                    height={40}
                    width={40}
                />
            </Link>
            <h2 className={styles.title}>Library Reimagined</h2>
        </div>
    );
}

export default Header;
