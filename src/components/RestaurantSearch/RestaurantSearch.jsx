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
  // Initialize state variables and redux hooks
  const classes = useStyles();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants);
  const showRecommendations = useSelector((store) => store.showRecommendations);
  // Fetch restaurants when component mounts or searchParams, dispatch, group_id, or user changes

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        let response;
        let aggregatePreferences = {};
        if (showRecommendations) {
          // Fetch recommendations for a single user
          if(!user){
            console.error("user is undefined");
            setError("user is undefined. please log in");
            return;
          }
          response = await axios.get(`/api/recommendations/${user}`);
        } else if (group_id) {
          // Fetch the preferences of each user in the group
          const groupResponse = await axios.get(`/api/groups/${group_id}`);
          const users = groupResponse.data.users;
          const preferences = await Promise.all(
            users.map((user) => axios.get(`/api/users/${user}/preferences`))
          );

          console.log(searchParams);

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

              // For cuisine types, use distinct items
              aggregate.cuisine_types = [
                ...new Set([
                  ...(aggregate.cuisine_types || []),
                  ...current.data.cuisine_types,
                ]),
              ];

              // For open now, calculate based on their local time vs the days/hours listed in the database
              aggregate.open_now = aggregate.open_now && current.data.open_now;

              // For accepts large parties, default to true
              aggregate.accepts_large_parties =
                aggregate.accepts_large_parties &&
                current.data.accepts_large_parties;

              return aggregate;
            },
            {} // Pass an empty object as the initial value
          );
        } else {
          // Use the currently logged in user's location data
          if (searchParams.city && searchParams.state) {
            aggregatePreferences = searchParams;
          } else {
            // Handle the case where city and state are not provided
            console.error("City and state must be provided in searchParams");
            setError(
              "City and state must be provided. Please update your location settings."
            );
            return; // Exit the function early to prevent further execution
          }
        }

        // Fetch restaurants based on the aggregate preferences
        const params = new URLSearchParams({
          aggregatePreferences: JSON.stringify(aggregatePreferences),
        }).toString();
        console.log("aggregate preferences:", aggregatePreferences);
        console.log("params:", params);
        console.log(`/api/restaurants/search?${params}`);
        response = await axios.get(`/api/restaurants/search?${params}`);

        // Dispatch the SET_RESTAURANTS action
        dispatch({ type: "SET_RESTAURANTS", payload: response.data });
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Error fetching restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams, dispatch, group_id, user]);

  // Render loading state
  if (loading) {
    return <p>Loading...</p>;
  }

  // Render error state
  if (error) {
    return <p>{error}</p>;
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
