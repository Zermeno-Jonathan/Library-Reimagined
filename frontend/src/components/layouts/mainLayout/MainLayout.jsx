import { Outlet } from 'react-router-dom';
import Header from '../../header/Header';
import NavBar from '../../navbar/NavBar'; // nota: NavBar con mayúsculas
import Footer from '../../footer/Footer';
import styles from './MainLayout.module.css';

function MainLayout() {
    return (
        <div className={styles.mainLayout}>
            <div className={styles.topBar}>
                <Header />
                <NavBar />
            </div>
            <div className={styles.content}>
                <Outlet />
            </div>
            <Footer />
        </div>
    );
}

export default MainLayout;
