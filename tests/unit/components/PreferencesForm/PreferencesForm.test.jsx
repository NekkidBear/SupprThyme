// tests/unit/components/PreferencesForm/PreferencesForm.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserPreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm';
import { vi } from 'vitest';

const mockStore = configureStore([]);

describe('UserPreferencesForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: 1 },
    });
    store.dispatch = vi.fn();

    // Mock API calls
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({
          priceRanges: [{ id: 1, range: '$' }, { id: 2, range: '$$' }],
          meatPreferences: [{ id: 1, preference: 'Vegetarian' }, { id: 2, preference: 'Omnivore' }],
          religiousRestrictions: [{ id: 1, restriction: 'None' }, { id: 2, restriction: 'Halal' }],
          allergens: [{ id: 1, allergen: 'Peanuts' }, { id: 2, allergen: 'Dairy' }],
          cuisineTypes: [{ id: 1, type: 'Italian' }, { id: 2, type: 'Chinese' }],
        }),
      })
    );
  });

  test('renders preferences form', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/max price range/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/meat preference/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/religious restrictions/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/allergens/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/cuisine types/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/max distance/i)).toBeInTheDocument();
      expect(screen.getByText(/open now/i)).toBeInTheDocument();
      expect(screen.getByText(/accepts large parties/i)).toBeInTheDocument();
    });
  });

  test('allows setting and updating user preferences', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    const maxPriceRangeInput = screen.getByLabelText(/max price range/i);
    const meatPreferenceInput = screen.getByLabelText(/meat preference/i);
    const maxDistanceInput = screen.getByLabelText(/max distance/i);
    const openNowCheckbox = screen.getByText(/open now/i);

    console.log(maxPriceRangeInput);
    console.log(meatPreferenceInput);
    console.log(maxDistanceInput);
    console.log(openNowCheckbox);

    // Ensure the elements are input elements
    fireEvent.change(maxPriceRangeInput, { target: { value: '2' } });
    fireEvent.change(meatPreferenceInput, { target: { value: 'vegetarian' } });
    fireEvent.change(maxDistanceInput, { target: { value: '10' } });
    fireEvent.click(openNowCheckbox);
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