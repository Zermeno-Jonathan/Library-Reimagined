import styles from './Header.module.css';

function Header() {
    return (
        <div className={styles.header}>
            <a href="/">
                <img
                    className={styles.logo}
                    src="/books_icon.png"
                    alt="library icon"
                    height={40}
                    width={40}
                />
            </a>
            <h2 className={styles.title}>Library Reimagined</h2>
        </div>
    );
}

export default Header;
