import { useState } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import styles from './ForgotPasswordModal.module.css';
import supabase from '../../config/supabaseClient';

function ForgotPasswordModal({ onClose }) {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setEmailError('');

        if (!email) {
            setEmailError('Email is required');
            return;
        }

        if (!email.includes('@')) {
            setEmailError('Email address must be valid');
            return;
        }

        setSubmitting(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/resetpassword`,
            });

            if (error) {
                setEmailError('Something went wrong. Please try again.');
                return;
            }

            setSent(true);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.modalHeader}>
                    <h2 className={styles.modalTitle}>Reset your password</h2>
                    <button
                        className={styles.closeBtn}
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        ✕
                    </button>
                </div>

                {sent ? (
                    <div className={styles.successMessage}>
                        <p>Check your email — we sent you a reset link.</p>
                        <button className={styles.submitBtn} onClick={onClose}>
                            Back to Login
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form}>
                        <p className={styles.description}>
                            Enter your email and we'll send you a link to reset
                            your password.
                        </p>
                        <FormInput
                            id="forgot-email"
                            label="Enter your email"
                            type="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                setEmailError('');
                            }}
                            error={emailError}
                        />
                        <div className={styles.modalFooter}>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={submitting}
                            >
                                {submitting ? 'Sending...' : 'Send reset link'}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ForgotPasswordModal;
