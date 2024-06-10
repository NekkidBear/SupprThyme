export const fetchUserProfile = () => ({
  type: 'FETCH_USER_PROFILE',
});

export const updateUserAddressRequest = (address) => ({
  type: 'UPDATE_USER_ADDRESS_REQUEST',
  payload: address,
});

export const toggleAcctInfoForm = () => ({
  type: 'TOGGLE_ACCT_INFO_FORM',
});

export const togglePrefsForm = () => ({
  type: 'TOGGLE_PREFS_FORM',
});

export const fetchUserPreferencesRequest = (userId) => ({
  type: 'FETCH_USER_PREFERENCES_REQUEST',
  payload: userId,
});

export const updateUserPreferencesRequest = (preferences) => ({
  type: 'UPDATE_USER_PREFERENCES_REQUEST',
  payload: preferences,
});