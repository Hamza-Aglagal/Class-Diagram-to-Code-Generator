import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  // Check if user is logged in by looking for token/user data in localStorage
  const isAuthenticated = localStorage.getItem('user');

  return isAuthenticated ? children : <Navigate to="/auth" />;
};

export default PrivateRoute;
