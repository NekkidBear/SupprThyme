// Import necessary dependencies
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./RestaurantSearch.css";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import theme from "../theme";

// Define styles for the component
const useStyles = makeStyles((theme) => ({
  restaurantSearch: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    maxWidth: "80%",
    margin: "0 auto",
    padding: theme.spacing(2),
    overflowY: "auto",
  },
  card: {
    width: "200px", // Set a consistent width
    height: "300px", // Set a consistent height
    borderRadius: "15px", // Round the corners
    overflow: "auto", // Add scroll if content overflows
  },
  cardContent: {
    wordWrap: "break-word", // Make the text wrap if needed
  },
  restaurantName: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "5px",
    width: "100%",
    textAlign: "center",
  },
}));

// RestaurantSearch component

const RestaurantSearch = ({ user, searchParams, group_id }) => {
  console.log(
    "RestaurantSearch called with searchParams:",
    searchParams,
    user,
    group_id
  );

  // Initialize state variables and redux hooks
  const classes = useStyles();
  // Get restaurants, loading, and error state from the Redux store
  const restaurants = useSelector((state) => state.restaurants.restaurants);
  const loading = useSelector((state) => state.restaurants.loading);
  const error = useSelector((state) => state.restaurants.error);
  const dispatch = useDispatch();
  const showRecommendations = useSelector((store) => store.showRecommendations);
  const user_id = user ? parseInt(user.id) : null;
  // Fetch restaurants when component mounts or searchParams, dispatch, group_id, or user changes

  useEffect(() => {
    // Case 1: No group active, no recommendations requested
    if (
      !user &&
      !showRecommendations &&
      searchParams.city &&
      searchParams.state
    ) {
      dispatch({
        type: "FETCH_RESTAURANTS_REQUEST",
        payload: searchParams,
      });
    }
    // Case 2: User requested recommendations
    else if (user && !group_id && showRecommendations) {
      dispatch({
        type: "FETCH_USER_PREFERENCES_REQUEST",
        payload: { user_id: user.id },
      });
    }
    // Case 3: Group is active
    else if (group_id) {
      dispatch({
        type: "FETCH_USER_PREFERENCES_REQUEST",
        payload: { group_id },
      });
    } else {
      console.error("Insufficient information to fetch restaurants");
      // Dispatch an action that sets an error message in your Redux state
      dispatch({
        type: "SET_ERROR",
        payload: "Insufficient information to fetch restaurants",
      });
    }
  }, [searchParams, dispatch, group_id, user, showRecommendations]);

  // Listen for changes to the user's preferences in your Redux state
  const userPreferences = useSelector((state) => state.userPreferences);
  useEffect(() => {
    if (userPreferences) {
      dispatch({
        type: "FETCH_RESTAURANTS_REQUEST",
        payload: userPreferences,
      });
    }
  }, [dispatch, userPreferences]);

  // Render loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render error state
  if (error) {
    return (
      <div>
        <Typography variant="h4" color="error">
          {error}
        </Typography>
      </div>
    );
  }

  // Render the list of restaurants
  return (
    <ThemeProvider theme={theme}>
      <div className={classes.restaurantSearch}>
        <Typography variant="h2" align="center">
          Restaurant Results
        </Typography>
        <Grid
          container
          direction="row"
          justify="space-around"
          alignItems="flex-end"
          spacing={3}
        >
          {restaurants.map((restaurant) => (
            <Grid item key={restaurant.id}>
              <Card className={classes.card} elevation={5}>
                <Typography variant="h5" className={classes.restaurantName}>
                  {restaurant.name}
                </Typography>
                <CardContent>
                  <Typography>Rating: {restaurant.rating}</Typography>
                  <Typography>Price Level: {restaurant.price_level}</Typography>
                  <Typography>
                    Location: {restaurant.location_string}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </ThemeProvider>
  );
};

export default RestaurantSearch;
