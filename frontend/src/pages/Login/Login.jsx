import styles from './Login.module.css';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/'); // va al home
    };

    return (
        <form>
            <div className={styles.loginContainer}>
                <h3 className={styles.loginTitle}>Access your account</h3>
            </div>

            <button
                className={styles.cancellBtn}
                type="button"
                onClick={handleCancel}
            >
                Cancell
            </button>
        </form>
    );
}

export default Login;
