// Action Types
export const RESET_PREFERENCES_FORM = 'RESET_PREFERENCES_FORM';
export const SET_MAX_PRICE_RANGE = 'SET_MAX_PRICE_RANGE';
export const SET_MEAT_PREFERENCE = 'SET_MEAT_PREFERENCE';
export const SET_RELIGIOUS_RESTRICTIONS = 'SET_RELIGIOUS_RESTRICTIONS';
export const SET_ALLERGENS = 'SET_ALLERGENS';
export const SET_CUISINE_TYPES = 'SET_CUISINE_TYPES';
export const SET_MAX_DISTANCE = 'SET_MAX_DISTANCE';
export const SET_OPEN_NOW = 'SET_OPEN_NOW';
export const SET_ACCEPTS_LARGE_PARTIES = 'SET_ACCEPTS_LARGE_PARTIES';
export const UPDATE_PREFERENCES = 'UPDATE_PREFERENCES';

// Fetch Options Actions
export const FETCH_PRICE_RANGES = 'FETCH_PRICE_RANGES';
export const FETCH_MEAT_PREFERENCES = 'FETCH_MEAT_PREFERENCES';
export const FETCH_RELIGIOUS_RESTRICTIONS = 'FETCH_RELIGIOUS_RESTRICTIONS';
export const FETCH_ALLERGEN_OPTIONS = 'FETCH_ALLERGEN_OPTIONS';
export const FETCH_CUISINE_OPTIONS = 'FETCH_CUISINE_OPTIONS';

// Action creators
export const resetPreferencesForm = () => ({
  type: RESET_PREFERENCES_FORM,
});

export const setMaxPriceRange = (maxPriceRange) => ({
  type: SET_MAX_PRICE_RANGE,
  payload: maxPriceRange,
});

export const setMeatPreference = (meatPreference) => ({
  type: SET_MEAT_PREFERENCE,
  payload: meatPreference,
});

export const setReligiousRestrictions = (religiousRestrictions) => ({
  type: SET_RELIGIOUS_RESTRICTIONS,
  payload: religiousRestrictions,
});

export const setAllergens = (allergens) => ({
  type: SET_ALLERGENS,
  payload: allergens,
});

export const setCuisineTypes = (cuisineTypes) => ({
  type: SET_CUISINE_TYPES,
  payload: cuisineTypes,
});

export const setMaxDistance = (maxDistance) => ({
  type: SET_MAX_DISTANCE,
  payload: maxDistance,
});

export const setOpenNow = (openNow) => ({
  type: SET_OPEN_NOW,
  payload: openNow,
});

export const setAcceptsLargeParties = (acceptsLargeParties) => ({
  type: SET_ACCEPTS_LARGE_PARTIES,
  payload: acceptsLargeParties,
});

export const updatePreferences = (preferences) => ({
  type: UPDATE_PREFERENCES,
  payload: preferences,
});

// Fetch Options Action Creators
import axios from 'axios';

export const fetchPriceRanges = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/form_data/price-ranges');
    dispatch({
      type: FETCH_PRICE_RANGES,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching price ranges:', error);
    // Handle error appropriately (e.g., dispatch an error action)
  }
};

export const fetchMeatPreferences = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/form_data/meat-preferences');
    dispatch({
      type: FETCH_MEAT_PREFERENCES,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching meat preferences:', error);
    // Handle error appropriately (e.g., dispatch an error action)
  }
};

export const fetchReligiousRestrictions = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/form_data/religious-options');
    dispatch({
      type: FETCH_RELIGIOUS_RESTRICTIONS,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching religious restrictions:', error);
    // Handle error appropriately (e.g., dispatch an error action)
  }
};

export const fetchAllergenOptions = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/form_data/allergen-options');
    dispatch({
      type: FETCH_ALLERGEN_OPTIONS,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching allergen options:', error);
    // Handle error appropriately (e.g., dispatch an error action)
  }
};

export const fetchCuisineOptions = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/form_data/cuisine-options');
    dispatch({
      type: FETCH_CUISINE_OPTIONS,
      payload: response.data,
    });
  } catch (error) {
    console.error('Error fetching cuisine options:', error);
    // Handle error appropriately (e.g., dispatch an error action)
  }
};
