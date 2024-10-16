// tests/integration/UserFlow.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import App from '../../src/components/App/App'; // Adjust the path as necessary
import { vi } from 'vitest';

const mockStore = configureStore([]);

describe('User Flow', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: null },
      errors: { loginMessage: '' },
    });
    store.dispatch = vi.fn();

    // Mock API calls
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
  });

  test('user can login, create a group, and set preferences', async () => {
    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    // Perform login
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpass' } });

    // Wait for the button to be available
    await waitFor(() => screen.getByRole('button', { name: /log in/i }));

    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'LOGIN',
        payload: { username: 'testuser', password: 'testpass' },
      }));
    });

    // Additional steps for creating a group and setting preferences
    // ...
  });

  test('user can navigate to profile page and update information', async () => {
    store = mockStore({
      user: { id: 1, username: 'testuser' },
    });

    render(
      <Provider store={store}>
        <App />
      </Provider>
    );

    fireEvent.click(screen.getByText(/my profile/i));

    await waitFor(() => {
      expect(screen.getByText(/welcome, testuser!/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/update account information/i));
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'newemail@test.com' } });
    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'UPDATE_USER',
        payload: { email: 'newemail@test.com' },
      }));
    });

    // Check if success message is displayed
    expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
  });
});