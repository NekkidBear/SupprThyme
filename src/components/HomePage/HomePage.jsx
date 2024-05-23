import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import MapPlaceholder from "../MapPlaceholder/MapPlaceholder";
import { useHistory } from "react-router-dom";
import RestaurantSearch from "../RestaurantSearch/RestaurantSearch";

function UserHomePage(props) {
  const [heading, setHeading] = useState(`Find a Restaurant Near ${user.city}, ${user.state}`);
  const user = useSelector((store) => store.user);
  const [groupPreferences, setGroupPreferences] = useState([]);
  
  const history = useHistory();

  const handleClick = () => {
    history.push("/create-group");
  };

  useEffect(() => {
    if (user && user.address) {
      setHeading(`Find a restaurant near ${user.address.city}, ${user.address.state}`);
      setGroupPreferences([user.address.city, user.address.state]);
      console.log(user.address);
      console.log(user.home_metro, groupPreferences);
    }
  }, [user]);

  const aggregatePreferences = {
    city: user?.address?.city,
    state: user?.address?.state
  };

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