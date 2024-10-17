import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { vi } from 'vitest';
import axios from 'axios';
import PreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm';

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

const renderComponent = () => {
  render(
    <Provider store={store}>
      <PreferencesForm />
    </Provider>
  );
};

test('renders price range options correctly', async () => {
  renderComponent();

  await waitFor(() => {
    const select = screen.getByTestId('max-price-range-select');
    expect(select).toBeInTheDocument();
  }, { timeout: 3000 });

  const select = screen.getByTestId('max-price-range-select');
  await userEvent.click(select);

  await waitFor(() => {
    const options = screen.getAllByTestId(/^price-range-option-/);
    expect(options).toHaveLength(4);
    options.forEach((option, index) => {
      expect(option).toHaveTextContent(['$', '$$', '$$$', '$$$$'][index]);
    });
  }, { timeout: 3000 });
});

test('renders meat preference options correctly', async () => {
  renderComponent();

  await waitFor(() => {
    const select = screen.getByTestId('meat-preference-select');
    expect(select).toBeInTheDocument();
  }, { timeout: 3000 });

  const select = screen.getByTestId('meat-preference-select');
  await userEvent.click(select);

  await waitFor(() => {
    const options = screen.getAllByTestId(/^meat-preference-option-/);
    expect(options).toHaveLength(3);
    options.forEach((option, index) => {
      expect(option).toHaveTextContent(['Vegetarian', 'Vegan', 'Non-vegetarian'][index]);
    });
  }, { timeout: 3000 });
});

test('renders religious restrictions options correctly', async () => {
  renderComponent();

  await waitFor(() => {
    const select = screen.getByTestId('religious-restrictions-select');
    expect(select).toBeInTheDocument();
  }, { timeout: 3000 });

  const select = screen.getByTestId('religious-restrictions-select');
  await userEvent.click(select);

  await waitFor(() => {
    const options = screen.getAllByTestId(/^religious-restrictions-option-/);
    expect(options).toHaveLength(2);
    options.forEach((option, index) => {
      expect(option).toHaveTextContent(['None', 'Halal'][index]);
    });
  }, { timeout: 3000 });
});

test('allows setting and updating user preferences', async () => {
  renderComponent();

  await waitFor(() => {
    expect(screen.getByTestId('max-price-range-select')).toBeInTheDocument();
    expect(screen.getByTestId('meat-preference-select')).toBeInTheDocument();
    expect(screen.getByTestId('religious-restrictions-select')).toBeInTheDocument();
    expect(screen.getByTestId('cuisine-types-select')).toBeInTheDocument();
    expect(screen.getByTestId('max-distance-input')).toBeInTheDocument();
    expect(screen.getByTestId('open-now-checkbox')).toBeInTheDocument();
    expect(screen.getByTestId('accepts-large-parties-checkbox')).toBeInTheDocument();
  }, { timeout: 3000 });

  const maxPriceRangeSelect = screen.getByTestId('max-price-range-select');
  await userEvent.click(maxPriceRangeSelect);
  await userEvent.selectOptions(maxPriceRangeSelect, '4');

  const meatPreferenceSelect = screen.getByTestId('meat-preference-select');
  await userEvent.click(meatPreferenceSelect);
  await userEvent.selectOptions(meatPreferenceSelect, '1');

  const religiousRestrictionsSelect = screen.getByTestId('religious-restrictions-select');
  await userEvent.click(religiousRestrictionsSelect);
  await userEvent.selectOptions(religiousRestrictionsSelect, '1');

  // Select cuisine types
  const cuisineTypesSelect = screen.getByTestId('cuisine-types-select');
  await userEvent.click(cuisineTypesSelect);
  const italianOption = screen.getByText('Italian');
  await userEvent.click(italianOption);
  await userEvent.click(document.body); // Close the cuisine types dropdown

  await userEvent.type(screen.getByTestId('max-distance-input'), '10');
  await userEvent.click(screen.getByTestId('open-now-checkbox'));

  // Submit the form
  await userEvent.click(screen.getByTestId('save-preferences-button'));

  // Check if the dispatch function was called with the correct arguments
  await waitFor(() => {
    const actions = store.getActions();
    const updateAction = actions.find(action => action.type === 'UPDATE_PREFERENCES');
    expect(updateAction).toBeDefined();
    expect(updateAction.payload).toEqual(expect.objectContaining({
      user_id: 1,
      max_price_range: '4',
      meat_preference: '1',
      religious_restrictions: '1',
      max_distance: '10',
      open_now: false,
      accepts_large_parties: true,
      cuisine_types: [1],
    }));
  }, { timeout: 3000 });
});
