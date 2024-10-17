import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import axios from 'axios';
import PreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm';
import preferencesReducer from '../../../../src/redux/reducers/preferencesReducer';

// Mock axios
vi.mock('axios');

// Create a mock store
const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      user: (state = initialState.user) => state,
      preferences: preferencesReducer,
    },
    preloadedState: initialState,
  });
};

describe('PreferencesForm', () => {
  let store;

  beforeEach(() => {
    store = createMockStore({
      user: { id: 1 },
      preferences: {
        max_price_range: '',
        meat_preference: '',
        religious_restrictions: '',
        allergens: [],
        cuisine_types: [],
        max_distance: '',
        open_now: true,
        accepts_large_parties: true,
        priceRangeOptions: [
          { id: 1, range: '$' },
          { id: 2, range: '$$' },
          { id: 3, range: '$$$' },
          { id: 4, range: '$$$$' },
        ],
        meatPreferenceOptions: [
          { id: 1, preference: 'Vegetarian' },
          { id: 2, preference: 'Vegan' },
          { id: 3, preference: 'Non-vegetarian' },
        ],
        religiousRestrictionOptions: [
          { id: 1, restriction: 'Kosher' },
          { id: 2, restriction: 'Halal' },
          { id: 3, restriction: 'None' },
        ],
        allergenOptions: [
          { id: 1, allergen: 'Peanuts' },
          { id: 2, allergen: 'Shellfish' },
        ],
        cuisineOptions: [
          { id: 1, type: 'Italian' },
          { id: 2, type: 'Chinese' },
        ],
      },
    });
  });

  test('renders form fields correctly', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Max Price Range/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Meat Preference/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Religious Restrictions/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Cuisine Types/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Max Distance/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Open Now/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Accepts Large Parties/i)).toBeInTheDocument();
    });
  });

  test('renders price range options correctly', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    const select = await screen.findByLabelText(/Max Price Range/i);
    await userEvent.click(select);

    await waitFor(() => {
      expect(screen.getByText('$')).toBeInTheDocument();
      expect(screen.getByText('$$')).toBeInTheDocument();
      expect(screen.getByText('$$$')).toBeInTheDocument();
      expect(screen.getByText('$$$$')).toBeInTheDocument();
    });
  });

  test('renders meat preference options correctly', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    const select = await screen.findByLabelText(/Meat Preference/i);
    await userEvent.click(select);

    await waitFor(() => {
      expect(screen.getByText('Vegetarian')).toBeInTheDocument();
      expect(screen.getByText('Vegan')).toBeInTheDocument();
      expect(screen.getByText('Non-vegetarian')).toBeInTheDocument();
    });
  });

  test('renders religious restrictions options correctly', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    const select = await screen.findByLabelText(/Religious Restrictions/i);
    await userEvent.click(select);

    await waitFor(() => {
      expect(screen.getByText('Kosher')).toBeInTheDocument();
      expect(screen.getByText('Halal')).toBeInTheDocument();
      expect(screen.getByText('None')).toBeInTheDocument();
    });
  });

  test('allows setting and updating user preferences', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    // Open dropdowns and select options
    const priceRangeSelect = await screen.findByLabelText(/Max Price Range/i);
    await userEvent.click(priceRangeSelect);
    await userEvent.click(screen.getByText('$$$$'));

    const meatPreferenceSelect = await screen.findByLabelText(/Meat Preference/i);
    await userEvent.click(meatPreferenceSelect);
    await userEvent.click(screen.getByText('Vegetarian'));

    const religiousRestrictionsSelect = await screen.findByLabelText(/Religious Restrictions/i);
    await userEvent.click(religiousRestrictionsSelect);
    await userEvent.click(screen.getByText('None'));
    
    // Type max distance
    await userEvent.type(screen.getByLabelText(/Max Distance/i), '10');

    // Toggle switches
    await userEvent.click(screen.getByLabelText(/Open Now/i));
    await userEvent.click(screen.getByLabelText(/Accepts Large Parties/i));

    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /Save Preferences/i }));

    // Check if the correct action was dispatched
    await waitFor(() => {
      const state = store.getState();
      expect(state.preferences).toEqual(expect.objectContaining({
        max_price_range: 4,
        meat_preference: 1,
        religious_restrictions: 3,
        max_distance: '10',
        open_now: false,
        accepts_large_parties: false,
      }));
    });
  });

  test('handles errors correctly', async () => {
    axios.get.mockRejectedValueOnce(new Error('Error fetching options'));

    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error fetching options. Please try again later.')).toBeInTheDocument();
    });
  });
});
