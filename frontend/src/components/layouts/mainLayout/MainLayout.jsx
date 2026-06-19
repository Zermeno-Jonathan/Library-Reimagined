import Header from '../../header/Header'
import Navbar from '../../navbar/NavBar'  // nota: NavBar con mayúsculas
import Footer from '../../footer/Footer'
import { Outlet } from 'react-router-dom';

function MainLayout() {
    return (
        <>
            <Header />
            <Navbar />
            <Outlet /> {/* aquí se renderizan las páginas según la ruta */}
            <Footer />
        </>
    );
}

export default MainLayout;
