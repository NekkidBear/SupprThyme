import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import RestaurantSearch from "../RestaurantSearch/RestaurantSearch";
import RestaurantMap from "../MapPlaceholder/RestaurantMap";

function UserHomePage() {
  const user = useSelector((store) => store.user);
  const [heading, setHeading] = useState("Find a Restaurant");
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const [aggregatePreferences, setAggregatePreferences] = useState({});
  const [restaurants, setRestaurants] = useState([]);
  const [center, setCenter] = useState({ lat: 0, lng: 0 });
  const [zoom, setZoom] = useState(10);

  useEffect(() => {
    axios
      .get(`/api/user/${user.id}`)
      .then((response) => {
        setHeading(
          `Find a Restaurant Near ${response.data.city}, ${response.data.state}`
        );
        setAggregatePreferences({
          city: response.data.city,
          state: response.data.state,
          id: user.id,
        });
        setCenter({ lat: response.data.latitude, lng: response.data.longitude });
        setRestaurants(response.data.restaurants);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setLoading(false);
      });
  }, [user.id]);

  const handleClick = () => {
    history.push("/create-group");
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{heading}</h2>
      <RestaurantMap
        restaurants={restaurants}
        center={center}
        zoom={zoom}
      />
      {!loading && (
        <RestaurantSearch searchParams={aggregatePreferences} />
      )}{" "}
      <div>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Create a group
        </Button>
      </div>
    </div>
  );
}

export default UserHomePage;