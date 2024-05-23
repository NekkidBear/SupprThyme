import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RestaurantSearch = ({ userHomeMetro, groupPreferences }) => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        let response;
        if (groupPreferences) {
          // Search based on group preferences
          const aggregatePreferences = JSON.stringify(groupPreferences);
          response = await axios.get(`/api/restaurants/search?aggregatePreferences=${encodeURIComponent(aggregatePreferences)}`);
        } else {
          // Search based on user's home metro
          response = await axios.get(`/api/restaurants?location=${userHomeMetro}`);
        }
        setRestaurants(response.data);
      } catch (error) {
        console.error('Error fetching restaurants:', error);
      }
    };

    fetchRestaurants();
  }, [userHomeMetro, groupPreferences]);

  return (
    <div>
      <h2>Restaurant Search Results</h2>
      <ul>
        {restaurants.map((restaurant) => (
          <li key={restaurant.id}>
            <h3>{restaurant.name}</h3>
            <p>Rating: {restaurant.ranking_postion}</p>
            <p>Price Level: {restaurant.price_level}</p>
            <p>Address: {restaurant.address}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantSearch;