import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import MapPlaceholder from "../MapPlaceholder/MapPlaceholder";
import { useHistory } from "react-router-dom";
import RestaurantSearch from "../RestaurantSearch/RestaurantSearch";

function UserHomePage() {
  const user = useSelector((store) => store.user);
  const [heading, setHeading] = useState("Find a Restaurant");
  const [loading, setLoading] = useState(true); // Add this line
  const history = useHistory();
  const [aggregatePreferences, setAggregatePreferences] = useState({});

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
    // Add this block
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{heading}</h2>
      <MapPlaceholder />
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
