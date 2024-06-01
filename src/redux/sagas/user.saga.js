import {takeLatest} from 'redux-saga/effects'

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

    // Fetch the user's address data
    const addressResponse = yield axios.get(`/api/user_address/${userResponse.data.id}`, config);

    // Combine the user and address data
    const userProfile = {
      ...userResponse.data,
      address: addressResponse.data,
    };

    // now that the session has given us a user object
    // with an id and username set the client-side user object to let
    // the client-side code know the user is logged in
    yield put({ type: 'SET_USER', payload: userProfile });
  } catch (error) {
    console.log('User get request failed', error);
  }
}

function* userSaga() {
  yield takeLatest('FETCH_USER', fetchUser);
}

export default userSaga;