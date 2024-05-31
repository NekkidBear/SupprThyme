// Import necessary dependencies
import React, { useEffect } from "react";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
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
          <Switch>
            {/* Define routes */}
            <Redirect exact from="/" to="/home" />
            <Route exact path="/about">
              <AboutPage />
            </Route>
            <ProtectedRoute exact path="/user">
              <UserPage />
            </ProtectedRoute>
            <ProtectedRoute exact path="/preferences">
              <PreferencesPage />
            </ProtectedRoute>
            <Route exact path="/login">
              {user.id ? <Redirect to="/user-home" /> : <LoginPage />}
            </Route>
            <Route exact path="/registration">
              {user.id ? <Redirect to="/user" /> : <RegisterPage />}
            </Route>
            <Route exact path="/home">
              {user.id ? <Redirect to="/user-home" /> : <LandingPage />}
            </Route>
            <Route exact path="/user-home">
              {user.id ? <UserHomePage /> : <LandingPage />}
            </Route>
            <ProtectedRoute exact path="/search-results">
              <SearchResults />
            </ProtectedRoute>
            <ProtectedRoute exact path="/groups">
              <GroupsPage />
            </ProtectedRoute>
            <ProtectedRoute exact path="/groupForm">
              <GroupForm />
            </ProtectedRoute>
            <Route>
              <h1>404</h1>
            </Route>
          </Switch>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
