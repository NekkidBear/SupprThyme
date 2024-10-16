import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginForm from '../../../src/components/LoginForm/LoginForm';

// Mock the Redux store
const mockStore = configureStore([]);

describe('LoginForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      errors: {
        loginMessage: '',
      },
    });

    // Mock dispatch
    store.dispatch = vi.fn();

    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ city: 'Test City', state: 'Test State' }),
      })
    );
  });

  test('renders login form', () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('dispatches LOGIN action on form submission', async () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'testpass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'LOGIN',
      payload: {
        username: 'testuser',
        password: 'testpass',
        latitude: null,
        longitude: null,
      },
    });
  });

  test('displays error message when login fails', () => {
    store = mockStore({
      errors: {
        loginMessage: 'Invalid username or password',
      },
    });

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });
});
