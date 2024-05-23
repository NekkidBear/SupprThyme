import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStore } from "react-redux";

const RestaurantSearch = ({  groupPreferences }) => {
  const user = useStore((store) => store.user);
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        let response;
        const userCity = user.address.city;
        const userState = user.address.state;

        if (user.groupPreferences) {
          // Search based on group preferences
          const aggregatePreferences = JSON.stringify(groupPreferences);
          response = await axios.get(
            `/api/restaurants/search?aggregatePreferences=${encodeURIComponent(
              aggregatePreferences
            )}`
          );
        } else {
          // Search based on user's home city and state
          response = await axios.get(
            `/api/restaurants/search?city=${encodeURIComponent(
              userCity
            )}&state=${encodeURIComponent(userState)}`
          );
        }

        setRestaurants(response.data);
      } catch (error) {
        console.error("Error fetching restaurants:", error);
      }
    };

    fetchRestaurants();
  }, [groupPreferences, user.address.city, user.address.state]);

  return (
    <div>
      <h2>Restaurant Results</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <h3>{restaurant.name}</h3>
            <p>Rating: {restaurant.rating}</p>
            <p>Price Level: {restaurant.price_level}</p>
            <p>Location: {restaurant.location_string}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantSearch;
