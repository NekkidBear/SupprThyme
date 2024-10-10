import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Typography,
  Box,
  Grid,
} from '@mui/material';

const UserPreferencesForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    state: '',
    zipCode: '',
    cuisineTypes: [],
    dietaryRestrictions: [],
    priceRange: '',
  });

  useEffect(() => {
    // Fetch user preferences when component mounts
    const fetchUserPreferences = async () => {
      try {
        const response = await axios.get(`/api/user_preferences/${user.id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching user preferences:', error);
      }
    };

    fetchUserPreferences();
  }, [user.id]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    const updatedList = checked
      ? [...formData[name], event.target.value]
      : formData[name].filter((item) => item !== event.target.value);
    setFormData({ ...formData, [name]: updatedList });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.put(`/api/user_preferences/${user.id}`, formData);
      // Dispatch an action to update user preferences in Redux store
      dispatch({ type: 'UPDATE_USER_PREFERENCES', payload: formData });
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Error updating user preferences:', error);
      alert('Failed to update preferences. Please try again.');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Update Your Preferences
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="City"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="State"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            fullWidth
            label="Zip Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Cuisine Types</InputLabel>
            <Select
              multiple
              name="cuisineTypes"
              value={formData.cuisineTypes}
              onChange={handleInputChange}
              renderValue={(selected) => selected.join(', ')}
            >
              {['Italian', 'Chinese', 'Mexican', 'Indian', 'Japanese'].map((cuisine) => (
                <MenuItem key={cuisine} value={cuisine}>
                  <Checkbox checked={formData.cuisineTypes.indexOf(cuisine) > -1} />
                  {cuisine}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <Typography variant="subtitle1">Dietary Restrictions</Typography>
            {['Vegetarian', 'Vegan', 'Gluten-Free', 'Dairy-Free'].map((restriction) => (
              <FormControlLabel
                key={restriction}
                control={
                  <Checkbox
                    checked={formData.dietaryRestrictions.includes(restriction)}
                    onChange={handleCheckboxChange}
                    name="dietaryRestrictions"
                    value={restriction}
                  />
                }
                label={restriction}
              />
            ))}
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Price Range</InputLabel>
            <Select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleInputChange}
            >
              <MenuItem value="$">$</MenuItem>
              <MenuItem value="$$">$$</MenuItem>
              <MenuItem value="$$$">$$$</MenuItem>
              <MenuItem value="$$$$">$$$$</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
        Update Preferences
      </Button>
    </Box>
  );
};

export default UserPreferencesForm;
