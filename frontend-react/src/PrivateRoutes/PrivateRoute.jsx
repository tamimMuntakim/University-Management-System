import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../Providers/AuthProvider';

const PrivateRoute = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
