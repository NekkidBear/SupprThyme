import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

// A Custom Wrapper Component -- This will keep our code DRY.
// Responsible for watching redux state, and returning an appropriate component
// API for this component is the same as a regular route

// THIS IS NOT SECURITY! That must be done on the server
// A malicious user could change the code and see any view
// so your server-side route must implement real security
// by checking req.isAuthenticated for authentication
// and by checking req.user for authorization

function ProtectedRoute() {
  const user = useSelector((store) => store.user);

  // We return an Outlet that will render the child components if the user is logged in
  // Otherwise, we redirect to the login page
  return user.id ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedRoute;
