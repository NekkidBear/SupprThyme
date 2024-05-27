import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";

const RestaurantSearch = ({ user, searchParams, group_id }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        let response;
        if (group_id) {
          // Fetch the preferences of each user in the group
          const groupResponse = await axios.get(`/api/groups/${group_id}`);
          const users = groupResponse.data.users;
          const preferences = await Promise.all(
            users.map((user) => axios.get(`/api/users/${user.id}/preferences`))
          );

          // Aggregate the preferences
          const aggregatePreferences = preferences.reduce(
            (aggregate, current) => {
              if (!current.data) {
                // Skip this user if they have not defined preferences
                return aggregate;
              }

              // For price range and max distance, find the maximum value that is less than or equal to the lowest maximum value
              aggregate.max_price_range = Math.min(
                aggregate.max_price_range || Infinity,
                current.data.max_price_range
              );
              aggregate.max_distance = Math.min(
                aggregate.max_distance || Infinity,
                current.data.max_distance
              );

              // For meat preference, check if a restaurant offers vegetarian/vegan options if a user prefers it
              if (
                current.data.meat_preference === "Vegetarian" ||
                current.data.meat_preference === "Vegan"
              ) {
                aggregate.meat_preference = "Vegetarian/Vegan";
              }

              // For cuisine types, use distinct items
              aggregate.cuisine_types = [
                ...new Set([
                  ...(aggregate.cuisine_types || []),
                  ...current.data.cuisine_types,
                ]),
              ];

              // For open now, calculate based on their local time vs the days/hours listed in the database
              aggregate.open_now = aggregate.open_now && current.data.open_now;

              // For accepts large parties, default to true
              aggregate.accepts_large_parties =
                aggregate.accepts_large_parties &&
                current.data.accepts_large_parties;

              // For city and state, use the city and state of the first user
              // This assumes that all users in the group are in the same location
              if (!aggregate.city) {
                aggregate.city = users[0].city;
              }
              if (!aggregate.state) {
                aggregate.state = users[0].state;
              }

              return aggregate;
            },
            {}
          );

          // Fetch restaurants based on the aggregate preferences
          const params = new URLSearchParams({
            aggregatePreferences: JSON.stringify(aggregatePreferences),
          }).toString();
          response = await axios.get(`/api/restaurants/search?${params}`);
        } else if (searchParams) {
          // Fetch restaurants based on the user's preferences
          const params = new URLSearchParams({
            ...searchParams,
          }).toString();
          response = await axios.get(`/api/restaurants/search?${params}`);
        } else {
          const userLocationString = `${user.city}, ${user.state}`;
          const params = new URLSearchParams({
            userLocationString: userLocationString,
          }).toString();
          response = await axios.get(`/api/restaurants/popular?${params}`);
        }

        setRestaurants(response.data);
        // Dispatch the SET_RESTAURANTS action
        dispatch({ type: "SET_RESTAURANTS", payload: response.data });
      } catch (error) {
        console.error("Error fetching restaurants:", error);
        setError("Error fetching restaurants. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [searchParams, dispatch, group_id, user]);

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
