import React, { useState, useEffect } from "react";
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
import AllergenSelect from "./AllergenSelect"; // Import the AllergenSelect component

const UserPreferencesForm = () => {
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [maxPriceRange, setMaxPriceRange] = useState("");
  const [meatPreference, setMeatPreference] = useState("");
  const [religiousRestrictions, setReligiousRestrictions] = useState("");
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [maxDistance, setMaxDistance] = useState("");
  const [openNow, setOpenNow] = useState(true);
  const [acceptsLargeParties, setAcceptsLargeParties] = useState(true);
  const [allergenOptions, setAllergenOptions] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [priceRangeOptions, setPriceRangeOptions] = useState([]);
  const [meatPreferenceOptions, setMeatPreferenceOptions] = useState([]);
  const [religiousRestrictionOptions, setReligiousRestrictionsOptions] =
    useState([]);

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
        console.error("Error fetching form options:", error);
      }
    };

    fetchOptions();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const preferencesData = {
      maxPriceRange,
      meatPreference,
      religiousRestrictions,
      allergens: selectedAllergens,
      cuisineTypes,
      maxDistance,
      openNow,
      acceptsLargeParties,
    };

    try {
      await axios.post("/api/user_preferences", preferencesData);
      alert("Preferences saved successfully");
    } catch (error) {
      console.error("Error saving preferences:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl fullWidth margin="normal">
        <InputLabel id="max-price-range-label">Max Price Range</InputLabel>
        <Select
          labelId="max-price-range-label"
          value={maxPriceRange}
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
          value={meatPreference}
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
        <InputLabel id="religious-restrictions-label">
          Religious Restrictions
        </InputLabel>
        <Select
          labelId="religious-restrictions-label"
          value={religiousRestrictions}
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
        allergenOptions={allergenOptions} // Pass options to AllergenSelect
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="cuisine-types-label">Cuisine Types</InputLabel>
        <Select
          labelId="cuisine-types-label"
          multiple
          value={cuisineTypes}
          onChange={(e) => setCuisineTypes(e.target.value)}
          input={<OutlinedInput label="Cuisine Types" />}
          renderValue={(selected) =>
            selected
              .map((id) => {
                const selectedCuisine = cuisineOptions.find(
                  (option) => option.id === id
                );
                return selectedCuisine ? selectedCuisine.type : "";
              })
              .join(", ")
          }
        >
          {cuisineOptions.map((option) => (
            <MenuItem key={option.id} value={option.id}>
              <Checkbox checked={cuisineTypes.includes(option.type)} />
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
        value={maxDistance}
        onChange={(e) => setMaxDistance(e.target.value)}
      />

      <FormGroup>
        <FormControlLabel
          control={
            <Switch
              checked={openNow}
              onChange={(e) => setOpenNow(e.target.checked)}
            />
          }
          label="Open Now"
        />
        <FormControlLabel
          control={
            <Switch
              checked={acceptsLargeParties}
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
