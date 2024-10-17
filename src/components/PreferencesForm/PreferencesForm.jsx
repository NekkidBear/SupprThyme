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
  Typography,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
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
} from "../../redux/actions/PreferencesForm.actions.js";

const UserPreferencesForm = ({ onSubmit, onCancel }) => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const preferences = useSelector((store) => store.preferences);

  const [error, setError] = useState(null);
  const [openCancelDialog, setOpenCancelDialog] = useState(false);

  useEffect(() => {
    dispatch(fetchPriceRanges());
    dispatch(fetchMeatPreferences());
    dispatch(fetchReligiousRestrictions());
    dispatch(fetchAllergenOptions());
    dispatch(fetchCuisineOptions());
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    
    // Basic form validation
    if (!preferences.max_price_range || !preferences.meat_preference || preferences.allergens.length === 0) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      await dispatch(updatePreferences(preferences));
      if (onSubmit) {
        onSubmit(preferences);
      }
    } catch (error) {
      setError("Failed to update preferences. Please try again later.");
    }
  };

  const handleCancel = () => {
    setOpenCancelDialog(true);
  };

  const confirmCancel = () => {
    dispatch(resetPreferencesForm());
    setOpenCancelDialog(false);
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} data-testid="preferences-form">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="max-price-range-label">Max Price Range *</InputLabel>
            <Select
              labelId="max-price-range-label"
              value={preferences.max_price_range}
              onChange={(e) => dispatch(setMaxPriceRange(e.target.value))}
              data-testid="max-price-range-select"
              required
            >
              {preferences.priceRangeOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.range}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="meat-preference-label">Meat Preference *</InputLabel>
            <Select
              labelId="meat-preference-label"
              value={preferences.meat_preference}
              onChange={(e) => dispatch(setMeatPreference(e.target.value))}
              data-testid="meat-preference-select"
              required
            >
              {preferences.meatPreferenceOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.preference}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="religious-restrictions-label">Religious Restrictions</InputLabel>
            <Select
              labelId="religious-restrictions-label"
              value={preferences.religious_restrictions}
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
        </Grid>
        <Grid item xs={12}>
          <AllergenSelect
            allergens={preferences.allergens}
            allergenOptions={preferences.allergenOptions}
            onChange={(selected) => dispatch(setAllergens(selected))}
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="cuisine-types-label">Cuisine Types</InputLabel>
            <Select
              labelId="cuisine-types-label"
              multiple
              value={preferences.cuisine_types}
              onChange={(e) => dispatch(setCuisineTypes(e.target.value))}
              input={<OutlinedInput label="Cuisine Types" />}
              renderValue={(selected) => selected.join(", ")}
              data-testid="cuisine-types-select"
            >
              {preferences.cuisineOptions.map((option) => (
                <MenuItem key={option.id} value={option.type}>
                  <Checkbox checked={preferences.cuisine_types.indexOf(option.type) > -1} />
                  <ListItemText primary={option.type} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Max Distance (miles)"
            type="number"
            value={preferences.max_distance}
            onChange={(e) => dispatch(setMaxDistance(e.target.value))}
            data-testid="max-distance-input"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.open_now}
                  onChange={(e) => dispatch(setOpenNow(e.target.checked))}
                  data-testid="open-now-switch"
                />
              }
              label="Open Now"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.accepts_large_parties}
                  onChange={(e) => dispatch(setAcceptsLargeParties(e.target.checked))}
                  data-testid="accepts-large-parties-switch"
                />
              }
              label="Accepts Large Parties"
            />
          </FormGroup>
        </Grid>
      </Grid>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        data-testid="save-preferences-button"
        sx={{ mt: 2, mr: 1 }}
      >
        Save Preferences
      </Button>
      <Button
        type="button"
        variant="contained"
        color="secondary"
        onClick={handleCancel}
        data-testid="cancel-button"
        sx={{ mt: 2 }}
      >
        Cancel
      </Button>
      {error && (
        <Typography color="error" data-testid="error-message" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}

      <Dialog
        open={openCancelDialog}
        onClose={() => setOpenCancelDialog(false)}
        aria-labelledby="cancel-dialog-title"
        aria-describedby="cancel-dialog-description"
      >
        <DialogTitle id="cancel-dialog-title">{"Cancel Changes?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-dialog-description">
            Are you sure you want to cancel? All unsaved changes will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCancelDialog(false)} color="primary">
            No, Keep Editing
          </Button>
          <Button onClick={confirmCancel} color="primary" autoFocus>
            Yes, Cancel Changes
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  );
};

export default UserPreferencesForm;
