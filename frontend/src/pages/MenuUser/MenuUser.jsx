import { Link } from 'react-router-dom';
import styles from './MenuUser.module.css';

function MenuUser() {
    return (
        <main className={styles.pageWrapper}>
            <div className={styles.menuUserContainer}>
                <h3 className={styles.pageTitle}>User Menu</h3>
                <div className={styles.menuUserLinks}>
                    <div>
                        <h4>
                            <Link to="/myloans" className={styles.menuUserLink}>
                                My Loans
                            </Link>
                        </h4>
                        <p className={styles.linkDescriptions}>
                            - View your active and returned loans
                        </p>
                    </div>
                    <div>
                        <h4>
                            <Link to="/profile" className={styles.menuUserLink}>
                                My Profile
                            </Link>
                        </h4>
                        <p className={styles.linkDescriptions}>
                            - Edit your name and password
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default MenuUser;
