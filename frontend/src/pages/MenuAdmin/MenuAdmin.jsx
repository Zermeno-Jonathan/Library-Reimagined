import { Link } from 'react-router-dom';
import styles from './MenuAdmin.module.css';

function MenuAdmin() {
    return (
        <main className={styles.pageWraper}>
            <div className={styles.menuAdminContainer}>
                <h3 className={styles.pageTitle}>Administration Menu</h3>
                <div className={styles.menuAdminLinks}>
                    <div>
                        <h4>
                            <Link
                                to="/adminloans"
                                className={styles.menuAdminLink}
                            >
                                Admin Loans
                            </Link>
                        </h4>
                        <p className={styles.linkDescriptions}>
                            - Administrate loans
                        </p>
                    </div>

                    <div>
                        <h4>
                            <Link to="/books" className={styles.menuAdminLink}>
                                Books
                            </Link>
                        </h4>
                        <p className={styles.linkDescriptions}>
                            - Administrate books
                        </p>
                    </div>

                    <div>
                        <h4>
                            <Link to="/users" className={styles.menuAdminLink}>
                                Users
                            </Link>
                        </h4>
                        <p className={styles.linkDescriptions}>
                            - Administrate users
                        </p>
                    </div>

                    <div>
                        <h4>
                            <Link
                                to="/queries"
                                className={styles.menuAdminLink}
                            >
                                Queries
                            </Link>
                        </h4>
                        <p className={styles.linkDescriptions}>
                            - Monitor the queries
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default MenuAdmin;
