import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { vi } from 'vitest';
import axios from 'axios';
import PreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm'; // Adjust the import path as necessary

const mockStore = configureStore([]);
let store;

vi.mock('axios');

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
        return Promise.resolve({
          data: [
            { id: 1, range: '$' },
            { id: 2, range: '$$' },
            { id: 3, range: '$$$' },
            { id: 4, range: '$$$$' }
          ]
        });
      case '/api/form_data/meat-preferences':
        return Promise.resolve({
          data: [
            { id: 1, preference: 'Vegetarian' },
            { id: 2, preference: 'Vegan' },
            { id: 3, preference: 'Non-vegetarian' }
          ]
        });
      case '/api/form_data/religious-options':
        return Promise.resolve({
          data: [
            { id: 1, restriction: 'None' },
            { id: 2, restriction: 'Halal' }
          ]
        });
      case '/api/form_data/allergen-options':
        return Promise.resolve({
          data: [
            { id: 1, allergen: 'Peanuts' },
            { id: 2, allergen: 'Dairy' }
          ]
        });
      case '/api/form_data/cuisine-options':
        return Promise.resolve({
          data: [
            { id: 1, type: 'Italian' },
            { id: 2, type: 'Chinese' }
          ]
        });
      default:
        return Promise.resolve({ data: {} });
    }
  });
});

afterEach(() => {
  vi.resetAllMocks();
});

test('renders price range options correctly', async () => {
  render(
    <Provider store={store}>
      <PreferencesForm />
    </Provider>
  );

  const select = await screen.findByTestId('max-price-range-select');
  expect(select).toBeInTheDocument();

  await userEvent.click(select);

  await waitFor(() => {
    expect(screen.getByTestId('price-range-option-1')).toBeInTheDocument();
    expect(screen.getByTestId('price-range-option-2')).toBeInTheDocument();
    expect(screen.getByTestId('price-range-option-3')).toBeInTheDocument();
    expect(screen.getByTestId('price-range-option-4')).toBeInTheDocument();
  });
});

test('renders meat preference options correctly', async () => {
  render(
    <Provider store={store}>
      <PreferencesForm />
    </Provider>
  );

  const select = await screen.findByTestId('meat-preference-select');
  expect(select).toBeInTheDocument();

  await userEvent.click(select);

  await waitFor(() => {
    expect(screen.getByTestId('meat-preference-option-1')).toBeInTheDocument();
    expect(screen.getByTestId('meat-preference-option-2')).toBeInTheDocument();
    expect(screen.getByTestId('meat-preference-option-3')).toBeInTheDocument();
  });
});

test('renders religious restrictions options correctly', async () => {
  render(
    <Provider store={store}>
      <PreferencesForm />
    </Provider>
  );

  const select = await screen.findByTestId('religious-restrictions-select');
  expect(select).toBeInTheDocument();

  await userEvent.click(select);

  await waitFor(() => {
    expect(screen.getByTestId('religious-restrictions-option-1')).toBeInTheDocument();
    expect(screen.getByTestId('religious-restrictions-option-2')).toBeInTheDocument();
  });
});

test('allows setting and updating user preferences', async () => {
  render(
    <Provider store={store}>
      <PreferencesForm />
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByTestId('max-price-range-select')).toBeInTheDocument();
    expect(screen.getByTestId('meat-preference-select')).toBeInTheDocument();
    expect(screen.getByTestId('religious-restrictions-select')).toBeInTheDocument();
    expect(screen.getByTestId('allergens-select')).toBeInTheDocument();
    expect(screen.getByTestId('cuisine-types-select')).toBeInTheDocument();
  });

  const maxPriceRangeSelect = screen.getByTestId('max-price-range-select');
  await userEvent.click(maxPriceRangeSelect);

  await waitFor(() => {
    expect(screen.getByTestId('price-range-option-4')).toBeInTheDocument();
  });

  await userEvent.selectOptions(maxPriceRangeSelect, '4');
  await userEvent.selectOptions(screen.getByTestId('meat-preference-select'), '1');
  await userEvent.selectOptions(screen.getByTestId('religious-restrictions-select'), '1');

  // Select allergens
  await userEvent.click(screen.getByTestId('allergens-select'));
  await userEvent.click(screen.getByTestId('allergen-option-1'));
  await userEvent.click(screen.getByTestId('allergen-option-2'));
  await userEvent.click(document.body); // Close the allergen dropdown

  // Select cuisine types
  await userEvent.click(screen.getByTestId('cuisine-types-select'));
  await userEvent.click(screen.getByTestId('cuisine-types-option-1'));
  await userEvent.click(document.body); // Close the cuisine types dropdown

  await userEvent.type(screen.getByTestId('max-distance-input'), '10');
  await userEvent.click(screen.getByTestId('open-now-checkbox'));

  // Submit the form
  await userEvent.click(screen.getByTestId('save-preferences-button'));

  // Check if the dispatch function was called with the correct arguments
  await waitFor(() => {
    expect(store.getActions()).toContainEqual({
      type: 'UPDATE_PREFERENCES',
      payload: expect.objectContaining({
        user_id: 1,
        max_price_range: 4, // Now using the ID instead of the string
        meat_preference: '1',
        religious_restrictions: '1',
        max_distance: '10',
        open_now: true,
        accepts_large_parties: true,
        allergens: [1, 2],
        cuisine_types: [1],
      }),
    });
  });
});