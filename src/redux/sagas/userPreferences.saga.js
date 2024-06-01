import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchUserPreferences(action) {
  try {
    const { group_id, user_id } = action.payload;

    let users;
    if (group_id) {
      // Fetch the group's users
      const groupResponse = yield call(axios.get, `/api/groups/${group_id}`);
      users = groupResponse.data.users;
    } else if (user_id) {
      // Fetch the single user
      const userResponse = yield call(axios.get, `/api/users/${user_id}`);
      users = [userResponse.data];
    } else {
      throw new Error('No group_id or user_id provided');
    }

    // Fetch each user's preferences and aggregate them
    let aggregatePreferences = {};
    for (let user of users) {
      const userResponse = yield call(axios.get, `/api/users/${user.id}/preferences`);
      const userPreferences = userResponse.data.preferences;

      // Skip this user if they have not defined preferences
      if (!userPreferences) continue;

      // For price range and max distance, find the maximum value that is less than or equal to the lowest maximum value
      aggregatePreferences.max_price_range = Math.min(
        aggregatePreferences.max_price_range || Infinity,
        userPreferences.max_price_range
      );
      aggregatePreferences.max_distance = Math.min(
        aggregatePreferences.max_distance || Infinity,
        userPreferences.max_distance
      );

      // For meat preference, check if a restaurant offers vegetarian/vegan options if a user prefers it
      if (
        userPreferences.meat_preference === "Vegetarian" ||
        userPreferences.meat_preference === "Vegan"
      ) {
        aggregatePreferences.meat_preference = "Vegetarian/Vegan";
      }

      // For cuisine types, add the user's preferred cuisine types to the aggregate
      aggregatePreferences.cuisine_types = [
        ...(aggregatePreferences.cuisine_types || []),
        ...userPreferences.cuisine_types,
      ];
    }

    // Dispatch a success action with the aggregated preferences
    yield put({ type: 'FETCH_USER_PREFERENCES_SUCCESS', payload: aggregatePreferences });
  } catch (error) {
    // Dispatch a failure action with the error message
    yield put({ type: 'FETCH_USER_PREFERENCES_FAILURE', payload: error.message });
  }
}

function* watchFetchUserPreferences() {
  yield takeLatest('FETCH_USER_PREFERENCES_REQUEST', fetchUserPreferences);
}

export default watchFetchUserPreferences;