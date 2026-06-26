// import { useNavigate, Link } from 'react-router-dom';
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
        // Validations - Prevents default behavior
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

        // Login with Supabase
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setEmailError('Email or password is incorrect');
            console.log(error);
            return;
        }

        if (data) {
            // Fetch the user role from the 'users' table
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('rol')
                .eq('auth_id', data.user.id) // ← aquí
                .single();

            if (userError) {
                console.error('Error getting user role:', userError);
                return;
            }

            // Store the user role in localStorage
            localStorage.setItem('userRole', userData.rol);
            navigate('/');
        }

        //  Delete this console.log
        console.log('Form válido:', { email, password });
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
