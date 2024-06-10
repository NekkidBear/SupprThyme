// isPrefsFormVisible.reducer.js
const isPrefsFormVisibleReducer = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_PREFS_FORM':
      return true;
    case 'HIDE_PREFS_FORM':
      return false;
    default:
      return state;
  }
};

export default isPrefsFormVisibleReducer;