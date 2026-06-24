import { useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';

function Login() {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/Dashboard'); //Takes user to their specific dashboard page after login
    };

    return (
        <form>
            <div className={styles.loginContainer}>
                <div className={styles.divTitle}>
                    <h3 className={styles.loginTitle}>Access your account</h3>
                </div>

                <div className={styles.formGroup}>
                    <input
                        id="email"
                        type="email"
                        placeholder=" "
                        className={styles.input}
                    />
                    <label htmlFor="email" className={styles.label}>
                        Enter your email address
                    </label>
                </div>

                <div className={styles.formGroup}>
                    <input
                        id="password"
                        type="password"
                        placeholder=" "
                        className={styles.input}
                    />
                    <label htmlFor="password" className={styles.label}>
                        Enter your password
                    </label>
                </div>

                {/* Button to login */}
                <button
                    className={styles.loginButton}
                    type="button"
                    onClick={handleLogin}
                >
                    Login
                </button>

                <div className={styles.linksContainer}>
                    {/* Link to home page */}
                    <Link to="/">Go back</Link>

                    {/* Link to Register form */}
                    <Link to="/Register">Don't have an account?</Link>
                </div>
            </div>
        </form>
    );
}

export default Login;
