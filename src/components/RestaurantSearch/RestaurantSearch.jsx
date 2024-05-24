import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

const RestaurantSearch = ({ user, searchParams }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        let response;
        console.log(searchParams)
        if (searchParams) {
          const updatedSearchParams = {
            ...searchParams,
            city: searchParams.city,
            state: searchParams.state,
          };
          console.log(updatedSearchParams);
          const userLocationString = `${updatedSearchParams.city}, ${updatedSearchParams.state}`;
          const params = new URLSearchParams({
            aggregatePreferences: JSON.stringify(updatedSearchParams),
            userLocationString: userLocationString
          }).toString();
          response = await axios.get(`/api/restaurants/search?${params}`);
          console.log(response.data)
          setRestaurants(response.data);
        }
        // Dispatch the SET_RESTAURANTS action
        dispatch({ type: 'SET_RESTAURANTS', payload: response.data });

      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Error fetching restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, [searchParams, dispatch]);

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