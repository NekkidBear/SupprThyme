const initialState = [];

const restaurantsReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_RESTAURANTS":
      return action.payload; // The payload should be the list of restaurants
    default:
      return state;
  }
};

export default restaurantsReducer;
