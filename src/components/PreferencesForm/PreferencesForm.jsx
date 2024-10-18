import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Typography } from '@mui/material';
import AllergenSelect from './AllergenSelect';
import { updatePreferences } from '../../redux/actions/PreferencesForm.actions';

const UserPreferencesForm = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const [formData, setFormData] = useState({
    maxPriceRange: '',
    meatPreference: '',
    religiousRestrictions: '',
    allergens: [],
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (user.preferences) {
      setFormData(user.preferences);
    }
  }, [user.preferences]);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleAllergenChange = (selectedAllergens) => {
    setFormData({ ...formData, allergens: selectedAllergens });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      await dispatch(updatePreferences(formData));
    } catch (err) {
      setError('Error updating preferences. Please try again.');
    }
  };

  const priceRangeOptions = [
    { value: '1', label: '$' },
    { value: '2', label: '$$' },
    { value: '3', label: '$$$' },
    { value: '4', label: '$$$$' },
  ];

  const meatPreferenceOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'pescatarian', label: 'Pescatarian' },
    { value: 'no_preference', label: 'No Preference' },
  ];

  const religiousRestrictionOptions = [
    { value: 'halal', label: 'Halal' },
    { value: 'kosher', label: 'Kosher' },
    { value: 'none', label: 'None' },
  ];

  return (
    <form onSubmit={handleSubmit} data-testid="preferences-form">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="max-price-range-label">Max Price Range *</InputLabel>
            <Select
              labelId="max-price-range-label"
              id="max-price-range"
              name="maxPriceRange"
              value={formData.maxPriceRange}
              onChange={handleChange}
              required
              data-testid="max-price-range-select"
            >
              {priceRangeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="meat-preference-label">Meat Preference *</InputLabel>
            <Select
              labelId="meat-preference-label"
              id="meat-preference"
              name="meatPreference"
              value={formData.meatPreference}
              onChange={handleChange}
              required
              data-testid="meat-preference-select"
            >
              {meatPreferenceOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="religious-restrictions-label">Religious Restrictions</InputLabel>
            <Select
              labelId="religious-restrictions-label"
              id="religious-restrictions"
              name="religiousRestrictions"
              value={formData.religiousRestrictions}
              onChange={handleChange}
              data-testid="religious-restrictions-select"
            >
              {religiousRestrictionOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <AllergenSelect
            selectedAllergens={formData.allergens}
            onChange={handleAllergenChange}
          />
        </Grid>
      </Grid>
      {error && <Typography color="error" data-testid="error-message">{error}</Typography>}
      <Button type="submit" variant="contained" color="primary" data-testid="save-preferences-button">
        Save Preferences
      </Button>
    </form>
  );
};

export default UserPreferencesForm;
