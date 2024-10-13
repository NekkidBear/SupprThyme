import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  CircularProgress,
} from '@mui/material';

const RestaurantDetail = () => {
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { restaurantId } = useParams();

  useEffect(() => {
    const fetchRestaurantDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/restaurants/${restaurantId}`);
        setRestaurant(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch restaurant details. Please try again.');
        console.error('Error fetching restaurant details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurantDetails();
  }, [restaurantId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  if (!restaurant) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Restaurant not found.</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Card>
        {restaurant.image_url && (
          <CardMedia
            component="img"
            height="200"
            image={restaurant.image_url}
            alt={restaurant.name}
          />
        )}
        <CardContent>
          <Typography variant="h4" gutterBottom>{restaurant.name}</Typography>
          <Typography variant="body1" paragraph>Rating: {restaurant.rating} / 5</Typography>
          <Typography variant="body1" paragraph>Price: {restaurant.price_level}</Typography>
          <Typography variant="body1" paragraph>Address: {restaurant.address}</Typography>
          {restaurant.phone && (
            <Typography variant="body1" paragraph>Phone: {restaurant.phone}</Typography>
          )}
          {restaurant.website && (
            <Typography variant="body1" paragraph>
              Website: <a href={restaurant.website} target="_blank" rel="noopener noreferrer">{restaurant.website}</a>
            </Typography>
          )}
          {restaurant.cuisine_types && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>Cuisine Types:</Typography>
              {restaurant.cuisine_types.map((cuisine, index) => (
                <Chip key={index} label={cuisine} style={{ margin: '0 4px 4px 0' }} />
              ))}
            </Box>
          )}
          {restaurant.hours && (
            <Box mt={2}>
              <Typography variant="h6" gutterBottom>Hours:</Typography>
              {restaurant.hours.map((day, index) => (
                <Typography key={index} variant="body2">{day}</Typography>
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default RestaurantDetail;
