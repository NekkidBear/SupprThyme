import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import PreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm'; // Adjust the import path as necessary

const mockStore = configureStore([]);
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

test('renders price range options correctly', async () => {
  render(
    <Provider store={store}>
      <PreferencesForm />
    </Provider>
  );

  // Wait for the dropdown to be populated
  await waitFor(() => expect(screen.getByLabelText('Max Price Range')).toBeInTheDocument());

  const dropdown = screen.getByLabelText('Max Price Range');
  expect(dropdown).toBeInTheDocument();

  // Check if the dropdown contains the correct options
  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(4);
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

  // Wait for the dropdown to be populated
  await waitFor(() => expect(screen.getByLabelText('Meat Preference')).toBeInTheDocument());

  const dropdown = screen.getByLabelText('Meat Preference');
  expect(dropdown).toBeInTheDocument();

  // Check if the dropdown contains the correct options
  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(2);
  expect(options[0]).toHaveTextContent('Vegetarian');
  expect(options[1]).toHaveTextContent('Omnivore');
});

test('renders religious restrictions options correctly', async () => {
  render(
    <Provider store={store}>
      <PreferencesForm />
    </Provider>
  );

  // Wait for the dropdown to be populated
  await waitFor(() => expect(screen.getByLabelText('Religious Restrictions')).toBeInTheDocument());

  const dropdown = screen.getByLabelText('Religious Restrictions');
  expect(dropdown).toBeInTheDocument();

  // Check if the dropdown contains the correct options
  const options = screen.getAllByRole('option');
  expect(options).toHaveLength(2);
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

  // Wait for the form to be fully rendered
  await waitFor(() => {
    expect(screen.getByLabelText('Max Price Range')).toBeInTheDocument();
  });

  // Open the Max Price Range dropdown
  const maxPriceRangeSelect = screen.getByLabelText('Max Price Range');
  await user.click(maxPriceRangeSelect);

  // Wait for the options to be visible
  await waitFor(() => {
    expect(screen.getByText('$$$$')).toBeInTheDocument();
  });

  // Select options and fill in fields
  await user.selectOptions(maxPriceRangeSelect, '4'); // Select by value (ID)
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
