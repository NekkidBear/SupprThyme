import { combineReducers } from 'redux';
import errors from './errors.reducer';
import user from './user.reducer';
import restaurantsReducer from './restaurant.reducer'
import showRecommendationsReducer from './showRecommendations.reducer';
import userPreferencesReducer from './userPreferences.reducer';
import isAcctInfoFormVisibleReducer from './isAcctInfoFormVisible.reducer';
import isPrefsFormVisibleReducer from './isPrefsFormVisible.reducer';

const rootReducer = combineReducers({
  errors,
  user,
  restaurants: restaurantsReducer,
  showRecommendations: showRecommendationsReducer,
  userPreferences: userPreferencesReducer,
  isAcctInfoFormVisible: isAcctInfoFormVisibleReducer,
  isPrefsFormVisible: isPrefsFormVisibleReducer,
});

export default rootReducer;