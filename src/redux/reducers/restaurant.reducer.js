const initialState = [];

const restaurantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_RESTAURANTS":
      return action.payload; // The payload should be the list of restaurants
    case "CLEAR_RESTAURANTS":
      return initialState; // Reset the state to an empty array
    default:
      return state;
  }
};

export default restaurantsReducer;
