import { useNavigate } from 'react-router-dom';
// import { useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import styles from './Login.module.css';

function Login() {
    const navigate = useNavigate();

    const handleCancel = () => {
        navigate('/'); // va al home
    };

    console.log(supabase); //Temporarily commented outy, remove this console.log

    return (
        <form>
            <div className={styles.loginContainer}>
                <h3 className={styles.loginTitle}>Access your account</h3>
            </div>
            <div className={styles.loginForm}></div>

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
