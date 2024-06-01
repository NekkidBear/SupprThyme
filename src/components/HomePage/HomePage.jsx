import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
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

  const user = useSelector((store) => store.user);
  const [heading, setHeading] = useState("Find a Restaurant Near You");
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [aggregatePreferences, setAggregatePreferences] = useState({});
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(10);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const user_id = user.id;
  const lastFetchedUserId = useRef();
  const fetchDataRef = useRef({
    lastFetchedUserId: null,
    cleanup: () =>{} ,
  });

  const fetchUserPreferences = async (user_id, setAggregatePreferences) => {
    try {
      const response = await axios.get(`/api/user_preferences/${user_id}`);
      setAggregatePreferences(response.data);
    } catch (error) {
      console.error("Failed to fetch user preferences:", error);
    }
  };

const fetchData = async (
  user_id,
  scriptLoaded,
  aggregatePreferences,
  setAggregatePreferences
) => {
  let canceled = false;

  if (scriptLoaded && aggregatePreferences && user_id) {
    setLoading(true);
    try {
      //update the heading
      setHeading(
        `Find a restaurant near ${aggregatePreferences.city}, ${aggregatePreferences.state}`
      );

      // Geocode the location string
      const locationString = `${aggregatePreferences.city}, ${aggregatePreferences.state}`;
      const geocodedLocation = await geocodeLocation(locationString);

      if (geocodedLocation) {
        // Set the center state with the geocoded location
        setCenter(geocodedLocation);
      } else {
        // If geocoding failed, set the center state with the latitude and longitude from the user data
        setCenter({
          lat: aggregatePreferences.latitude,
          lng: aggregatePreferences.longitude,
        });
      }
      setLoading(false);
    } catch (error) {
      if (!canceled) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    }
  }

  return () => {
    canceled = true;
  };
};

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

useEffect(() => {
  // Clean up the previous effect
  if (fetchDataRef.current.cleanup) {
    fetchDataRef.current.cleanup();
  }

  // Set up the new effect
  fetchData(
    user_id,
    scriptLoaded,
    aggregatePreferences,
    setAggregatePreferences
  ).then((cleanupFunction) => {
    fetchDataRef.current.cleanup = cleanupFunction;
  });

  // Fetch user preferences
  fetchUserPreferences(user_id, setAggregatePreferences);

  // Update the last fetched user id
  fetchDataRef.current.lastFetchedUserId = user_id;

  return () => {
    // Clean up the current effect when the component unmounts or when the dependencies change
    if (fetchDataRef.current.cleanup) {
      fetchDataRef.current.cleanup();
    }
  };
}, [user_id, scriptLoaded, aggregatePreferences, setAggregatePreferences]);
  useEffect(() => {
    console.log("aggregatePreferences after update:", aggregatePreferences);
  }, [aggregatePreferences]);

  const handleClickCreateGroup = () => {
    history.push("/groupForm");
  };

  const handleClickViewGroups = () => {
    history.push("/groups");
  };

  if (loading) {
    return <p>Loading...</p>;
  }
  console.log("aggregatePreferences.city = ", aggregatePreferences.city);
  console.log("aggregatePreferences.state = ", aggregatePreferences.state);

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

  
  console.log("show recommendations:", showRecommendations);
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
