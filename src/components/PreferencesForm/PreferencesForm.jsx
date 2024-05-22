import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Button,
  FormGroup,
  FormControlLabel,
  Switch,
  TextField,
} from "@mui/material";
import axios from "axios";
import AllergenSelect from './AllergenSelect';  // Import the AllergenSelect component

const UserPreferencesForm = () => {
  const [selectedAllergens, setSelectedAllergens] = useState([]);
  const [maxPriceRange, setMaxPriceRange] = useState("");
  const [meatPreference, setMeatPreference] = useState("");
  const [religiousRestrictions, setReligiousRestrictions] = useState("");
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [maxDistance, setMaxDistance] = useState("");
  const [openNow, setOpenNow] = useState(true);
  const [acceptsLargeParties, setAcceptsLargeParties] = useState(true);

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
          {/* Add your menu items here */}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="meat-preference-label">Meat Preference</InputLabel>
        <Select
          labelId="meat-preference-label"
          value={meatPreference}
          onChange={(e) => setMeatPreference(e.target.value)}
        >
          {/* Add your menu items here */}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="religious-restrictions-label">Religious Restrictions</InputLabel>
        <Select
          labelId="religious-restrictions-label"
          value={religiousRestrictions}
          onChange={(e) => setReligiousRestrictions(e.target.value)}
        >
          {/* Add your menu items here */}
        </Select>
      </FormControl>

      <AllergenSelect
        selectedAllergens={selectedAllergens}
        setSelectedAllergens={setSelectedAllergens}
      />

      <TextField
        fullWidth
        margin="normal"
        label="Cuisine Types"
        value={cuisineTypes}
        onChange={(e) => setCuisineTypes(e.target.value.split(","))}
      />

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
          control={<Switch checked={openNow} onChange={(e) => setOpenNow(e.target.checked)} />}
          label="Open Now"
        />
        <FormControlLabel
          control={<Switch checked={acceptsLargeParties} onChange={(e) => setAcceptsLargeParties(e.target.checked)} />}
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
