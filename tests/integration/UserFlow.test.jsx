// tests/integration/UserFlow.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
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
    store.dispatch = jest.fn();

    // Mock API calls
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({}),
      })
    );
  });

  test('user can login, create a group, set preferences, and logout', async () => {
    render(
      <Provider store={store}>
        <Router>
          <App />
        </Router>
      </Provider>
    );

    // Login
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

    // Create a group
    fireEvent.click(screen.getByText(/create group/i));
    fireEvent.change(screen.getByLabelText(/group name/i), { target: { value: 'Test Group' } });
    fireEvent.click(screen.getByText(/create group/i));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'CREATE_GROUP',
        payload: { groupName: 'Test Group' },
      }));
    });

    // Set preferences
    fireEvent.click(screen.getByText(/set preferences/i));
    fireEvent.change(screen.getByLabelText(/max price range/i), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText(/meat preference/i), { target: { value: 'vegetarian' } });
    fireEvent.change(screen.getByLabelText(/max distance/i), { target: { value: '10' } });
    fireEvent.click(screen.getByLabelText(/open now/i));
    fireEvent.click(screen.getByText(/save preferences/i));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'SET_USER_PREFERENCES',
        payload: {
          maxPriceRange: '2',
          meatPreference: 'vegetarian',
          maxDistance: '10',
          openNow: true,
        },
      }));
    });

    // Logout
    fireEvent.click(screen.getByText(/log out/i));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'LOGOUT',
      }));
      expect(screen.queryByText(/log out/i)).not.toBeInTheDocument();
    });
  });

  test('user can navigate to profile page and update information', async () => {
    store = mockStore({
      user: { id: 1, username: 'testuser' },
    });

    render(
      <Provider store={store}>
        <Router>
          <App />
        </Router>
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