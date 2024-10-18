import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi, describe, beforeEach, test, expect } from 'vitest';
import PreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm';
import preferencesReducer from '../../../../src/redux/reducers/preferencesReducer';
import * as reactRedux from 'react-redux';

// Mock the entire react-redux module
vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux');
  return {
    ...actual,
    useSelector: vi.fn(),
    useDispatch: vi.fn(),
  };
});

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
  let mockDispatch;

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

    mockDispatch = vi.fn();
    vi.mocked(reactRedux.useDispatch).mockReturnValue(mockDispatch);
    vi.mocked(reactRedux.useSelector).mockImplementation(selector => selector(store.getState()));
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

    // Interact with form elements
    await userEvent.selectOptions(screen.getByTestId('max-price-range-select'), '4');
    await userEvent.selectOptions(screen.getByTestId('meat-preference-select'), '1');
    await userEvent.selectOptions(screen.getByLabelText(/Religious Restrictions/i), '3');
    await userEvent.type(screen.getByLabelText(/Max Distance/i), '10');
    await userEvent.click(screen.getByLabelText(/Open Now/i));
    await userEvent.click(screen.getByLabelText(/Accepts Large Parties/i));

    // Submit form
    await userEvent.click(screen.getByTestId('save-preferences-button'));

    // Check if the correct action was dispatched
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'UPDATE_PREFERENCES',
          payload: expect.objectContaining({
            max_price_range: '4',
            meat_preference: '1',
            religious_restrictions: '3',
            max_distance: '10',
            open_now: false,
            accepts_large_parties: false,
          })
        })
      );
    });
  });

  test('handles errors correctly', async () => {
    mockDispatch.mockImplementation(() => {
      throw new Error('Error updating preferences');
    });

    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    // Fill in required fields to pass validation
    await userEvent.selectOptions(screen.getByTestId('max-price-range-select'), '4');
    await userEvent.selectOptions(screen.getByTestId('meat-preference-select'), '1');

    await userEvent.click(screen.getByTestId('save-preferences-button'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Failed to update preferences. Please try again later.');
    });
  });

  test('shows validation error when required fields are not filled', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await userEvent.click(screen.getByTestId('save-preferences-button'));

    await waitFor(() => {
      expect(screen.getByTestId('error-message')).toHaveTextContent('Please fill in all required fields.');
    });
  });

  test('cancel button opens confirmation dialog', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    await userEvent.click(screen.getByTestId('cancel-button'));

    await waitFor(() => {
      expect(screen.getByText('Cancel Changes?')).toBeInTheDocument();
      expect(screen.getByText('Are you sure you want to cancel? All unsaved changes will be lost.')).toBeInTheDocument();
    });
  });

  test('AllergenSelect integration', async () => {
    render(
      <Provider store={store}>
        <PreferencesForm />
      </Provider>
    );

    const allergenSelect = await screen.findByLabelText(/Allergens/i);
    await userEvent.click(allergenSelect);

    // Wait for the allergen options to be visible
    await waitFor(() => {
      expect(screen.getByText('Peanuts')).toBeInTheDocument();
    });

    await userEvent.click(screen.getByText('Peanuts'));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'SET_ALLERGENS',
        payload: expect.arrayContaining([1]), // Assuming 1 is the ID for Peanuts
      }));
    });
  });
});