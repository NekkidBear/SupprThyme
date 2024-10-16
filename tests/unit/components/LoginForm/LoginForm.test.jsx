// tests/unit/components/LoginForm/LoginForm.test.jsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import LoginForm from '../../../src/components/LoginForm/LoginForm'; // Corrected path

const mockStore = configureStore([]);

describe('LoginForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: null },
      errors: { loginMessage: '' },
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
  });

  // Add more tests as needed
});