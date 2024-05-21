import React, { useState, useEffect } from "react";
import {
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import axios from "axios";

function UserPreferencesForm() {
  const [maxPriceRange, setMaxPriceRange] = useState("");
  const [priceRanges, setPriceRanges] = useState([]);
  const [meatPreference, setMeatPreference] = useState("");
  const [meatPreferences, setMeatPreferences] = useState([]);
  const [religiousRestrictions, setReligiousRestrictions] = useState("");
  const [religiousOptions, setReligiousOptions] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [allergenOptions, setAllergenOptions] = useState([]);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [maxDistance, setMaxDistance] = useState("");
  const [isMiles, setIsMiles] = useState(true);
  const [openNow, setOpenNow] = useState(false);
  const [acceptsLargeParties, setAcceptsLargeParties] = useState(false);

  useEffect(() => {
    // Fetch data for dropdowns and multi-select options from the API
    const fetchData = async () => {
      try {
        const [
          priceRangesResponse,
          meatPreferencesResponse,
          religiousOptionsResponse,
          allergenOptionsResponse,
          cuisineOptionsResponse,
        ] = await Promise.all([
          axios.get("/api/price-ranges"),
          axios.get("/api/meat-preferences"),
          axios.get("/api/religious-options"),
          axios.get("/api/allergen-options"),
          axios.get("/api/cuisine-options"),
        ]);

        setPriceRanges(priceRangesResponse.data);
        setMeatPreferences(meatPreferencesResponse.data);
        setReligiousOptions(religiousOptionsResponse.data);
        setAllergenOptions(allergenOptionsResponse.data);
        setCuisineOptions(cuisineOptionsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add your form submission logic here
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl>
        <InputLabel id="max-price-range-label">Max Price Range</InputLabel>
        <Select
          labelId="max-price-range-label"
          value={maxPriceRange}
          onChange={(event) => setMaxPriceRange(event.target.value)}
        >
          {priceRanges.map((range) => (
            <MenuItem key={range} value={range}>
              {range}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="meat-preference-label">Meat Preference</InputLabel>
        <Select
          labelId="meat-preference-label"
          value={meatPreference}
          onChange={(event) => setMeatPreference(event.target.value)}
        >
          {meatPreferences.map((preference) => (
            <MenuItem key={preference} value={preference}>
              {preference}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <InputLabel id="religious-restrictions-label">
          Religious Restrictions
        </InputLabel>
        <Select
          labelId="religious-restrictions-label"
          value={religiousRestrictions}
          onChange={(event) => setReligiousRestrictions(event.target.value)}
        >
          {religiousOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormGroup>
        <InputLabel id="allergens-label">Allergens</InputLabel>
        {allergenOptions.map((allergen) => (
          <FormControlLabel
            key={allergen}
            control={<Checkbox />}
            label={allergen}
          />
        ))}
      </FormGroup>
      <FormGroup>
        <InputLabel id="cuisine-types-label">Cuisine Types</InputLabel>
        {cuisineOptions.map((cuisine) => (
          <FormControlLabel
            key={cuisine}
            control={<Checkbox />}
            label={cuisine}
          />
        ))}
      </FormGroup>
      <TextField
        label="Max Distance"
        value={maxDistance}
        onChange={(event) => setMaxDistance(event.target.value)}
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={openNow}
            onChange={(event) => setOpenNow(event.target.checked)}
          />
        }
        label="Open Now"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={acceptsLargeParties}
            onChange={(event) => setAcceptsLargeParties(event.target.checked)}
          />
        }
        label="Accepts Large Parties"
      />
      <FormControlLabel
        control={
          <Checkbox
            checked={isMiles}
            onChange={(event) => setIsMiles(event.target.checked)}
          />
        }
        label="Miles"
      />
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </form>
  );
}

export default UserPreferencesForm;
