import React from 'react';
import { useAuthSelector } from '../redux/selector';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useAuthSelector().isAuthenticated;
  const token = window.localStorage.getItem('token');

  if (isAuthenticated && token) {
    return children;
  }
  return <Navigate to="/auth" replace />;
};

export default ProtectedRoute;
