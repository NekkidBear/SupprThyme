// Import necessary dependencies
import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";

// Import custom theme
import theme from "../theme.js";

// Import components
import Nav from "../Nav/Nav";
import Footer from "../Footer/Footer";
import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import AboutPage from "../AboutPage/AboutPage";
import UserPage from "../UserPage/UserPage";
import InfoPage from "../InfoPage/InfoPage";
import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import PreferencesPage from "../PreferencesPage/PreferencesPage";
import UserHomePage from "../HomePage/HomePage";
import GroupsPage from "../GroupPage/GroupsPage";
import SearchResults from "../GroupSearchResults/GroupSearchResults.jsx";
import GroupForm from "../CreateGroupForm/GroupForm.jsx";

// Import styles
import "./App.css";

// Main App component
function App() {
  // Initialize redux hooks
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  // Fetch user data when component mounts
  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  // Render the app
  return (
    // Apply the theme to all child components
    <ThemeProvider theme={theme}>
      <Router>
        <div>
          <Nav />
          <Routes>
            {/* Define routes */}
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/about" element={<AboutPage />} />
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <UserPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/info"
              element={
                <ProtectedRoute>
                  <InfoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/preferences"
              element={
                <ProtectedRoute>
                  <PreferencesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/login"
              element={user.id ? <Navigate to="/user-home" replace /> : <LoginPage />}
            />
            <Route
              path="/registration"
              element={user.id ? <Navigate to="/user" replace /> : <RegisterPage />}
            />
            <Route
              path="/home"
              element={user.id ? <Navigate to="/user-home" replace /> : <LandingPage />}
            />
            <Route
              path="/user-home"
              element={user.id ? <UserHomePage /> : <Navigate to="/home" replace />}
            />
            <Route
              path="/search-results"
              element={
                <ProtectedRoute>
                  <SearchResults />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groups"
              element={
                <ProtectedRoute>
                  <GroupsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/groupForm"
              element={
                <ProtectedRoute>
                  <GroupForm />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<h1>404</h1>} />
          </Routes>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
