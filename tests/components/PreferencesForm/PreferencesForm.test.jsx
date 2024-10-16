import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import UserPreferencesForm from '../../../src/components/PreferencesForm/PreferencesForm';

// Mock the modules
vi.mock('axios');

// Create a mock store
const mockStore = configureStore([]);

describe('UserPreferencesForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: 1 }
    });

    // Mock API responses
    axios.get.mockImplementation((url) => {
      switch (url) {
        case '/api/form_data/price-ranges':
          return Promise.resolve({ data: [{ id: 1, range: '$' }, { id: 2, range: '$$' }] });
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

  test('renders user preferences form', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Max Price Range')).toBeInTheDocument();
      expect(screen.getByLabelText('Meat Preference')).toBeInTheDocument();
      expect(screen.getByLabelText('Religious Restrictions')).toBeInTheDocument();
      expect(screen.getByLabelText('Cuisine Types')).toBeInTheDocument();
      expect(screen.getByLabelText('Max Distance')).toBeInTheDocument();
      expect(screen.getByLabelText('Open Now')).toBeInTheDocument();
      expect(screen.getByLabelText('Accepts Large Parties')).toBeInTheDocument();
      expect(screen.getByText('Save Preferences')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
    });
  });

  test('submits form with user preferences', async () => {
    const mockOnSubmit = vi.fn().mockResolvedValue({});
    
    render(
      <Provider store={store}>
        <UserPreferencesForm onSubmit={mockOnSubmit} />
      </Provider>
    );

    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Max Price Range'), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText('Meat Preference'), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText('Religious Restrictions'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Max Distance'), { target: { value: '10' } });
      fireEvent.click(screen.getByLabelText('Open Now'));
      fireEvent.click(screen.getByText('Save Preferences'));
    });

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(expect.objectContaining({
        user_id: 1,
        max_price_range: '2',
        meat_preference: '2',
        religious_restrictions: '1',
        max_distance: '10',
        open_now: false,
        accepts_large_parties: true,
      }));
    });
  });

  test('fetches and sets user preferences in edit mode', async () => {
    axios.get.mockImplementation((url) => {
      if (url === '/api/user_preferences/1') {
        return Promise.resolve({
          data: {
            max_price_range: '$$',
            meat_preference: 'Omnivore',
            religious_restrictions: 'None',
            allergens: ['Peanuts'],
            cuisine_types: ['Italian'],
            open_now: false,
            accepts_large_parties: true,
          }
        });
      } else if (url === '/api/user_preferences/ids') {
        return Promise.resolve({
          data: {
            max_price_range: 2,
            meat_preference: 2,
            religious_restrictions: 1,
            allergens: [1],
            cuisine_types: [1],
          }
        });
      }
      return Promise.resolve({ data: {} });
    });

    render(
      <Provider store={store}>
        <UserPreferencesForm editMode={true} />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Max Price Range')).toHaveValue('2');
      expect(screen.getByLabelText('Meat Preference')).toHaveValue('2');
      expect(screen.getByLabelText('Religious Restrictions')).toHaveValue('1');
      expect(screen.getByText('Peanuts')).toBeInTheDocument();
      expect(screen.getByText('Italian')).toBeInTheDocument();
      expect(screen.getByLabelText('Open Now')).not.toBeChecked();
      expect(screen.getByLabelText('Accepts Large Parties')).toBeChecked();
    });
  });
});
