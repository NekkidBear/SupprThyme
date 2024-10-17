import {
  RESET_PREFERENCES_FORM,
  SET_MAX_PRICE_RANGE,
  SET_MEAT_PREFERENCE,
  SET_RELIGIOUS_RESTRICTIONS,
  SET_ALLERGENS,
  SET_CUISINE_TYPES,
  SET_MAX_DISTANCE,
  SET_OPEN_NOW,
  SET_ACCEPTS_LARGE_PARTIES,
  UPDATE_PREFERENCES,
  FETCH_PRICE_RANGES,
  FETCH_MEAT_PREFERENCES,
  FETCH_RELIGIOUS_RESTRICTIONS,
  FETCH_ALLERGEN_OPTIONS,
  FETCH_CUISINE_OPTIONS,
} from '../actions/PreferencesForm.actions';

const initialState = {
  max_price_range: '',
  meat_preference: '',
  religious_restrictions: '',
  allergens: [],
  cuisine_types: [],
  max_distance: '',
  open_now: true,
  accepts_large_parties: true,
  priceRangeOptions: [],
  meatPreferenceOptions: [],
  religiousRestrictionOptions: [],
  allergenOptions: [],
  cuisineOptions: [],
};

const preferencesReducer = (state = initialState, action) => {
  switch (action.type) {
    case RESET_PREFERENCES_FORM:
      return {
        ...initialState,
      };
    case SET_MAX_PRICE_RANGE:
      return {
        ...state,
        max_price_range: action.payload,
      };
    case SET_MEAT_PREFERENCE:
      return {
        ...state,
        meat_preference: action.payload,
      };
    case SET_RELIGIOUS_RESTRICTIONS:
      return {
        ...state,
        religious_restrictions: action.payload,
      };
    case SET_ALLERGENS:
      return {
        ...state,
        allergens: action.payload,
      };
    case SET_CUISINE_TYPES:
      return {
        ...state,
        cuisine_types: action.payload,
      };
    case SET_MAX_DISTANCE:
      return {
        ...state,
        max_distance: action.payload,
      };
    case SET_OPEN_NOW:
      return {
        ...state,
        open_now: action.payload,
      };
    case SET_ACCEPTS_LARGE_PARTIES:
      return {
        ...state,
        accepts_large_parties: action.payload,
      };
    case UPDATE_PREFERENCES:
      return {
        ...state,
        ...action.payload,
      };
    case FETCH_PRICE_RANGES:
      return {
        ...state,
        priceRangeOptions: action.payload,
      };
    case FETCH_MEAT_PREFERENCES:
      return {
        ...state,
        meatPreferenceOptions: action.payload,
      };
    case FETCH_RELIGIOUS_RESTRICTIONS:
      return {
        ...state,
        religiousRestrictionOptions: action.payload,
      };
    case FETCH_ALLERGEN_OPTIONS:
      return {
        ...state,
        allergenOptions: action.payload,
      };
    case FETCH_CUISINE_OPTIONS:
      return {
        ...state,
        cuisineOptions: action.payload,
      };
    default:
      return state;
  }
};

export default preferencesReducer;
