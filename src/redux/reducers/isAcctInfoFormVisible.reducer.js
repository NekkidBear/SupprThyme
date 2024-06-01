// isAcctInfoFormVisible.reducer.js
const isAcctInfoFormVisibleReducer = (state = false, action) => {
  switch (action.type) {
    case 'SHOW_ACCT_INFO_FORM':
      return true;
    case 'HIDE_ACCT_INFO_FORM':
      return false;
    default:
      return state;
  }
};

export default isAcctInfoFormVisibleReducer;