import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import axios from 'axios';
import UserPreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm';
import {
  resetPreferencesForm,
  setMaxPriceRange,
  setMeatPreference,
  setReligiousRestrictions,
  setAllergens,
  setCuisineTypes,
  setMaxDistance,
  setOpenNow,
  setAcceptsLargeParties,
} from '../../../../src/redux/actions/PreferencesForm.actions';

// Mock the modules
vi.mock('axios');
vi.mock('../../../../src/redux/actions/PreferencesForm.actions');

// Create a mock store with thunk middleware
const mockStore = configureStore([thunk]);

describe('UserPreferencesForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
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

    // Mock API responses
    axios.get.mockImplementation((url) => {
      switch (url) {
        case '/api/form_data/price-ranges':
          return Promise.resolve({ data: [{ id: 1, range: '$' }, { id: 2, range: '$$' }, { id: 3, range: '$$$' }, { id: 4, range: '$$$$' }] });
        case '/api/form_data/meat-preferences':
          return Promise.resolve({ data: [{ id: 1, preference: 'Vegetarian' }, { id: 2, preference: 'Omnivore' }] });
        case '/api/form_data/religious-options':
          return Promise.resolve({ data: [{ id: 1, restriction: 'None' }, { id: 2, restriction: 'Halal' }] });
        case '/api/form_data/allergen-options':
          return Promise.resolve({ data: [{ id: 1, allergen: 'Peanuts' }, { id: 2, allergen: 'Dairy' }] });
        case '/api/form_data/cuisine-options':
          return Promise.resolve({ data: [{ id: 1, type: 'Italian' }, { id: 2, type: 'Chinese' }] });
        default:
          return Promise.resolve({ data: {} });
      }
    });
  });

  test('renders preferences form', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Max Price Range')).toBeInTheDocument();
      expect(screen.getByLabelText('Meat Preference')).toBeInTheDocument();
      expect(screen.getByLabelText('Religious Restrictions')).toBeInTheDocument();
      expect(screen.getByLabelText('Allergens')).toBeInTheDocument();
      expect(screen.getByLabelText('Cuisine Types')).toBeInTheDocument();
      expect(screen.getByLabelText('Max Distance')).toBeInTheDocument();
      expect(screen.getByLabelText('Open Now')).toBeInTheDocument();
      expect(screen.getByLabelText('Accepts Large Parties')).toBeInTheDocument();
      expect(screen.getByText('Save Preferences')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  test('allows setting and updating user preferences', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Max Price Range')).toBeInTheDocument();
    });

    // Select options and fill in fields
    await user.selectOptions(screen.getByLabelText('Max Price Range'), '4');
    await user.selectOptions(screen.getByLabelText('Meat Preference'), '1');
    await user.selectOptions(screen.getByLabelText('Religious Restrictions'), '1');
    
    // Select allergens
    await user.click(screen.getByLabelText('Allergens'));
    await user.click(screen.getByText('Peanuts'));
    await user.click(screen.getByText('Dairy'));
    await user.click(document.body); // Close the allergen dropdown

    // Select cuisine types
    await user.click(screen.getByLabelText('Cuisine Types'));
    await user.click(screen.getByText('Italian'));
    await user.click(document.body); // Close the cuisine types dropdown

    await user.type(screen.getByLabelText('Max Distance'), '10');
    await user.click(screen.getByLabelText('Open Now'));

    // Submit the form
    await user.click(screen.getByText('Save Preferences'));

    // Check if the dispatch function was called with the correct arguments
    await waitFor(() => {
      expect(store.getActions()).toContainEqual(expect.objectContaining({
        type: 'UPDATE_PREFERENCES',
        payload: expect.objectContaining({
          user_id: 1,
          max_price_range: 4,
          meat_preference: 1,
          religious_restrictions: 1,
          max_distance: '10',
          open_now: true,
          accepts_large_parties: true,
          allergens: [1, 2],
          cuisine_types: [1],
        }),
      }));
    });
  });

  test('dispatches resetPreferencesForm action on cancel', async () => {
    const user = userEvent.setup();

    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cancel'));

    await waitFor(() => {
      expect(store.getActions()).toContainEqual(resetPreferencesForm());
    });
  });
});