import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
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
            { id: 2, preference: 'Omnivore' }
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

  await waitFor(() => {
    expect(screen.getByTestId('max-price-range-select')).toBeInTheDocument();
  });

  const dropdown = screen.getByTestId('max-price-range-select');
  expect(dropdown).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole('option').length).toBe(4);
  });

  const options = screen.getAllByRole('option');
  expect(options[0]).toHaveTextContent('$');
  expect(options[1]).toHaveTextContent('$$');
  expect(options[2]).toHaveTextContent('$$$');
  expect(options[3]).toHaveTextContent('$$$$');
});

test('renders meat preference options correctly', async () => {
  render(
    <Provider store={store}>
      <PreferencesForm />
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByTestId('meat-preference-select')).toBeInTheDocument();
  });

  const dropdown = screen.getByTestId('meat-preference-select');
  expect(dropdown).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole('option').length).toBe(2);
  });

  const options = screen.getAllByRole('option');
  expect(options[0]).toHaveTextContent('Vegetarian');
  expect(options[1]).toHaveTextContent('Omnivore');
});

test('renders religious restrictions options correctly', async () => {
  render(
    <Provider store={store}>
      <PreferencesForm />
    </Provider>
  );

  await waitFor(() => {
    expect(screen.getByTestId('religious-restrictions-select')).toBeInTheDocument();
  });

  const dropdown = screen.getByTestId('religious-restrictions-select');
  expect(dropdown).toBeInTheDocument();

  await waitFor(() => {
    expect(screen.getAllByRole('option').length).toBe(2);
  });

  const options = screen.getAllByRole('option');
  expect(options[0]).toHaveTextContent('None');
  expect(options[1]).toHaveTextContent('Halal');
});

test('allows setting and updating user preferences', async () => {
  const user = userEvent.setup();
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
  await user.click(maxPriceRangeSelect);

  await waitFor(() => {
    expect(screen.getByText('$$$$')).toBeInTheDocument();
  });

  await user.selectOptions(maxPriceRangeSelect, '4');
  await user.selectOptions(screen.getByTestId('meat-preference-select'), '1');
  await user.selectOptions(screen.getByTestId('religious-restrictions-select'), '1');

  // Select allergens
  await user.click(screen.getByTestId('allergens-select'));
  await user.click(screen.getByText('Peanuts'));
  await user.click(screen.getByText('Dairy'));
  await user.click(document.body); // Close the allergen dropdown

  // Select cuisine types
  await user.click(screen.getByTestId('cuisine-types-select'));
  await user.click(screen.getByText('Italian'));
  await user.click(document.body); // Close the cuisine types dropdown

  await user.type(screen.getByTestId('max-distance-input'), '10');
  await user.click(screen.getByTestId('open-now-checkbox'));

  // Submit the form
  await user.click(screen.getByTestId('save-preferences-button'));

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
