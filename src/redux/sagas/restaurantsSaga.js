import { put, call, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchRestaurants(action) {
  try {
    const params = new URLSearchParams(action.payload);
    const response = yield call(axios.get, `/api/restaurants/search?${params.toString()}`);
    yield put({ type: 'FETCH_RESTAURANTS_SUCCESS', payload: response.data });
  } catch (error) {
    yield put({ type: 'FETCH_RESTAURANTS_FAILURE', payload: error.message });
  }
}

function* watchFetchRestaurants() {
  yield takeLatest('FETCH_RESTAURANTS_REQUEST', fetchRestaurants);
}

export default watchFetchRestaurants;