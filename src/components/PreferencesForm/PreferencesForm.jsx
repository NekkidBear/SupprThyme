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

  const handleMaxPriceRangeChange = (e) => {
    const value = e.target.value;
    setMaxPriceRangeState(value);
    dispatch(setMaxPriceRange(value));
  };

  const handleMeatPreferenceChange = (e) => {
    const value = e.target.value;
    setMeatPreferenceState(value);
    dispatch(setMeatPreference(value));
  };

  const handleReligiousRestrictionsChange = (e) => {
    const value = e.target.value;
    setReligiousRestrictionsState(value);
    dispatch(setReligiousRestrictions(value));
  };

  const handleAllergensChange = (selected) => {
    setSelectedAllergens(selected);
    dispatch(setAllergens(selected));
  };

  const handleCuisineTypesChange = (e) => {
    const value = e.target.value;
    setCuisineTypesState(value);
    dispatch(setCuisineTypes(value));
  };

  const handleMaxDistanceChange = (e) => {
    const value = e.target.value;
    setMaxDistanceState(value);
    dispatch(setMaxDistance(value));
  };

  const handleOpenNowChange = (e) => {
    const value = e.target.checked;
    setOpenNowState(value);
    dispatch(setOpenNow(value));
  };

  const handleAcceptsLargePartiesChange = (e) => {
    const value = e.target.checked;
    setAcceptsLargePartiesState(value);
    dispatch(setAcceptsLargeParties(value));
  };

  return (
    <form onSubmit={handleSubmit} data-testid="preferences-form">
      {error && <div data-testid="error-message">{error}</div>}
      <FormControl fullWidth margin="normal">
        <InputLabel id="max-price-range-label">Max Price Range</InputLabel>
        <Select
          labelId="max-price-range-label"
          value={max_price_range}
          onChange={handleMaxPriceRangeChange}
          data-testid="max-price-range-select"
        >
          {priceRangeOptions.map((option) => (
            <MenuItem key={option.id} value={option.id} data-testid={`price-range-option-${option.id}`}>
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
          onChange={handleMeatPreferenceChange}
          data-testid="meat-preference-select"
        >
          {meatPreferenceOptions.map((option) => (
            <MenuItem key={option.id} value={option.id} data-testid={`meat-preference-option-${option.id}`}>
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
          onChange={handleReligiousRestrictionsChange}
          data-testid="religious-restrictions-select"
        >
          {religiousRestrictionOptions.map((option) => (
            <MenuItem key={option.id} value={option.id} data-testid={`religious-restrictions-option-${option.id}`}>
              {option.restriction}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <AllergenSelect
        selectedAllergens={selectedAllergens}
        setSelectedAllergens={handleAllergensChange}
        allergenOptions={allergenOptions}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="cuisine-types-label">Cuisine Types</InputLabel>
        <Select
          labelId="cuisine-types-label"
          multiple
          value={cuisine_types}
          onChange={handleCuisineTypesChange}
          input={<OutlinedInput label="Cuisine Types" />}
          renderValue={(selected) =>
            selected
              .map((id) => {
                const selectedCuisine = cuisineOptions.find((option) => option.id === id);
                return selectedCuisine ? selectedCuisine.type : "";
              })
              .join(", ")
          }
          data-testid="cuisine-types-select"
        >
          {cuisineOptions.map((option) => (
            <MenuItem key={option.id} value={option.id} data-testid={`cuisine-types-option-${option.id}`}>
              <Checkbox checked={cuisine_types.includes(option.id)} />
              <ListItemText primary={option.type} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Max Distance"
        type="number"
        value={max_distance}
        onChange={handleMaxDistanceChange}
        data-testid="max-distance-input"
      />

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={open_now}
              onChange={handleOpenNowChange}
              data-testid="open-now-checkbox"
            />
          }
          label="Open Now"
        />
        <FormControlLabel
          control={
            <Switch
              checked={accepts_large_parties}
              onChange={handleAcceptsLargePartiesChange}
              data-testid="accepts-large-parties-checkbox"
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
    </form>
  );
};

export default UserPreferencesForm;
