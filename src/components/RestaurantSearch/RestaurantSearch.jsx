// Import necessary dependencies
import React, { useState, useEffect } from "react";
import axios from "axios";
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
  console.log('RestaurantSearch called with searchParams:', searchParams, user, group_id);

  // Initialize state variables and redux hooks
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants);
  const showRecommendations = useSelector((store) => store.showRecommendations);
  const user_id = user ? parseInt(user.id) : null;
  // Fetch restaurants when component mounts or searchParams, dispatch, group_id, or user changes

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        let response;
        let aggregatePreferences = {};

        // Case 1: User first logs in, render restaurants based on city and state
        if (!user && searchParams.city && searchParams.state) {
          aggregatePreferences = searchParams;
        }
        // Case 2: User clicks on 'recommend a restaurant', use user's preferences
        else if (user && !group_id) {
          const preferencesResponse = await axios.get(
            `/api/user_preferences/${user_id}`
          );
          const userPreferences = preferencesResponse.data;
          aggregatePreferences = {
            max_price_range: userPreferences.max_price_range,
            max_distance: userPreferences.max_distance,
            meat_preference:
              userPreferences.meat_preference === "Vegetarian" ||
              userPreferences.meat_preference === "Vegan"
                ? "Vegetarian/Vegan"
                : userPreferences.meat_preference,
            cuisine_types:( userPreferences.cuisine_types || []).join(','),
            city: searchParams.city,
            state: searchParams.state,
          };
        }
        // Case 3: User triggers search from a group, aggregate preferences
        else if (group_id) {
          // Fetch the preferences of each user in the group
          const groupResponse = await axios.get(`/api/groups/${group_id}`);
          const users = groupResponse.data.users;
          const preferences = await Promise.all(
            users.map((user) =>
              axios.get(`api/user_preferences/${user.user_id}`)
            )
          );

          // Aggregate the preferences
          aggregatePreferences = preferences.reduce(
            (aggregate, current) => {
              if (!current.data) {
                // Skip this user if they have not defined preferences
                return aggregate;
              }

              // For price range and max distance, find the maximum value that is less than or equal to the lowest maximum value
              aggregate.max_price_range = Math.min(
                aggregate.max_price_range || Infinity,
                current.data.max_price_range
              );
              aggregate.max_distance = Math.min(
                aggregate.max_distance || Infinity,
                current.data.max_distance
              );

              // For meat preference, check if a restaurant offers vegetarian/vegan options if a user prefers it
              if (
                current.data.meat_preference === "Vegetarian" ||
                current.data.meat_preference === "Vegan"
              ) {
                aggregate.meat_preference = "Vegetarian/Vegan";
              }

              // For cuisine types, add the user's preferred cuisine types to the aggregate
              aggregate.cuisine_types = [
                ...(aggregate.cuisine_types || []),
                ...current.data.cuisine_types,
              ];
              aggregatePreferences.cuisine_types = aggregatePreferences.cuisine_types.join(',');
              return aggregate;
            },
            { city: searchParams.city, state: searchParams.state }
          );
        } else {
          console.error("Insufficient information to fetch restaurants");
          setError("Insufficient information to fetch restaurants");
          return;
        }

        // Fetch restaurants based on the aggregate preferences
        const params = new URLSearchParams(aggregatePreferences);
        response = await axios.get(
          `/api/restaurants/search?${params.toString()}`
        );

        // Dispatch the fetched restaurants to the Redux store
        dispatch({ type: "SET_RESTAURANTS", payload: response.data });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Error fetching restaurants. Please try again later.");
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams, dispatch, group_id, user, showRecommendations]);

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
