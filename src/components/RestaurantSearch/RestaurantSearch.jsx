import React, { useState, useEffect } from "react";
import axios from "axios";
import { useStore } from "react-redux";

const RestaurantSearch = ({ groupPreferences }) => {
  const user = useStore((store) => store.user);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        let response;
        if (user && user.address && user.address.city && user.address.state) {
          const userCity = user?.address?.city;
          const userState = user?.address?.state;
          if (user.groupPreferences) {
            const aggregatePreferences = JSON.stringify(groupPreferences);
            response = await axios.get(
              `/api/restaurants/search?aggregatePreferences=${encodeURIComponent(
                aggregatePreferences
              )}`
            );
          } else {
            response = await axios.get(
              `/api/restaurants/search?city=${encodeURIComponent(userCity)}&state=${encodeURIComponent(userState)}`
            );
          }
          setRestaurants(response.data);
        }
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Error fetching restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [groupPreferences, user?.address?.city, user?.address?.state]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

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