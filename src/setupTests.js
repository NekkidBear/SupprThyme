import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

const mockStore = configureStore([]);

global.store = mockStore({});

global.renderWithProviders = (ui) => {
  return render(
    <Provider store={global.store}>{ui}</Provider>
  );
};
