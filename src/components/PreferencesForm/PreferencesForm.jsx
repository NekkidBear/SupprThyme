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
import axios from "axios";
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
} from '../../redux/actions/PreferencesForm.actions.js';

const UserPreferencesForm = ({ onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const preferences = useSelector((store) => store.preferences);

  // State variables
  const [selectedAllergens, setSelectedAllergens] = useState(preferences.allergens);
  const [max_price_range, setMaxPriceRangeState] = useState(preferences.max_price_range);
  const [meat_preference, setMeatPreferenceState] = useState(preferences.meat_preference);
  const [religious_restrictions, setReligiousRestrictionsState] = useState(preferences.religious_restrictions);
  const [cuisine_types, setCuisineTypesState] = useState(preferences.cuisine_types);
  const [max_distance, setMaxDistanceState] = useState(preferences.max_distance);
  const [open_now, setOpenNowState] = useState(preferences.open_now);
  const [accepts_large_parties, setAcceptsLargePartiesState] = useState(preferences.accepts_large_parties);

  const [allergenOptions, setAllergenOptions] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [priceRangeOptions, setPriceRangeOptions] = useState([]);
  const [meatPreferenceOptions, setMeatPreferenceOptions] = useState([]);
  const [religiousRestrictionOptions, setReligiousRestrictionsOptions] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [
          priceRanges,
          meatPreferences,
          religiousOptions,
          allergenOpts,
          cuisineOpts,
        ] = await Promise.all([
          axios.get("/api/form_data/price-ranges"),
          axios.get("/api/form_data/meat-preferences"),
          axios.get("/api/form_data/religious-options"),
          axios.get("/api/form_data/allergen-options"),
          axios.get("/api/form_data/cuisine-options"),
        ]);

        setPriceRangeOptions(priceRanges.data);
        setMeatPreferenceOptions(meatPreferences.data);
        setReligiousRestrictionsOptions(religiousOptions.data);
        setAllergenOptions(allergenOpts.data);
        setCuisineOptions(cuisineOpts.data);
      } catch (error) {
        console.error("Error fetching options:", error);
        setError("Error fetching options. Please try again later.");
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const preferencesData = {
      user_id: user.id,
      max_price_range,
      meat_preference,
      religious_restrictions,
      allergens: selectedAllergens,
      cuisine_types,
      max_distance,
      open_now,
      accepts_large_parties,
    };

    dispatch(updatePreferences(preferencesData));

    if (onSubmit) {
      onSubmit(preferencesData);
    }
  };

  const handleCancel = () => {
    // Reset the form to its initial state or perform any other action
    setSelectedAllergens([]);
    setMaxPriceRangeState("");
    setMeatPreferenceState("");
    setReligiousRestrictionsState("");
    setCuisineTypesState([]);
    setMaxDistanceState("");
    setOpenNowState(true);
    setAcceptsLargePartiesState(true);

    // Dispatch the reset action
    dispatch(resetPreferencesForm());

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
          value={max_price_range}
          onChange={(e) => setMaxPriceRangeState(e.target.value)}
          data-testid="max-price-range-select"
        >
          {priceRangeOptions.map((option) => (
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
          value={meat_preference}
          onChange={(e) => setMeatPreferenceState(e.target.value)}
          data-testid="meat-preference-select"
        >
          {meatPreferenceOptions.map((option) => (
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
          value={religious_restrictions}
          onChange={(e) => setReligiousRestrictionsState(e.target.value)}
          data-testid="religious-restrictions-select"
        >
          {religiousRestrictionOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.restriction}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Max Distance"
        value={max_distance}
        onChange={(e) => setMaxDistanceState(e.target.value)}
        fullWidth
        margin="normal"
        data-testid="max-distance-input"
      />

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={open_now}
              onChange={(e) => setOpenNowState(e.target.checked)}
              data-testid="open-now-switch"
            />
          }
          label="Open Now"
        />
        <FormControlLabel
          control={
            <Switch
              checked={accepts_large_parties}
              onChange={(e) => setAcceptsLargePartiesState(e.target.checked)}
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
