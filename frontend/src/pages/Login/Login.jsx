import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import supabase from '../../config/supabaseClient';
import styles from './Login.module.css';

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleSubmit = async (e) => {
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

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setEmailError('Email or password is incorrect');
            console.error(error);
            return;
        }

        // AuthContext detecta el cambio de sesión automáticamente
        // ya no necesitamos fetchear el rol ni guardarlo en localStorage
        navigate('/');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.loginContainer}>
                <div className={styles.divTitle}>
                    <h3 className={styles.loginTitle}>Access your account</h3>
                </div>

                <FormInput
                    id="email"
                    label="Enter your email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
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
                        setPasswordError('');
                    }}
                    error={passwordError}
                />

                <button className={styles.loginButton} type="submit">
                    Login
                </button>

                <div className={styles.linksContainer}>
                    <Link to="/">Go back</Link>
                    <Link to="/register">Don't have an account? Register</Link>
                </div>
            </div>
        </form>
    );
}

export default Login;
