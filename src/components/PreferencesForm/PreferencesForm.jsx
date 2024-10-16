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
import { find } from "lodash";

const UserPreferencesForm = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  // State variables
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [max_price_range, setMaxPriceRange] = useState("");
  const [meat_preference, setMeatPreference] = useState("");
  const [religious_restrictions, setReligiousRestrictions] = useState("");
  const [cuisine_types, setCuisineTypes] = useState([]);
  const [max_distance, setMaxDistance] = useState("");
  const [open_now, setOpenNow] = useState(true);
  const [accepts_large_parties, setAcceptsLargeParties] = useState(true);

  const [allergenOptions, setAllergenOptions] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [priceRangeOptions, setPriceRangeOptions] = useState([]);
  const [meatPreferenceOptions, setMeatPreferenceOptions] = useState([]);
  const [religiousRestrictionOptions, setReligiousRestrictionsOptions] = useState([]);

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

    dispatch({
      type: 'UPDATE_PREFERENCES',
      payload: preferencesData,
    });

    if (onSubmit) {
      onSubmit(preferencesData);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="max-price-range-label">Max Price Range</InputLabel>
        <Select
          labelId="max-price-range-label"
          value={max_price_range}
          onChange={(e) => setMaxPriceRange(e.target.value)}
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
          onChange={(e) => setMeatPreference(e.target.value)}
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
          onChange={(e) => setReligiousRestrictions(e.target.value)}
        >
          {religiousRestrictionOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              {option.restriction}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <AllergenSelect
        selectedAllergens={selectedAllergens}
        setSelectedAllergens={setSelectedAllergens}
        allergenOptions={allergenOptions}
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="cuisine-types-label">Cuisine Types</InputLabel>
        <Select
          labelId="cuisine-types-label"
          multiple
          value={cuisine_types}
          onChange={(e) => setCuisineTypes(e.target.value)}
          input={<OutlinedInput label="Cuisine Types" />}
          renderValue={(selected) =>
            selected
              .map((id) => {
                const selectedCuisine = cuisineOptions.find((option) => option.id === id);
                return selectedCuisine ? selectedCuisine.type : "";
              })
              .join(", ")
          }
        >
          {cuisineOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
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
        onChange={(e) => setMaxDistance(e.target.value)}
      />

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={open_now}
              onChange={(e) => setOpenNow(e.target.checked)}
            />
          }
          label="Open Now"
        />
        <FormControlLabel
          control={
            <Switch
              checked={accepts_large_parties}
              onChange={(e) => setAcceptsLargeParties(e.target.checked)}
            />
          }
          label="Accepts Large Parties"
        />
      </FormGroup>

      <Button type="submit" variant="contained" color="primary">
        Save Preferences
      </Button>
    </form>
  );
};

export default UserPreferencesForm;
