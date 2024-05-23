import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import MapPlaceholder from "../MapPlaceholder/MapPlaceholder";
import { useHistory } from "react-router-dom";
import RestaurantSearch from "../RestaurantSearch/RestaurantSearch";

function UserHomePage(props) {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const [heading, setHeading] = useState("Functional Component");
  const user = useSelector((store) => store.user);
  const [groupPreferences, setGroupPreferences] = useState([]); // Add state for group preferences


  const handleClick = () => {
    const history = useHistory();
    history.push("/create-group");
  };

  useEffect(() => {
    setHeading(`Find a restaurant near ${user.home_metro}`)
    setGroupPreferences(user.home_metro);
    console.log(groupPreferences)
  }, []);

  return (
    <div>
      <h2>{heading}</h2>
      <MapPlaceholder />
      <RestaurantSearch
        groupPreferences={groupPreferences}
      />
      {console.log(user.home_metro, groupPreferences)}
      <div>
        <Button variant="contained" color="primary" onClick={handleClick}>
          Create a group
        </Button>
      </div>
    </div>
  );
}

export default UserHomePage;
