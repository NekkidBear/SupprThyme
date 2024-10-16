import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Grid, Stack, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";
import RestaurantSearch from "../RestaurantSearch/RestaurantSearch";
import RestaurantMap from "../MapPlaceholder/RestaurantMap";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  map: {
    height: '400px',
    width: '100%',
    marginBottom: theme.spacing(3),
  },
  buttons: {
    marginTop: theme.spacing(2),
  },
}));

const HomePage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [heading, setHeading] = useState("Find a Restaurant Near You");
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState(null);

  useEffect(() => {
    if (user.city && user.state) {
      setHeading(`Find a restaurant near ${user.city}, ${user.state}`);
    }

    // Cleanup function to clear restaurants when component unmounts
    return () => {
      dispatch({ type: "CLEAR_RESTAURANTS" });
    };
  }, [user, dispatch]);

  const handleLocationSelect = (location) => {
    setSelectedLocation(location);
  };

  const handleClickCreateGroup = () => {
    navigate("/groupForm");
  };

  const handleClickViewGroups = () => {
    navigate("/groups");
  };

  return (
    <Container className={classes.root}>
      <Typography variant="h2" align="center" gutterBottom>
        {heading}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <div className={classes.map}>
            <RestaurantMap center={selectedLocation} zoom={14} />
          </div>
        </Grid>
        <Grid item xs={12} md={9}>
          <RestaurantSearch onLocationSelect={handleLocationSelect} />
        </Grid>
        <Grid item xs={12} md={3}>
          <Stack spacing={2} className={classes.buttons}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClickCreateGroup}
              fullWidth
            >
              Create a group
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleClickViewGroups}
              fullWidth
            >
              View groups
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;
