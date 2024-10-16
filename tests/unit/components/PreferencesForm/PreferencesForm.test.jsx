// tests/unit/components/UserPreferencesForm.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import UserPreferencesForm from '../../../src/components/UserPreferencesForm/UserPreferencesForm';

const mockStore = configureStore([]);

describe('UserPreferencesForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: 1 },
    });
    store.dispatch = vi.fn();
  });

  test('renders user preferences form', async () => {
    render(
      <Provider store={store}>
        <UserPreferencesForm />
      </Provider>
    );

    expect(screen.getByLabelText(/max price range/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/meat preference/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/religious restrictions/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max distance/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/open now/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/accepts large parties/i)).toBeInTheDocument();
  });

  test('submits user preferences', async () => {
    const mockSubmit = vi.fn();
    render(
      <Provider store={store}>
        <UserPreferencesForm onSubmit={mockSubmit} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/max price range/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/meat preference/i), { target: { value: 'vegetarian' } });
    fireEvent.change(screen.getByLabelText(/max distance/i), { target: { value: '10' } });
    fireEvent.click(screen.getByLabelText(/open now/i));

    fireEvent.click(screen.getByText(/save preferences/i));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
        max_price_range: '2',
        meat_preference: 'vegetarian',
        max_distance: '10',
        open_now: true,
      }));
    });
  });
});