import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function ProtectedRoute({ children }) {
  const user = useSelector((store) => store.user);

  // If the user is logged in, show the protected component (children)
  // Otherwise, redirect to the LoginPage
  return user.id ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
