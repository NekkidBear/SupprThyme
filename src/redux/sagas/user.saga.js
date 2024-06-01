import {takeLatest, put, call} from 'redux-saga/effects'
import axios from 'axios';

// worker Saga: will be fired on "FETCH_USER" actions
function* fetchUser() {
  try {
    const config = {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true,
    };

    // the config includes credentials which
    // allow the server session to recognize the user
    // If a user is logged in, this will return their information
    // from the server session (req.user)
    const userResponse = yield axios.get('/api/user', config);

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: userResponse.data });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* fetchUserProfile() {
  try {
    const response = yield call(axios.get, '/api/user/profile');
    yield put({ type: 'SET_USER_PROFILE', payload: response.data });
  } catch (error) {
    console.log('Error fetching user profile:', error);
  }
}

function* updateUserAddress(action) {
  try {
    yield call(axios.put, `/api/user/profile`, action.payload);
    yield put({ type: 'FETCH_USER_PROFILE' });
  } catch (error) {
    console.log('Error updating user address:', error);
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
  yield takeLatest('FETCH_USER_PROFILE', fetchUserProfile);
  yield takeLatest('UPDATE_USER_ADDRESS_REQUEST', updateUserAddress);
}

export default userSaga;