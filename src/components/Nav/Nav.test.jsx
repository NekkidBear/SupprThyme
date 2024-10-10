import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import Nav from './Nav';

// Mock LogOutButton component
vi.mock('../LogOutButton/LogOutButton', () => ({
  default: () => <button>Logout</button>,
}));

// Mock Redux store
const mockStore = configureStore([]);

describe('Nav', () => {
  let store;

  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('renders Nav component for non-authenticated user', () => {
    store = mockStore({
      user: {},
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Are you hungry?')).toBeInTheDocument();
    expect(screen.getByText('Login / Register')).toBeInTheDocument();
    expect(screen.queryByText('Home')).not.toBeInTheDocument();
  });

  test('renders Nav component for authenticated user', () => {
    store = mockStore({
      user: { id: 1 },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Are you hungry?')).toBeInTheDocument();
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Groups')).toBeInTheDocument();
    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('My Profile')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test('title changes after 1 second', async () => {
    store = mockStore({
      user: {},
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Are you hungry?')).toBeInTheDocument();

    vi.advanceTimersByTime(1000);

    await waitFor(() => {
      expect(screen.getByText("It's SupprThyme!")).toBeInTheDocument();
    });
  });

  test('title fixes on "It\'s SupprThyme!" after 10 seconds', async () => {
    store = mockStore({
      user: {},
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      </Provider>
    );

    vi.advanceTimersByTime(10000);

    await waitFor(() => {
      expect(screen.getByText("It's SupprThyme!")).toBeInTheDocument();
    });

    // Advance time further to ensure title doesn't change
    vi.advanceTimersByTime(2000);

    expect(screen.getByText("It's SupprThyme!")).toBeInTheDocument();
  });

  test('links navigate to correct routes', () => {
    store = mockStore({
      user: { id: 1 },
    });

    render(
      <Provider store={store}>
        <BrowserRouter>
          <Nav />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('Home').closest('a')).toHaveAttribute('href', '/home');
    expect(screen.getByText('Groups').closest('a')).toHaveAttribute('href', '/groups');
    expect(screen.getByText('Preferences').closest('a')).toHaveAttribute('href', '/user-preferences');
    expect(screen.getByText('My Profile').closest('a')).toHaveAttribute('href', '/user');
  });
});
