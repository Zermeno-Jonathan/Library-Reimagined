// import { useNavigate, Link } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import styles from './Register.module.css';

function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');

    const handleRegister = (e) => {
        e.preventDefault();

        setEmailError('');
        setPasswordError('');

        if (!email) {
            setEmailError('Enter an email address');
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
        <form onSubmit={handleRegister}>
            <div className={styles.registerContainer}>
                <div className={styles.divTitle}>
                    <h3 className={styles.registerTitle}>Create an account</h3>
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
                <button className={styles.registerButton} type="submit">
                    Register
                </button>

                <div className={styles.linksContainer}>
                    {/* Link to home page */}
                    <Link to="/">Go back</Link>

                    {/* Link to Register form */}
                    <Link to="/login">Already have an account? Login</Link>
                </div>
            </div>
        </form>
    );
}

export default Register;
