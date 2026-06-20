import { Outlet } from 'react-router-dom';
import Header from '../../header/Header';
import NavBar from '../../navbar/NavBar'; // nota: NavBar con mayúsculas
import Footer from '../../footer/Footer';
import styles from './MainLayout.module.css';

function MainLayout() {
    return (
        <>
            <div className={styles.topBar}>
                <Header />
                <NavBar />
            </div>
            <Outlet /> {/* aquí se renderizan las páginas según la ruta */}
            <Footer />
        </>
    );
}

export default MainLayout;
