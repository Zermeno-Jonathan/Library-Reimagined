import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './components/layouts/mainLayout/MainLayout';
import AuthLayout from './components/layouts/AuthLayout/AuthLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

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
                {/* Pages */}
                <Route element={<MainLayout />}>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/books" element={<Books />} />
                    <Route path="/loans" element={<Loans />} />
                    <Route path="/queries" element={<Queries />} />

                    {/* Protected routes Admin*/}
                    <Route
                        element={<ProtectedRoute allowedRoles={['admin']} />}
                    >
                        <Route path="/menuadmin" element={<MenuAdmin />} />
                        <Route path="/users" element={<Users />} />
                    </Route>

                    {/* Protected routes User*/}
                    <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                        <Route path="/menuuser" element={<MenuUser />} />
                    </Route>
                </Route>

                {/* Auth pages */}
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
