// tests/integration/UserFlow.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import App from '../../src/components/App/App';

const mockStore = configureStore([]);

describe('User Flow', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: null },
      errors: { loginMessage: '' },
    });
    store.dispatch = vi.fn();
  });

  test('user can login, create a group, and set preferences', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Login
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'LOGIN',
        payload: expect.any(Object),
      }));
    });

    // Navigate to create group page
    fireEvent.click(screen.getByText(/create group/i));

    // Create a group
    fireEvent.change(screen.getByLabelText(/group name/i), { target: { value: 'Test Group' } });
    fireEvent.click(screen.getByText(/create group/i));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'CREATE_GROUP',
        payload: expect.any(Object),
      }));
    });

    // Navigate to preferences page
    fireEvent.click(screen.getByText(/set preferences/i));

    // Set preferences
    fireEvent.change(screen.getByLabelText(/max price range/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/meat preference/i), { target: { value: 'vegetarian' } });
    fireEvent.change(screen.getByLabelText(/max distance/i), { target: { value: '10' } });
    fireEvent.click(screen.getByLabelText(/open now/i));
    fireEvent.click(screen.getByText(/save preferences/i));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'SET_USER_PREFERENCES',
        payload: expect.any(Object),
      }));
    });
  });
});