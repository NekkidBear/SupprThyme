// showRecommendations.reducer.js
import { TOGGLE_RECOMMENDATIONS } from './showRecommendations.actions';

const initialState = {
  showRecommendations: false,
};

const showRecommendationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case TOGGLE_RECOMMENDATIONS:
      return {
        ...state,
        showRecommendations: action.payload,
      };
    default:
      return state;
  }
};

export default showRecommendationsReducer;