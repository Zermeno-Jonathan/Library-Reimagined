import styles from './Home.module.css';

function Home() {
    // temporal logout
    const handleLogout = (e) => {
        e.preventDefault();
        localStorage.removeItem('userRole');
        window.location.href = '/';
    };

    return (
        <div className="home">
            <p className={styles.welcome}>Home</p>
            <p>
                {/* temporal logout */}
                <a href="#" onClick={handleLogout}>
                    Logout (temp)
                </a>
            </p>
        </div>
    );
}

export default Home;
