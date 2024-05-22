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
import AllergenSelect from "./AllergenSelect";

function UserPreferencesForm() {
  const [maxPriceRange, setMaxPriceRange] = useState("");
  const [priceRanges, setPriceRanges] = useState([]);
  const [meatPreference, setMeatPreference] = useState("");
  const [meatPreferences, setMeatPreferences] = useState([]);
  const [religiousRestrictions, setReligiousRestrictions] = useState("");
  const [religiousOptions, setReligiousOptions] = useState([]);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [maxDistance, setMaxDistance] = useState("");
  const [isMiles, setIsMiles] = useState(true);
  const [openNow, setOpenNow] = useState(false);
  const [acceptsLargeParties, setAcceptsLargeParties] = useState(false);
  const [selectedAllergens, setSelectedAllergens] = useState([]);

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
          axios.get("/api/form_data/price-ranges"),
          axios.get("/api/form_data/meat-preferences"),
          axios.get("/api/form_data/religious-options"),
          axios.get("/api/form_data/cuisine-options"),
          axios.get("/api/form_data/allergen-options"),
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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const selectedPreferences = {
      maxPriceRangeId:
        priceRanges.findIndex((range) => range === maxPriceRange) + 1,
      meatPreferenceId:
        meatPreferences.findIndex(
          (preference) => preference === meatPreference
        ) + 1,
      religiousRestrictionsId:
        religiousOptions.findIndex(
          (option) => option === religiousRestrictions
        ) + 1,
      selectedAllergens,
      cuisineTypeIds: cuisineOptions
        .filter((option) => cuisineTypes.includes(option))
        .map((cuisine, index) => index + 1),
      maxDistance,
      openNow,
      acceptsLargeParties,
      isMiles,
    };

    try {
      await axios.post("/api/form_data", selectedPreferences);
      console.log("Form data submitted successfully");
    } catch (error) {
      console.error("Error submitting form data:", error);
    }
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
      <AllergenSelect
        selectedAllergens={selectedAllergens}
        setSelectedAllergens={setSelectedAllergens}
      />
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
