import { Outlet } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import styles from './AuthLayout.module.css';

function AuthLayout() {
    const { loading } = useAuth();

    if (loading) return null;

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <Outlet />
            </div>
        </div>
    );
}

export default AuthLayout;
