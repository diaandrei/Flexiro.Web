import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const RequireAuth = ({ role, element }) => {
    const { isAuthenticated, userRole } = useSelector(state => state.user);

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (role && userRole !== role) {
        // If the role doesn't match, redirect to login
        return <Navigate to="/login" replace />;
    }

    return element;
};

export default RequireAuth;
