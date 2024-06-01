import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Grid, Stack, Typography } from "@mui/material";
import { useHistory } from "react-router-dom";
import RestaurantSearch from "../RestaurantSearch/RestaurantSearch";
import RestaurantMap from "../MapPlaceholder/RestaurantMap";
import { geocodeLocation } from "../MapPlaceholder/mapUtils";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

// Define styles
const useStyles = makeStyles((theme) => ({
  map: {
    maxWidth: "90%", // Limit the width of the map
    margin: "0 auto", // Center the map
  },
  restaurantSearch: {
    marginTop: theme.spacing(-2.5), // Reduce the gap between the map and the restaurant results
  },
}));

// HomePage component
const HomePage = ({ searchParams, group_id }) => {
  // Initialize state variables and redux hooks
  const classes = useStyles();
  const theme = useTheme();
  const dispatch = useDispatch();

  // Get the current user from the redux store
  const user = useSelector((store) => store.user);
  console.log('user is:', user); //confirm user object is populated correctly
  console.log('user.id is: ', user.id) //confirm id property exists

  // Get user preferences and loading state from the Redux store
  const preferences = useSelector((state) => state?.userPreferences?.preferences);
  const loading = useSelector((state) => state?.userPreferences?.loading);

  // State variables
  const [heading, setHeading] = useState("Find a Restaurant Near You");
  const [aggregatePreferences, setAggregatePreferences] = useState({});
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(10);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // User id from the user object
  const user_id = user.id;
  console.log('user_id is set to ', user_id) //confirm user_id has been correctly set/retrieved.

  // Refs to store the last fetched user id and the cleanup function for the fetchData effect
  const fetchDataRef = useRef({
    lastFetchedUserId: null,
    cleanup: () => {},
  });

  // Function to fetch data based on user id, scriptLoaded state, and preferences state
  const fetchData = async (
    user_id,
    scriptLoaded,
    preferences,
    setAggregatePreferences
  ) => {
    let canceled = false;

    if (!scriptLoaded || !preferences || !user_id) {
      return;
    }

    setIsFetching(true);

    try {
      // Update the heading
      setHeading(
        `Find a restaurant near ${preferences?.city}, ${preferences?.state}`
      );

      // Geocode the location string
      const locationString = `${preferences.city}, ${preferences.state}`;
      const geocodedLocation = await geocodeLocation(locationString);

      if (geocodedLocation) {
        // Set the center state with the geocoded location
        setCenter(geocodedLocation);
      } else {
        // If geocoding failed, set the center state with the latitude and longitude from the user data
        setCenter({
          lat: preferences?.latitude,
          lng: preferences?.longitude,
        });
      }
      setIsFetching(false);
    } catch (error) {
      if (!canceled) {
        console.error("Error fetching user data:", error);
      }
      setIsFetching(false);
    }

    return () => {
      canceled = true;
    };
  };

  // Effect to load the Google Maps script
  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${
        import.meta.env.VITE_GOOGLE_MAPS_API_KEY
      }`;
      script.async = true;
      script.defer = true;
      script.onload = () => setScriptLoaded(true);
      document.body.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  // Effect to fetch data and user preferences
  useEffect(() => {
    // Clean up the previous effect
    if (fetchDataRef.current.cleanup) {
      fetchDataRef.current.cleanup();
    }

    // Dispatch the FETCH_USER_PREFERENCES_REQUEST action
    dispatch({ type: "FETCH_USER_PREFERENCES_REQUEST", payload: user_id });

    // Only fetch data if scriptLoaded is true, preferences is not empty, and the component is not currently fetching data
    if (scriptLoaded && preferences && Object.keys(preferences).length > 0 && !isFetching) {
      // Set up the new effect
      const cleanupFunction = fetchData(
        user_id,
        scriptLoaded,
        preferences,
        setAggregatePreferences
      );
      fetchDataRef.current.cleanup = cleanupFunction;

      // Update the last fetched user id
      fetchDataRef.current.lastFetchedUserId = user_id;
    }

    return () => {
      // Clean up the current effect when the component unmounts or when the dependencies change
      if (fetchDataRef.current.cleanup) {
        fetchDataRef.current.cleanup();
      }
    };
  }, [
    user_id,
    scriptLoaded,
    preferences,
    setAggregatePreferences,
    isFetching,
    dispatch,
  ]);

  // Effect to log the aggregatePreferences state when it changes
  useEffect(() => {
    console.log("aggregatePreferences after update:", aggregatePreferences);
  }, [aggregatePreferences]);

  // Event handlers for the buttons
  const handleClickCreateGroup = () => {
    history.push("/groupForm");
  };

  const handleClickViewGroups = () => {
    history.push("/groups");
  };

  // Render loading text if the component is loading
  if (loading) {
    return <p>Loading...</p>;
  }

  // Log the city and state from the preferences state
  console.log("preferences.city = ", preferences?.city);
  console.log("preferences.state = ", preferences?.state);

  // Event handler for the Recommend Restaurants button
  const handleRecommendations = async () => {
    console.log(
      "handleRecommendations called with aggregatePreferences:",
      aggregatePreferences
    );
    try {
      setShowRecommendations(true);
    } catch (error) {
      console.error("Failed to fetch user preferences:", error);
    }
  };

  // Log the showRecommendations state
  console.log("show recommendations:", showRecommendations);

  // Render the component

  return (
    <div>
      <Typography variant="h2" align="center">
        {heading}
      </Typography>
      <div className={classes.map}>
        <RestaurantMap center={center} zoom={zoom} />
      </div>
      <Grid container spacing={3} alignItems="center">
        <Grid item xs={11}>
          {!loading && aggregatePreferences.city && (
            <div className={classes.restaurantSearch}>
              {console.log(
                "aggregatePreferences passed to component:",
                aggregatePreferences
              )}
              <RestaurantSearch
                searchParams={aggregatePreferences}
                user={user}
                group_id={group_id}
              />
            </div>
          )}
        </Grid>
        <Grid item xs={1}>
          <Grid
            container
            justifyContent="flex-end"
            style={{ padding: "0 20px" }}
          >
            <Stack spacing={2}>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleRecommendations}
              >
                Recommend Restaurants
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleClickCreateGroup}
              >
                Create a group
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleClickViewGroups}
              >
                View groups
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};
export default HomePage;
