import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserPreferencesForm from './UserPreferencesForm';

// Mock axios
vi.mock('axios');

// Mock Redux store
const mockStore = configureStore([]);

describe('UserPreferencesForm', () => {
  let store;

  const mockUser = {
    id: 1,
    username: 'testuser',
  };

  const mockPreferences = {
    address: '123 Test St',
    city: 'Test City',
    state: 'TS',
    zipCode: '12345',
    cuisineTypes: ['Italian', 'Chinese'],
    dietaryRestrictions: ['Vegetarian'],
    priceRange: '$$',
  };

  beforeEach(() => {
    store = mockStore({
      user: mockUser,
    });

    axios.get.mockResolvedValue({ data: mockPreferences });
    axios.put.mockResolvedValue({});
  });

  test('renders UserPreferencesForm component', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    expect(screen.getByText('Update Your Preferences')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByLabelText('Address')).toHaveValue('123 Test St');
    });
  });

  test('fetches user preferences on mount', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith('/api/user_preferences/1');
    });
  });

  test('handles input changes', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Address')).toBeInTheDocument();
    });

    const addressInput = screen.getByLabelText('Address');
    fireEvent.change(addressInput, { target: { value: '456 New St' } });

    expect(addressInput).toHaveValue('456 New St');
  });

  test('handles checkbox changes', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Vegetarian')).toBeInTheDocument();
    });

    const veganCheckbox = screen.getByLabelText('Vegan');
    fireEvent.click(veganCheckbox);

    expect(veganCheckbox).toBeChecked();
  });

  test('submits form with updated preferences', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByLabelText('Address')).toBeInTheDocument();
    });

    const addressInput = screen.getByLabelText('Address');
    fireEvent.change(addressInput, { target: { value: '456 New St' } });

    const submitButton = screen.getByText('Update Preferences');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/user_preferences/1', expect.objectContaining({
        address: '456 New St',
      }));
    });

    const actions = store.getActions();
    expect(actions).toContainEqual(expect.objectContaining({
      type: 'UPDATE_USER_PREFERENCES',
      payload: expect.objectContaining({
        address: '456 New St',
      }),
    }));
  });
});
