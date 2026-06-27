import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute({ allowedRoles }) {
    const userRole = localStorage.getItem('userRole');

    if (!userRole) {
        return <Navigate to="/login" replace></Navigate>;
    }

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to="/" replace></Navigate>;
    }

    return <Outlet />;
}

export default ProtectedRoute;
