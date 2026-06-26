import { Outlet } from 'react-router-dom';
import styles from './AuthLayout.module.css';

function AuthLayout() {
    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <Outlet /> {/* aquí va Login & Register */}
            </div>
        </div>
    );
}

export default AuthLayout;
