const userReducer = (state = {}, action) => {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        ...action.payload,
        address: action.payload.address ? action.payload.address : state.address
      };
    case 'UNSET_USER':
      return {};
    default:
      return state;
  }
};

export default userReducer;