import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';

export default function GroupSearchResults() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { groupId } = useParams();
  const history = useHistory();

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/restaurants/search?groupId=${groupId}`);
        setResults(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to fetch search results. Please try again.');
        console.error('Error fetching search results:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [groupId]);

  const handleStartVoting = () => {
    history.push(`/voting/${groupId}`);
  };

  const handleRestaurantClick = (restaurantId) => {
    history.push(`/restaurant/${restaurantId}`);
  };

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

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        Group Search Results
      </Typography>
      <Grid container spacing={3}>
        {results.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <Card onClick={() => handleRestaurantClick(restaurant.id)} style={{ cursor: 'pointer' }}>
              <CardContent>
                <Typography variant="h6">{restaurant.name}</Typography>
                <Typography>Rating: {restaurant.rating}</Typography>
                <Typography>Price Level: {restaurant.price_level}</Typography>
                <Typography>Address: {restaurant.address}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {results.length > 0 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={handleStartVoting}>
            Start Voting
          </Button>
        </Box>
      )}
    </Box>
  );
}
