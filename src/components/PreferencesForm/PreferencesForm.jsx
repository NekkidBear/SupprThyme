import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from "@mui/material";
import AllergenSelect from "./AllergenSelect";
import {
  resetPreferencesForm,
  setMaxPriceRange,
  setMeatPreference,
  setReligiousRestrictions,
  setAllergens,
  setCuisineTypes,
  setMaxDistance,
  setOpenNow,
  setAcceptsLargeParties,
  updatePreferences,
  fetchPriceRanges,
  fetchMeatPreferences,
  fetchReligiousRestrictions,
  fetchAllergenOptions,
  fetchCuisineOptions,
} from '../../redux/actions/PreferencesForm.actions.js';

const UserPreferencesForm = ({ onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const preferences = useSelector((store) => store.preferences);

  // State variables
  const [selectedAllergens, setSelectedAllergens] = useState(preferences.allergens);
  const [maxPriceRange, setMaxPriceRange] = useState(preferences.max_price_range);
  const [meatPreference, setMeatPreference] = useState(preferences.meat_preference);
  const [religiousRestrictions, setReligiousRestrictions] = useState(preferences.religious_restrictions);
  const [cuisineTypes, setCuisineTypes] = useState(preferences.cuisine_types);
  const [maxDistance, setMaxDistance] = useState(preferences.max_distance);
  const [openNow, setOpenNow] = useState(preferences.open_now);
  const [acceptsLargeParties, setAcceptsLargeParties] = useState(preferences.accepts_large_parties);

  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch options when the component mounts
    dispatch(fetchPriceRanges());
    dispatch(fetchMeatPreferences());
    dispatch(fetchReligiousRestrictions());
    dispatch(fetchAllergenOptions());
    dispatch(fetchCuisineOptions());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const preferencesData = {
      user_id: user.id,
      max_price_range: maxPriceRange,
      meat_preference: meatPreference,
      religious_restrictions: religiousRestrictions,
      allergens: selectedAllergens,
      cuisine_types: cuisineTypes,
      max_distance: maxDistance,
      open_now: openNow,
      accepts_large_parties: acceptsLargeParties,
    };

    try {
      await dispatch(updatePreferences(preferencesData));
      // If the submission is successful, call the onSubmit callback
      if (onSubmit) {
        onSubmit(preferencesData);
      }
    } catch (error) {
      // Handle error, e.g., display an error message
      setError('Failed to update preferences. Please try again later.');
    }
  };

  const handleCancel = () => {
    // Reset the form to its initial state
    dispatch(resetPreferencesForm());

    // If the cancellation is successful, call the onCancel callback
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="preferences-form">
      <FormControl fullWidth margin="normal">
        <InputLabel id="max-price-range-label">Max Price Range</InputLabel>
        <Select
          labelId="max-price-range-label"
          value={maxPriceRange}
          onChange={(e) => dispatch(setMaxPriceRange(e.target.value))}
          data-testid="max-price-range-select"
        >
          {preferences.priceRangeOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.range}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="meat-preference-label">Meat Preference</InputLabel>
        <Select
          labelId="meat-preference-label"
          value={meatPreference}
          onChange={(e) => dispatch(setMeatPreference(e.target.value))}
          data-testid="meat-preference-select"
        >
          {preferences.meatPreferenceOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.preference}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="religious-restrictions-label">Religious Restrictions</InputLabel>
        <Select
          labelId="religious-restrictions-label"
          value={religiousRestrictions}
          onChange={(e) => dispatch(setReligiousRestrictions(e.target.value))}
          data-testid="religious-restrictions-select"
        >
          {preferences.religiousRestrictionOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.restriction}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <AllergenSelect
        selectedAllergens={selectedAllergens}
        setSelectedAllergens={(allergens) => dispatch(setAllergens(allergens))}
        allergenOptions={preferences.allergenOptions}
      />

      {/* Cuisine type select (similar to AllergenSelect) */}
      <FormControl fullWidth margin="normal">
        <InputLabel id="cuisine-types-label">Cuisine Types</InputLabel>
        <Select
          labelId="cuisine-types-label"
          multiple
          value={cuisineTypes}
          onChange={(e) => dispatch(setCuisineTypes(e.target.value))}
          input={<OutlinedInput label="Cuisine Types" />}
          data-testid="cuisine-types-select"
          renderValue={(selected) =>
            selected
              .map((cuisineTypeId) =>
                preferences.cuisineOptions.find((c) => c.id === cuisineTypeId)?.type
              )
              .join(', ')
          }
        >
          {preferences.cuisineOptions.map((cuisine) => (
            <MenuItem key={cuisine.id} value={cuisine.id}>
              <Checkbox checked={cuisineTypes.includes(cuisine.id)} />
              <ListItemText primary={cuisine.type} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Max Distance"
        value={maxDistance}
        onChange={(e) => dispatch(setMaxDistance(e.target.value))}
        fullWidth
        margin="normal"
        data-testid="max-distance-input"
      />

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={openNow}
              onChange={(e) => dispatch(setOpenNow(e.target.checked))}
              data-testid="open-now-switch"
            />
          }
          label="Open Now"
        />
        <FormControlLabel
          control={
            <Switch
              checked={acceptsLargeParties}
              onChange={(e) => dispatch(setAcceptsLargeParties(e.target.checked))}
              data-testid="accepts-large-parties-switch"
            />
          }
          label="Accepts Large Parties"
        />
      </FormGroup>

      <Button type="submit" variant="contained" color="primary" data-testid="save-preferences-button">
        Save Preferences
      </Button>
      <Button type="button" variant="contained" color="secondary" onClick={handleCancel} data-testid="cancel-button">
        Cancel
      </Button>
      {error && <div data-testid="error-message">{error}</div>}
    </form>
  );
};

export default UserPreferencesForm;
