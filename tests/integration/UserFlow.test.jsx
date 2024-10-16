// tests/integration/UserFlow.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MemoryRouter } from 'react-router-dom';
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
        payload: { username: 'testuser', password: 'testpass' },
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
        payload: { groupName: 'Test Group' },
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
        payload: {
          maxPriceRange: '2',
          meatPreference: 'vegetarian',
          maxDistance: '10',
          openNow: true,
        },
      }));
    });
  });

  test('user cannot login with incorrect credentials', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Attempt to login with incorrect credentials
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wronguser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'LOGIN',
        payload: { username: 'wronguser', password: 'wrongpass' },
      }));
    });

    // Check for error message
    expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
  });

  test('user can logout', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Logout
    fireEvent.click(screen.getByText(/logout/i));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'LOGOUT',
      }));
    });

    // Check if redirected to login page
    expect(screen.getByText(/log in/i)).toBeInTheDocument();
  });

  test('user can navigate to profile page', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/dashboard']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Navigate to profile page
    fireEvent.click(screen.getByText(/profile/i));

    // Check if profile page is displayed
    expect(screen.getByText(/user profile/i)).toBeInTheDocument();
  });

  test('user can update profile information', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/profile']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Update profile information
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'newemail@example.com' } });
    fireEvent.click(screen.getByText(/save changes/i));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'UPDATE_PROFILE',
        payload: { email: 'newemail@example.com' },
      }));
    });

    // Check if success message is displayed
    expect(screen.getByText(/profile updated successfully/i)).toBeInTheDocument();
  });
});