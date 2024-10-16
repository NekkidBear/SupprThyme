// tests/unit/components/PreferencesForm/PreferencesForm.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserPreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm'; // Ensure this path is correct

const mockStore = configureStore([]);

describe('UserPreferencesForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: 1 }, // Mock user data
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

  test('allows user to set preferences', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/max price range/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/meat preference/i), { target: { value: 'vegetarian' } });
    fireEvent.change(screen.getByLabelText(/max distance/i), { target: { value: '10' } });
    fireEvent.click(screen.getByLabelText(/open now/i));
    fireEvent.click(screen.getByText(/save preferences/i));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'SET_USER_PREFERENCES',
        payload: {
          maxPriceRange: '2',
          meatPreference: 'vegetarian',
          maxDistance: '10',
          openNow: true,
        },
      }));
    });
  });

  // Add more tests as needed
});