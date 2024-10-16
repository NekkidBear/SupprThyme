// tests/unit/components/PreferencesForm/PreferencesForm.test.jsx
import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserPreferencesForm from '../../../../src/components/PreferencesForm/PreferencesForm';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

vi.mock('axios');

const mockStore = configureStore([]);

describe('UserPreferencesForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: 1 },
    });
    store.dispatch = vi.fn();

    // Mock API calls
    axios.get.mockImplementation((url) => {
      const mockData = {
        '/api/form_data/price-ranges': { data: [{ id: 1, range: '$' }, { id: 2, range: '$$' }] },
        '/api/form_data/meat-preferences': { data: [{ id: 1, preference: 'Vegetarian' }, { id: 2, preference: 'Omnivore' }] },
        '/api/form_data/religious-restrictions': { data: [{ id: 1, restriction: 'None' }, { id: 2, restriction: 'Halal' }] },
        '/api/form_data/allergen-options': { data: [{ id: 1, allergen: 'Peanuts' }, { id: 2, allergen: 'Dairy' }] },
        '/api/form_data/cuisine-options': { data: [{ id: 1, type: 'Italian' }, { id: 2, type: 'Chinese' }] },
      };
      return Promise.resolve(mockData[url]);
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
      expect(screen.getByText('Open Now')).toBeInTheDocument();
      expect(screen.getByText('Accepts Large Parties')).toBeInTheDocument();
    });
  });

  test('allows setting and updating user preferences', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm onSubmit={vi.fn()} />
      </Provider>
    );

    await waitFor(() => {
      userEvent.selectOptions(screen.getByLabelText('Max Price Range'), '2');
      userEvent.selectOptions(screen.getByLabelText('Meat Preference'), '1');
      userEvent.type(screen.getByLabelText('Max Distance'), '10');
      userEvent.click(screen.getByLabelText('Open Now'));
    });

    userEvent.click(screen.getByText('Save Preferences'));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'UPDATE_PREFERENCES',
        payload: expect.objectContaining({
          max_price_range: '2',
          meat_preference: '1',
          max_distance: '10',
          open_now: true,
        })
      }));
    });
  });
});