// import { useNavigate, Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import styles from './Login.module.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Email is required');
            return;
        }

        if (!email.includes('@')) {
            setEmailError('Email address must be valid');
            return;
        }

        if (!password) {
            setPasswordError('Password is required');
            return;
        }

        console.log('Form válido:', { email, password });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.loginContainer}>
                <div className={styles.divTitle}>
                    <h3 className={styles.loginTitle}>Access your account</h3>
                </div>

                <form onSubmit={handleSubmit}>
                    <FormInput
                        id="email"
                        label="Enter your email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setEmailError(''); // <= limpia el error cuando escribe
                        }}
                        error={emailError}
                    />

                    <FormInput
                        id="password"
                        label="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setPasswordError(''); // <= limpia el error cuando escribe
                        }}
                        error={passwordError}
                    />
                </form>

                {/* Button to login */}
                <button className={styles.loginButton} type="submit">
                    Login
                </button>

                <div className={styles.linksContainer}>
                    {/* Link to home page */}
                    <Link to="/">Go back</Link>

                    {/* Link to Register form */}
                    <Link to="/register">Don't have an account? Register</Link>
                </div>
            </div>
        </form>
    );
}

export default Login;
