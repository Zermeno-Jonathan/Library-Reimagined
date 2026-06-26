import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
    return (
        <div className={styles.notFound}>
            <h1 className={styles.notFoundTitle}>Error 404</h1>
            <div className={styles.notFoundContent}>
                <p>OOOPS</p>
                <p>Page Not Found :/</p>
            </div>
            <Link to="/">Go back</Link>
        </div>
    );
}

export default NotFound;
