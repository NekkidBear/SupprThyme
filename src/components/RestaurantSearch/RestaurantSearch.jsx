import React, { useState, useEffect } from "react";
import axios from "axios";

const RestaurantSearch = ({ searchParams }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        let response;
        if (searchParams) {
          const params = new URLSearchParams({
            ...Object.entries(searchParams),
            aggregatePreferences: JSON.stringify(searchParams),
          }).toString();
          response = await axios.get(`/api/restaurants/search?${params}`);
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
  }, [searchParams]);

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
