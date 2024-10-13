import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import {
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from '@mui/material';

const VotingInterface = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { groupId } = useParams();
  const history = useHistory();

  useEffect(() => {
    fetchRestaurantsAndVotes();
  }, [groupId]);

  const fetchRestaurantsAndVotes = async () => {
    try {
      setLoading(true);
      const [restaurantsResponse, votesResponse] = await Promise.all([
        axios.get(`/api/restaurants/search?groupId=${groupId}`),
        axios.get(`/api/votes/${groupId}`)
      ]);
      setRestaurants(restaurantsResponse.data);
      const votesMap = votesResponse.data.reduce((acc, vote) => {
        acc[vote.restaurant_id] = vote.vote_count;
        return acc;
      }, {});
      setVotes(votesMap);
      setError(null);
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (restaurantId) => {
    try {
      await axios.post('/api/votes', { groupId, restaurantId });
      // Update local state to reflect the new vote
      setVotes(prevVotes => ({
        ...prevVotes,
        [restaurantId]: (prevVotes[restaurantId] || 0) + 1
      }));
    } catch (err) {
      setError('Failed to submit vote. Please try again.');
    }
  };

  const handleRestaurantClick = (restaurantId) => {
    history.push(`/restaurant/${restaurantId}`);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const sortedRestaurants = [...restaurants].sort((a, b) => 
    (votes[b.id] || 0) - (votes[a.id] || 0)
  );

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Vote for a Restaurant</Typography>
      <Grid container spacing={2}>
        {sortedRestaurants.map((restaurant) => (
          <Grid item xs={12} sm={6} md={4} key={restaurant.id}>
            <Card>
              <CardContent onClick={() => handleRestaurantClick(restaurant.id)} style={{ cursor: 'pointer' }}>
                <Typography variant="h6">{restaurant.name}</Typography>
                <Typography>Rating: {restaurant.rating}</Typography>
                <Typography>Price Level: {restaurant.price_level}</Typography>
                <Typography>Address: {restaurant.address}</Typography>
                <Typography variant="h6" color="primary">
                  Votes: {votes[restaurant.id] || 0}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVote(restaurant.id);
                  }}
                >
                  Vote
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box mt={4}>
        <Typography variant="h5" gutterBottom>Voting Summary</Typography>
        {sortedRestaurants.map((restaurant) => (
          <Typography key={restaurant.id}>
            {restaurant.name}: {votes[restaurant.id] || 0} votes
          </Typography>
        ))}
      </Box>
    </Box>
  );
};

export default VotingInterface;
