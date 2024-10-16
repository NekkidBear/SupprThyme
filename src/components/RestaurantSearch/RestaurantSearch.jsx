import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ThemeProvider } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";
import { Card, CardContent, Grid, Typography, TextField, CircularProgress } from "@mui/material";
import theme from "../theme";

const useStyles = makeStyles((theme) => ({
  restaurantSearch: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    margin: "0 auto",
    padding: theme.spacing(2),
  },
  card: {
    width: "100%",
    height: "100%",
    borderRadius: "15px",
    overflow: "auto",
  },
  cardContent: {
    wordWrap: "break-word",
  },
  restaurantName: {
    backgroundColor: theme.palette.secondary.main,
    borderRadius: "5px",
    width: "100%",
    textAlign: "center",
    padding: theme.spacing(1),
  },
  searchInput: {
    marginBottom: theme.spacing(2),
    width: "100%",
  },
}));

const RestaurantSearch = ({ onLocationSelect }) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const dispatch = useDispatch();
  const restaurants = useSelector((state) => state.restaurants);
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);
  const placesServiceRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = initializeGoogleServices;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const initializeGoogleServices = () => {
    mapRef.current = new window.google.maps.Map(document.createElement("div"));
    placesServiceRef.current = new window.google.maps.places.PlacesService(mapRef.current);
    
    autocompleteRef.current = new window.google.maps.places.Autocomplete(
      document.getElementById("restaurant-search-input"),
      { types: ["establishment"] }
    );

    autocompleteRef.current.addListener("place_changed", handlePlaceSelect);
  };

  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();
    if (place.geometry) {
      const location = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      };
      onLocationSelect(location);
      searchRestaurants(location);
    }
  };

  const searchRestaurants = (location) => {
    setLoading(true);
    setError(null);

    const request = {
      location: location,
      radius: 5000,
      type: ["restaurant"],
    };

    placesServiceRef.current.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK) {
        const formattedResults = results.map(formatRestaurantData);
        dispatch({ type: "SET_RESTAURANTS", payload: formattedResults });
      } else {
        setError("Error fetching restaurants. Please try again.");
      }
      setLoading(false);
    });
  };

  const formatRestaurantData = (place) => ({
    id: place.place_id,
    name: place.name,
    rating: place.rating,
    price_level: place.price_level,
    location_string: place.vicinity,
    photo: place.photos && place.photos[0].getUrl(),
    geometry: place.geometry,
  });

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <ThemeProvider theme={theme}>
      <div className={classes.restaurantSearch}>
        <TextField
          id="restaurant-search-input"
          label="Search for restaurants"
          variant="outlined"
          className={classes.searchInput}
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        <Typography variant="h4" align="center" gutterBottom>Restaurant Results</Typography>
        <Grid container spacing={3}>
          {restaurants.map((restaurant) => (
            <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
              <Card className={classes.card} elevation={5}>
                <Typography variant="h6" className={classes.restaurantName}>
                  {restaurant.name}
                </Typography>
                <CardContent className={classes.cardContent}>
                  <Typography>Rating: {restaurant.rating}</Typography>
                  <Typography>Price Level: {"$".repeat(restaurant.price_level)}</Typography>
                  <Typography>Location: {restaurant.location_string}</Typography>
                  {restaurant.photo && (
                    <img src={restaurant.photo} alt={restaurant.name} style={{ width: "100%", marginTop: "10px" }} />
                  )}
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
