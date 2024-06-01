const initialState = {
    preferences: {},
    loading: false,
    error: null,
  };
  
  const userPreferencesReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'FETCH_USER_PREFERENCES_REQUEST':
        return {
          ...state,
          loading: true,
          error: null,
        };
      case 'FETCH_USER_PREFERENCES_SUCCESS':
        return {
          ...state,
          preferences: action.payload,
          loading: false,
          error: null,
        };
      case 'FETCH_USER_PREFERENCES_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default userPreferencesReducer;