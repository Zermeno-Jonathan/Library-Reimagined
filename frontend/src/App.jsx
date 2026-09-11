import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import MainLayout from './components/layouts/mainLayout/MainLayout';
import AuthLayout from './components/layouts/AuthLayout/AuthLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Pages
import Home from './pages/Home/Home';
import Books from './pages/Books/Books';
import Catalog from './pages/Catalog/Catalog';
import Loans from './pages/Loans/Loans';
import AdminLoans from './pages/AdminLoans/AdminLoans';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import MenuAdmin from './pages/MenuAdmin/MenuAdmin';
import MenuUser from './pages/MenuUser/MenuUser';
import Queries from './pages/Queries/Queries';
import Users from './pages/Users/Users';
import NotFound from './pages/NotFound/NotFound';
import Profile from './pages/Profile/Profile';
import MyLoans from './pages/MyLoans/MyLoans';

function GuestRoute({ children }) {
    const { userRole, loading } = useAuth();

    if (loading) return null;
    if (userRole) return <Navigate to="/" replace />;

    return children;
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Pages */}
                <Route element={<MainLayout />}>
                    {/* Public routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />

                    {/* Protected routes Admin*/}
                    <Route
                        element={<ProtectedRoute allowedRoles={['admin']} />}
                    >
                        <Route path="/adminloans" element={<AdminLoans />} />
                        <Route path="/books" element={<Books />} />
                        <Route path="/menuadmin" element={<MenuAdmin />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/queries" element={<Queries />} />
                    </Route>

                    {/* Protected routes User*/}
                    <Route element={<ProtectedRoute allowedRoles={['user']} />}>
                        <Route path="/loans" element={<Loans />} />
                        <Route path="/menuuser" element={<MenuUser />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/myloans" element={<MyLoans />} />
                    </Route>
                </Route>

                {/* Auth pages */}
                <Route element={<AuthLayout />}>
                    <Route
                        path="/login"
                        element={
                            <GuestRoute>
                                <Login />
                            </GuestRoute>
                        }
                    />
                    <Route
                        path="/register"
                        element={
                            <GuestRoute>
                                <Register />
                            </GuestRoute>
                        }
                    />
                </Route>

                {/* Catch-all — Any other route that doesn't match a defined route */}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
