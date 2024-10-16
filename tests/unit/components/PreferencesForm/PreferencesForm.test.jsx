// tests/unit/components/PreferencesForm/PreferencesForm.test.jsx
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
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
      fireEvent.change(screen.getByLabelText('Max Price Range'), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText('Meat Preference'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Max Distance'), { target: { value: '10' } });
      fireEvent.click(screen.getByLabelText('Open Now'));
    });

    fireEvent.click(screen.getByText('Save Preferences'));

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

  // Add more tests as needed
});