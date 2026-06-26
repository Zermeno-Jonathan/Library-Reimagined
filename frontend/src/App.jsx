import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layouts/mainLayout/MainLayout';
import AuthLayout from './components/layouts/AuthLayout/AuthLayout';

// Pages
import Home from './pages/Home/Home';
import Books from './pages/Books/Books';
import Loans from './pages/Loans/Loans';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import MenuAdmin from './pages/MenuAdmin/MenuAdmin';
import MenuUser from './pages/MenuUser/MenuUser';
import Queries from './pages/Queries/Queries';
import Users from './pages/Users/Users';
import NotFound from './pages/NotFound/NotFound';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Páginas con Header, Navbar, Footer */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/loans" element={<Loans />} />
                    <Route path="/menuadmin" element={<MenuAdmin />} />
                    <Route path="/menuuser" element={<MenuUser />} />
                    <Route path="/queries" element={<Queries />} />
                    <Route path="/users" element={<Users />} />
                </Route>

                {/* Páginas de autenticación sin Header/Navbar/Footer */}
                <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                {/* Catch-all — Any other route that doesn't match a defined route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
