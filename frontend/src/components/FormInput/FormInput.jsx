import styles from './FormInput.module.css';

function FormInput({ id, label, type, value, onChange, error }) {
    return (
        <div className={styles.formGroup}>
            <input
                id={id}
                type={type}
                placeholder=" "
                className={styles.input}
                value={value}
                onChange={onChange}
            />
            <label htmlFor={id} className={styles.label}>
                {label}
            </label>
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
}

export default FormInput;
