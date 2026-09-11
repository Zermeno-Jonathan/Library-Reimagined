import { useState, useEffect } from 'react';
import supabase from '../../config/supabaseClient';
import FormInput from '../../components/FormInput/FormInput';
import styles from './Profile.module.css';

function Profile() {
    const [name, setName] = useState('');
    const [nameError, setNameError] = useState('');
    const [nameSaving, setNameSaving] = useState(false);
    const [nameSuccess, setNameSuccess] = useState(false);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordSaving, setPasswordSaving] = useState(false);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const {
                    data: { user },
                } = await supabase.auth.getUser();
                if (!user) return;

                setEmail(user.email);

                const { data } = await supabase
                    .from('users')
                    .select('name')
                    .eq('auth_id', user.id)
                    .single();

                setName(data?.name ?? '');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleNameSubmit = async (e) => {
        e.preventDefault();
        setNameError('');

        if (!name.trim()) {
            setNameError('Name is required');
            return;
        }

        setNameSaving(true);
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            const { error } = await supabase
                .from('users')
                .update({ name: name.trim() })
                .eq('auth_id', user.id);

            if (error) {
                setNameError('Error updating name');
                return;
            }

            setNameSuccess(true);
            setTimeout(() => setNameSuccess(false), 2000);
        } finally {
            setNameSaving(false);
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');

        if (!currentPassword) {
            setPasswordError('Current password is required');
            return;
        }

        if (!newPassword) {
            setPasswordError('New password is required');
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters');
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        if (currentPassword === newPassword) {
            setPasswordError('New password must be different from current');
            return;
        }

        setPasswordSaving(true);
        try {
            // Verify current password by re-authenticating
            const { error: signInError } =
                await supabase.auth.signInWithPassword({
                    email,
                    password: currentPassword,
                });

            if (signInError) {
                setPasswordError('Current password is incorrect');
                return;
            }

            // Update password
            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            });

            if (error) {
                setPasswordError('Error updating password');
                return;
            }

            setPasswordSuccess(true);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            setTimeout(() => setPasswordSuccess(false), 2000);
        } finally {
            setPasswordSaving(false);
        }
    };

    if (loading) {
        return (
            <main className={styles.container}>
                <div className={styles.state}>
                    <p>Loading profile...</p>
                </div>
            </main>
        );
    }

    return (
        <main className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.heading}>My Profile</h1>
                <p className={styles.subheading}>
                    Manage your personal information.
                </p>
            </div>

            {/* Email — read only */}
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Email</h2>
                <p className={styles.emailText}>{email}</p>
                <p className={styles.emailNote}>
                    Your email address cannot be changed.
                </p>
            </div>

            {/* Name */}
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Name</h2>
                <form onSubmit={handleNameSubmit} className={styles.form}>
                    <FormInput
                        id="name"
                        label="Your name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            setNameError('');
                        }}
                        error={nameError}
                    />
                    <button
                        type="submit"
                        className={`${styles.saveBtn} ${nameSuccess ? styles.saveBtnSuccess : ''}`}
                        disabled={nameSaving}
                    >
                        {nameSaving
                            ? 'Saving...'
                            : nameSuccess
                              ? 'Saved!'
                              : 'Save Name'}
                    </button>
                </form>
            </div>

            {/* Password */}
            <div className={styles.card}>
                <h2 className={styles.cardTitle}>Change Password</h2>
                <form onSubmit={handlePasswordSubmit} className={styles.form}>
                    <FormInput
                        id="currentPassword"
                        label="Current password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => {
                            setCurrentPassword(e.target.value);
                            setPasswordError('');
                        }}
                        error={passwordError}
                    />
                    <FormInput
                        id="newPassword"
                        label="New password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                            setPasswordError('');
                        }}
                    />
                    <FormInput
                        id="confirmPassword"
                        label="Confirm new password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => {
                            setConfirmPassword(e.target.value);
                            setPasswordError('');
                        }}
                    />
                    <button
                        type="submit"
                        className={`${styles.saveBtn} ${passwordSuccess ? styles.saveBtnSuccess : ''}`}
                        disabled={passwordSaving}
                    >
                        {passwordSaving
                            ? 'Saving...'
                            : passwordSuccess
                              ? 'Password Updated!'
                              : 'Update Password'}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default Profile;
