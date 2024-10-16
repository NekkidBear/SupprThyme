// tests/unit/components/PreferencesForm/PreferencesForm.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserPreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm'; // Ensure this path is correct

const mockStore = configureStore([]);

describe('UserPreferencesForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      preferences: {}, // Mock preferences data
    });
    store.dispatch = vi.fn();
  });

  test('renders preferences form', () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    expect(screen.getByLabelText(/max price range/i)).toBeInTheDocument();
  });

  // Add more tests as needed
});