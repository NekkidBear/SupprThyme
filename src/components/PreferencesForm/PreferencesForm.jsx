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
import { find } from "lodash";
import { useSelector } from "react-redux";

// Define the UserPreferencesForm component. It takes four props:
// - initialValues: an object containing the initial values for the form fields
// - onSubmit: a function to be called when the form is submitted
// - onCancel: a function to be called when the form is cancelled
// - editMode: a boolean indicating whether the form is in edit mode
const UserPreferencesForm = ({
  initialValues = {},
  onSubmit = () => {},
  onCancel = () => {},
  editMode = false,
}) => {
  // Create state variables for each of the form fields. Initialize them with
  // the corresponding values from initialValues if they exist, or with default
  // values if they don't.

  // retrieve the user Id
  const user = useSelector(store=>store.user)
  const user_id = user.id

  // selectedAllergens is an array of the user's selected allergens
  const [selectedAllergens, setSelectedAllergens] = useState(
    initialValues.selectedAllergens || []
  );

  // max_price_range is the user's maximum price range
  const [max_price_range, setMaxPriceRange] = useState(
    initialValues.max_price_range || ""
  );

  // meat_preference is the user's meat preference
  const [meat_preference, setMeatPreference] = useState(
    initialValues.meat_preference || ""
  );

  // religious_restrictions is the user's religious restrictions
  const [religious_restrictions, setReligiousRestrictions] = useState(
    initialValues.religious_restrictions || ""
  );

  // cuisine_types is an array of the user's preferred cuisine types
  const [cuisine_types, setCuisineTypes] = useState(
    initialValues.cuisine_types || []
  );

  // max_distance is the user's maximum distance
  const [max_distance, setMaxDistance] = useState(
    initialValues.max_distance || ""
  );

  // open_now is a boolean indicating whether the user wants restaurants that are open now
  const [open_now, setOpenNow] = useState(initialValues.open_now || true);

  // accepts_large_parties is a boolean indicating whether the user wants restaurants that accept large parties
  const [accepts_large_parties, setAcceptsLargeParties] = useState(
    initialValues.accepts_large_parties || true
  );

  // allergenOptions, cuisineOptions, priceRangeOptions, meatPreferenceOptions, and religiousRestrictionOptions
  // are arrays of options for the corresponding form fields. These will be fetched from the server.
  const [allergenOptions, setAllergenOptions] = useState([]);
  const [cuisineOptions, setCuisineOptions] = useState([]);
  const [priceRangeOptions, setPriceRangeOptions] = useState([]);
  const [meatPreferenceOptions, setMeatPreferenceOptions] = useState([]);
  const [religiousRestrictionOptions, setReligiousRestrictionsOptions] =
    useState([]);

// Define an asynchronous function to fetch the user's preferences
async function fetchUserPreferences(user_id) {
  // Set loading to true while the data is being fetched
  setLoading(true);

  // Initialize error to null at the start of the fetch
  setError(null);

  try {
    // Send a GET request to the /api/userPreferences/{user_id} endpoint
    const response = await fetch(`/api/userPreferences/${user_id}`);

    // Convert the response data to JSON
    const userPreferences = await response.json();

    // Map the human-readable values back to their corresponding numeric values
    const maxPriceRange = priceRangeMapping[userPreferences.max_price_range];
    const maxDistance = distanceMapping[userPreferences.max_distance];

    // Map the allergens and cuisine types to extract the allergen and type properties
    const allergens = userPreferences.allergens.map((a) => a.allergen);
    const cuisineTypes = userPreferences.cuisineTypes.map((c) => c.type);

    // Set the state variables with the fetched and mapped data
    setSelectedAllergens(allergens || []);
    setMaxPriceRange(maxPriceRange || "");
    setMeatPreference(userPreferences.meat_preference || "");
    setReligiousRestrictions(userPreferences.religious_restrictions || "");
    setCuisineTypes(cuisineTypes || []);
    setMaxDistance(maxDistance || "");
    setOpenNow(userPreferences.open_now || true);
    setAcceptsLargeParties(userPreferences.accepts_large_parties || true);
  } catch (error) {
    // Log any errors that occur during the fetch and set the error state variable
    console.error("Error fetching user preferences:", error);
    setError("Error fetching user preferences. Please try again later.");
  } finally {
    // Set loading to false after the data has been fetched
    setLoading(false);
  }
}

  // Call the fetchUserPreferences function if the component is in edit mode

 // This useEffect hook is responsible for fetching user preferences when the component is in edit mode
useEffect(() => {
  // Define an asynchronous function to fetch the user's preferences
  const fetchPreferences = async () => {
    // If the component is in edit mode
    if (editMode && user_id) {
      try {
        // Fetch the user's preferences by sending a GET request to the /api/user_preferences/{user_id} endpoint
        const { data: userPreferences } = await axios.get(`/api/user_preferences/${user_id}`);

        console.log('max_price_range:', userPreferences.max_price_range);
        console.log('meat_preference:', userPreferences.meat_preference);
        console.log('religious_restrictions:', userPreferences.religious_restrictions)
        console.log('allergens: ',userPreferences.allergens)
        console.log('cuisine_types: ', userPreferences.cuisine_types)


        // Fetch the IDs for the user-friendly values by sending a GET request to the /api/user_preferences/ids endpoint
        // Pass the user-friendly values as query parameters
        const { data: ids } = await axios.get('/api/user_preferences/ids', {
          params: {
            max_price_range: userPreferences.max_price_range,
            meat_preference: userPreferences.meat_preference,
            religious_restrictions: userPreferences.religious_restrictions,
            allergens: JSON.stringify(userPreferences.allergens),
            cuisine_types: JSON.stringify(userPreferences.cuisine_types),
          },
        });

        // Set the state with the fetched IDs and other user preferences
        setMaxPriceRange(ids.max_price_range);
        setMeatPreference(ids.meat_preference);
        setReligiousRestrictions(ids.religious_restrictions);
        setSelectedAllergens(ids.allergens);
        setCuisineTypes(ids.cuisine_types);
        setOpenNow(userPreferences.open_now || true);
        setAcceptsLargeParties(userPreferences.accepts_large_parties || true);
      } catch (error) {
        // If there's an error during the fetching process, log it to the console
        console.error("Error fetching preferences:", error);
      }
    }
  };

  // Call the fetchPreferences function
  fetchPreferences();
}, [editMode, user_id]); // The dependencies of the useEffect hook are editMode and user_id

// This useEffect hook is responsible for fetching form data options when the component mounts
useEffect(() => {
  // Define an asynchronous function to fetch the form data options
  const fetchOptions = async () => {
    try {
      // Fetch the form data options by sending GET requests to the respective endpoints
      // Use Promise.all to send all requests concurrently
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

      // Set the state with the fetched form data options
      setPriceRangeOptions(priceRanges.data);
      setMeatPreferenceOptions(meatPreferences.data);
      setReligiousRestrictionsOptions(religiousOptions.data);
      setAllergenOptions(allergenOpts.data);
      setCuisineOptions(cuisineOpts.data);
    } catch (error) {
      // If there's an error during the fetching process, log it to the console
      console.error("Error fetching options:", error);
    }
  };

  // Call the fetchOptions function
  fetchOptions();
}, []); // The dependencies of the useEffect hook are empty, so it will only run once when the component mounts

  // State for storing any submit errors
const [submitError, setSubmitError] = useState(null);

// Function to handle form submission
const handleSubmit = async () => {
  // Get the user ID
  const user_id = await getUserID();

  // Map the user-friendly allergen values back to their corresponding IDs
  const allergens = selectedAllergens.map((allergen) => {
    // Find the allergen in the allergenOptions array
    const foundAllergen = find(allergenOptions, { allergen: allergen });

    // If the allergen is not found, set an error and return null
    if (!foundAllergen) {
      setSubmitError(`No match found for allergen: ${allergen}`);
      return null;
    }

    // Return the ID of the found allergen
    return foundAllergen.id;
  });

  // Map the user-friendly cuisine type values back to their corresponding IDs
  const cuisineTypes = cuisine_types.map((cuisineType) => {
    // Find the cuisine type in the cuisineOptions array
    const foundCuisineType = find(cuisineOptions, { type: cuisineType });

    // If the cuisine type is not found, set an error and return null
    if (!foundCuisineType) {
      setSubmitError(`No match found for cuisine type: ${cuisineType}`);
      return null;
    }

    // Return the ID of the found cuisine type
    return foundCuisineType.id;
  });

  // If there's a submit error, don't submit the form
  if (submitError) {
    return;
  }

  // Prepare the data to be submitted
  const preferencesData = {
    user_id,
    max_price_range,
    meat_preference,
    religious_restrictions,
    allergens,
    cuisine_types: cuisineTypes,
    max_distance,
    open_now,
    accepts_large_parties,
  };

  // Submit the form and show an alert when the submission is successful
  onSubmit(preferencesData).then((response) => {
    alert("Preferences saved successfully");
  });
};

//this is the jsx code for rendering the form
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
