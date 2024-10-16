// tests/unit/components/LoginForm.test.jsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginForm from '../../../src/components/LoginForm/LoginForm';

const mockStore = configureStore([]);

describe('LoginForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      errors: {
        loginMessage: '',
      },
    });
    store.dispatch = vi.fn();
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

  test('dispatches LOGIN action on form submission', () => {
    render(
      <Provider store={store}>
        <LoginForm />
      </Provider>
    );
    
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'testpass' } });
    fireEvent.click(screen.getByRole('button', { name: /log in/i }));

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'LOGIN',
      payload: {
        username: 'testuser',
        password: 'testpass',
      },
    });
  });
});