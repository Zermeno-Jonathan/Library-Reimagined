import { useNavigate } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
    // console.log(supabase);

    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/'); // va al home
    };

    return (
        <form>
            <div className={styles.loginContainer}>
                <h3 className={styles.loginTitle}>Access your account</h3>
            </div>

            {/* Cancel button to go back to the home pag */}
            <button
                className={styles.cancellBtn}
                type="button"
                onClick={handleCancel}
            >
                Cancel
            </button>
        </form>
    );
}

export default Login;
