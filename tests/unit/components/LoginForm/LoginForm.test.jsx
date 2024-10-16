// tests/unit/components/LoginForm/LoginForm.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginForm from '../../src/components/LoginForm/LoginForm';

const mockStore = configureStore([]);

describe('LoginForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      errors: { loginMessage: '' },
    });
    store.dispatch = jest.fn();
  });

  test('renders login form', () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /log in/i })).toBeInTheDocument();
  });

  test('dispatches LOGIN action on form submission', async () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

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
  });

  test('displays error message when login fails', () => {
    store = mockStore({
      errors: { loginMessage: 'Invalid username or password' },
    });

    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );

    expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
  });
});