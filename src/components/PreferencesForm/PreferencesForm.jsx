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

const UserPreferencesForm = ({
  initialValues = {},
  onSubmit = () => {},
  onCancel = () => {},
  editMode = false,
}) => {
  const [selectedAllergens, setSelectedAllergens] = useState(
    initialValues.selectedAllergens || []
  );
  const [max_price_range, setMaxPriceRange] = useState(
    initialValues.max_price_range || ""
  );
  const [meat_preference, setMeatPreference] = useState(
    initialValues.meat_preference || ""
  );
  const [religious_restrictions, setReligiousRestrictions] = useState(
    initialValues.religious_restrictions || ""
  );
  const [cuisine_types, setCuisineTypes] = useState(
    initialValues.cuisine_types || []
  );
  const [max_distance, setMaxDistance] = useState(
    initialValues.max_distance || ""
  );
  const [open_now, setOpenNow] = useState(initialValues.open_now || true);
  const [accepts_large_parties, setAcceptsLargeParties] = useState(
    initialValues.accepts_large_parties || true
  );
  const [allergenOptions, setAllergenOptions] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [priceRangeOptions, setPriceRangeOptions] = useState([]);
  const [meatPreferenceOptions, setMeatPreferenceOptions] = useState([]);
  const [religiousRestrictionOptions, setReligiousRestrictionsOptions] =
    useState([]);

  //get User ID
  const getUserID = async () => {
    try {
      const response = await axios.get("/api/user");
      const user_id = response.data.id;
      return user_id;
    } catch (error) {
      console.error("error fetching logged in user's ID", error);
    }
  };
  //fetch user preferences
  async function fetchUserPreferences(userId) {
    try {
      const response = await axios.get(`/api/user_preferences/${userId}`);

      const {
        max_price_range,
        meat_preference,
        religious_restrictions,
        allergens,
        cuisine_types,
        max_distance,
        open_now,
        accepts_large_parties,
      } = response.data;

      setSelectedAllergens(allergens.map((allergen) => allergen.id) || []);
      setMaxPriceRange(max_price_range?.id || "");
      setMeatPreference(meat_preference?.id || "");
      setReligiousRestrictions(religious_restrictions?.id || "");
      setCuisineTypes(cuisine_types || []);
      setMaxDistance(max_distance || "");
      setOpenNow(open_now || true);
      setAcceptsLargeParties(accepts_large_parties || true);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
    }
  }

  // Call the fetchUserPreferences function if the component is in edit mode
  useEffect(() => {
    const fetchPreferences = async () => {
      const userId = await getUserID();
      if (editMode) {
        fetchUserPreferences(userId);
      } else {
        setSelectedAllergens(initialValues.selectedAllergens || []);
        setMaxPriceRange(initialValues.max_price_range || "");
        setMeatPreference(initialValues.meat_preference || "");
        setReligiousRestrictions(initialValues.religious_restrictions || "");
        setCuisineTypes(initialValues.cuisine_types || []);
        setMaxDistance(initialValues.max_distance || "");
        setOpenNow(initialValues.open_now || true);
        setAcceptsLargeParties(initialValues.accepts_large_parties || true);
      }
    };
    fetchPreferences();
  }, [initialValues, editMode]);

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
  
  const handleSubmit = async () => {
    const user_id = await getUserID();
  
    const preferencesData = {
      user_id,
      max_price_range,
      meat_preference,
      religious_restrictions,
      allergens: selectedAllergens.map((allergen) => allergen.id),
      cuisine_types,
      max_distance,
      open_now,
      accepts_large_parties,
    };
  
    try {
      const response = await axios.get(`/api/user_preferences/${user_id}`);
      if (response.data) {
        await axios.put(`/api/user_preferences/${user_id}`, preferencesData);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        await axios.post("/api/user_preferences", preferencesData);
      } else {
        console.error("Error saving preferences:", error);
      }
    }
  
    onSubmit(preferencesData);
    alert("Preferences saved successfully");
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
        <InputLabel id="religious-restrictions-label">
          Religious Restrictions
        </InputLabel>
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
        allergenOptions={allergenOptions} // Pass options to AllergenSelect
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
      <Button variant="contained" color="primary" onClick={onCancel}>
        Cancel
      </Button>
    </form>
  );
};

export default UserPreferencesForm;
