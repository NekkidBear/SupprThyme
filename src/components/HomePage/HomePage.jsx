import React, { useEffect, useState } from "react";
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Button } from "@mui/material";
import MapPlaceholder from "../MapPlaceholder/MapPlaceholder";
import { useHistory } from "react-router-dom";
import RestaurantSearch from "../RestaurantSearch/RestaurantSearch";

function UserHomePage() {
  const user = useSelector((store) => store.user);
  const [heading, setHeading] = useState('Find a Restaurant');
  const [loading, setLoading] = useState(true); // Add this line
  const history = useHistory();

  useEffect(() => {
    // Fetch user data when the component mounts
    axios.get(`/api/user/${user.id}`)
      .then(response => {
        setHeading(`Find a Restaurant Near ${response.data.city}, ${response.data.state}`);
        setLoading(false); // Add this line
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        setLoading(false); // Add this line
      });
  }, [user.id]);

  const handleClick = () => {
    history.push("/create-group");
  };

  const aggregatePreferences = user ? {
    city: user.city,
    state: user.state,
    id: user.id
  } : {};

  if (loading) { // Add this block
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{heading}</h2>
      <MapPlaceholder />
      <RestaurantSearch searchParams={aggregatePreferences} />
      <div>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Create a group
        </Button>
      </div>
    </div>
  );
}

export default UserHomePage;