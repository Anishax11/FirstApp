import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
    const { currentUser } = useAuth();

    // If auth state is confirmed and no user, display login redirect
    // (Loading state is already handled in AuthContext provider not to render children until ready)
    return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
