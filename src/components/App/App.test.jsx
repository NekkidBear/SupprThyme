import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { vi } from 'vitest';
import configureStore from 'redux-mock-store';
import App from './App';

// Mock child components
vi.mock('../Nav/Nav', () => ({ default: () => <div data-testid="mock-nav">Nav</div> }));
vi.mock('../Footer/Footer', () => ({ default: () => <div data-testid="mock-footer">Footer</div> }));
vi.mock('../LandingPage/LandingPage', () => ({ default: () => <div>LandingPage</div> }));
vi.mock('../LoginPage/LoginPage', () => ({ default: () => <div>LoginPage</div> }));
vi.mock('../RegisterPage/RegisterPage', () => ({ default: () => <div>RegisterPage</div> }));
vi.mock('../UserPage/UserPage', () => ({ default: () => <div>UserPage</div> }));
vi.mock('../HomePage/HomePage', () => ({ default: () => <div>UserHomePage</div> }));
vi.mock('../GroupPage/GroupsPage', () => ({ default: () => <div>GroupsPage</div> }));
vi.mock('../CreateGroupForm/GroupForm', () => ({ default: () => <div>GroupForm</div> }));
vi.mock('../GroupSearchResults/GroupSearchResults', () => ({ default: () => <div>GroupSearchResults</div> }));
vi.mock('../VotingInterface/VotingInterface', () => ({ default: () => <div>VotingInterface</div> }));
vi.mock('../RestaurantDetail/RestaurantDetail', () => ({ default: () => <div>RestaurantDetail</div> }));
vi.mock('../UserPreferencesForm/UserPreferencesForm', () => ({ default: () => <div>UserPreferencesForm</div> }));

const mockStore = configureStore([]);

describe('App', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: null },
    });
    store.dispatch = vi.fn();
  });

  test('renders Nav and Footer', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByTestId('mock-nav')).toBeInTheDocument();
    expect(screen.getByTestId('mock-footer')).toBeInTheDocument();
  });

  test('dispatches FETCH_USER action on mount', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(store.dispatch).toHaveBeenCalledWith({ type: 'FETCH_USER' });
  });

  test('redirects / to /home', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('LandingPage')).toBeInTheDocument();
  });

  test('renders LoginPage for unauthenticated user', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('LoginPage')).toBeInTheDocument();
  });

  test('redirects authenticated user from /login to /user-home', () => {
    store = mockStore({
      user: { id: 1 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/login']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('UserHomePage')).toBeInTheDocument();
  });

  test('renders 404 for unknown route', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/unknown']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
  });

  test('renders UserPage for authenticated user on protected route', () => {
    store = mockStore({
      user: { id: 1 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/user']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('UserPage')).toBeInTheDocument();
  });

  test('redirects unauthenticated user from protected route to /home', () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/user']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('LandingPage')).toBeInTheDocument();
  });

  test('renders GroupsPage for authenticated user', () => {
    store = mockStore({
      user: { id: 1 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/groups']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('GroupsPage')).toBeInTheDocument();
  });

  test('renders GroupForm for authenticated user', () => {
    store = mockStore({
      user: { id: 1 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/group-form']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('GroupForm')).toBeInTheDocument();
  });

  test('renders GroupSearchResults for authenticated user', () => {
    store = mockStore({
      user: { id: 1 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/search-results/1']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('GroupSearchResults')).toBeInTheDocument();
  });

  test('renders VotingInterface for authenticated user', () => {
    store = mockStore({
      user: { id: 1 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/voting/1']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('VotingInterface')).toBeInTheDocument();
  });

  test('renders RestaurantDetail for authenticated user', () => {
    store = mockStore({
      user: { id: 1 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/restaurant/1']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('RestaurantDetail')).toBeInTheDocument();
  });

  test('renders UserPreferencesForm for authenticated user', () => {
    store = mockStore({
      user: { id: 1 },
    });

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/user-preferences']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText('UserPreferencesForm')).toBeInTheDocument();
  });
});
