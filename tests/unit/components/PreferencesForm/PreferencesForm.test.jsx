import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import axios from 'axios';
import PreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm';

// Mock axios
vi.mock('axios');

// Create a mock store
const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      user: (state = initialState.user) => state,
      preferences: (state = initialState.preferences) => state,
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
      },
    });

    vi.mocked(axios.get).mockImplementation((url) => {
      switch (url) {
        case '/api/form_data/price-ranges':
          return Promise.resolve({ data: [
            { id: 1, range: '$' },
            { id: 2, range: '$$' },
            { id: 3, range: '$$$' },
            { id: 4, range: '$$$$' }
          ]});
        case '/api/form_data/meat-preferences':
          return Promise.resolve({ data: [
            { id: 1, preference: 'Vegetarian' },
            { id: 2, preference: 'Vegan' },
            { id: 3, preference: 'Non-vegetarian' }
          ]});
        case '/api/form_data/religious-options':
          return Promise.resolve({ data: [
            { id: 1, restriction: 'Kosher' },
            { id: 2, restriction: 'Halal' },
            { id: 3, restriction: 'None' }
          ]});
        case '/api/form_data/allergen-options':
          return Promise.resolve({ data: [
            { id: 1, allergen: 'Peanuts' },
            { id: 2, allergen: 'Dairy' }
          ]});
        case '/api/form_data/cuisine-options':
          return Promise.resolve({ data: [
            { id: 1, type: 'Italian' },
            { id: 2, type: 'Chinese' }
          ]});
        default:
          return Promise.reject(new Error('Not found'));
      }
    });
  });

  test('renders form fields', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Max Price Range/i)).toBeDefined();
      expect(screen.getByLabelText(/Meat Preference/i)).toBeDefined();
      expect(screen.getByLabelText(/Religious Restrictions/i)).toBeDefined();
      expect(screen.getByLabelText(/Cuisine Types/i)).toBeDefined();
      expect(screen.getByLabelText(/Max Distance/i)).toBeDefined();
      expect(screen.getByLabelText(/Open Now/i)).toBeDefined();
      expect(screen.getByLabelText(/Accepts Large Parties/i)).toBeDefined();
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
      expect(screen.getByText('$')).toBeDefined();
      expect(screen.getByText('$$')).toBeDefined();
      expect(screen.getByText('$$$')).toBeDefined();
      expect(screen.getByText('$$$$')).toBeDefined();
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
      expect(screen.getByText('Vegetarian')).toBeDefined();
      expect(screen.getByText('Vegan')).toBeDefined();
      expect(screen.getByText('Non-vegetarian')).toBeDefined();
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
      expect(screen.getByText('Kosher')).toBeDefined();
      expect(screen.getByText('Halal')).toBeDefined();
      expect(screen.getByText('None')).toBeDefined();
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

  test('displays error message on API failure', async () => {
    vi.mocked(axios.get).mockRejectedValueOnce(new Error('API Error'));

    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText(/Error fetching options/i)).toBeDefined();
    });
  });
});