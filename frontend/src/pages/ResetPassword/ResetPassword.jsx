import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormInput from '../../components/FormInput/FormInput';
import supabase from '../../config/supabaseClient';
import styles from './ResetPassword.module.css';

function ResetPassword() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [confirmError, setConfirmError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setPasswordError('');
        setConfirmError('');

        if (!password) {
            setPasswordError('Password is required');
            return;
        }

        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        if (password !== confirmPassword) {
            setConfirmError('Passwords do not match');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.auth.updateUser({ password });

            if (error) {
                setPasswordError('Something went wrong. Please try again.');
                return;
            }

            setDone(true);
            setTimeout(() => navigate('/'), 2000);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className={styles.mainContainer}>
                <div className={styles.formContainer}>
                    <div className={styles.divTitle}>
                        <h3 className={styles.title}>Set a new password</h3>
                    </div>

                    {done ? (
                        <p className={styles.success}>
                            Password updated. Redirecting...
                        </p>
                    ) : (
                        <>
                            <FormInput
                                id="new-password"
                                label="New password"
                                type="password"
                                value={password}
                                onChange={(e) => {
                                    setPassword(e.target.value);
                                    setPasswordError('');
                                }}
                                error={passwordError}
                            />
                            <FormInput
                                id="confirm-password"
                                label="Confirm new password"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => {
                                    setConfirmPassword(e.target.value);
                                    setConfirmError('');
                                }}
                                error={confirmError}
                            />
                            <button
                                className={styles.submitBtn}
                                type="submit"
                                disabled={submitting}
                            >
                                {submitting ? 'Saving...' : 'Update password'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
}

export default ResetPassword;
