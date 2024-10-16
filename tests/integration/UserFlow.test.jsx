import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import App from '../../src/components/App/App';

// Mock the modules
vi.mock('axios');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

const mockStore = configureStore([]);

describe('User Flow Integration', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: null },
      errors: { loginMessage: '' },
    });

    // Mock API responses
    axios.post.mockResolvedValue({ data: { id: 1, username: 'testuser' } });
    axios.get.mockImplementation((url) => {
      switch (url) {
        case '/api/user/profile':
          return Promise.resolve({ data: { id: 1, username: 'testuser' } });
        case '/api/form_data/price-ranges':
          return Promise.resolve({ data: [{ id: 1, range: '$' }, { id: 2, range: '$$' }] });
        case '/api/form_data/meat-preferences':
          return Promise.resolve({ data: [{ id: 1, preference: 'Vegetarian' }, { id: 2, preference: 'Omnivore' }] });
        case '/api/form_data/religious-options':
          return Promise.resolve({ data: [{ id: 1, restriction: 'None' }, { id: 2, restriction: 'Halal' }] });
        case '/api/form_data/allergen-options':
          return Promise.resolve({ data: [{ id: 1, allergen: 'Peanuts' }, { id: 2, allergen: 'Dairy' }] });
        case '/api/form_data/cuisine-options':
          return Promise.resolve({ data: [{ id: 1, type: 'Italian' }, { id: 2, type: 'Chinese' }] });
        default:
          return Promise.resolve({ data: {} });
      }
    });
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
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Username'), { target: { value: 'testuser' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password' } });
      fireEvent.click(screen.getByRole('button', { name: /log in/i }));
    });

    // Verify login success
    await waitFor(() => {
      expect(store.getActions()).toContainEqual(expect.objectContaining({
        type: 'SET_USER',
        payload: { id: 1, username: 'testuser' },
      }));
    });

    // Navigate to create group page
    await waitFor(() => {
      fireEvent.click(screen.getByText('Create Group'));
    });

    // Create a group
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Group Name'), { target: { value: 'Test Group' } });
      fireEvent.click(screen.getByText('Create Group'));
    });

    // Verify group creation
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/groups', expect.objectContaining({
        name: 'Test Group',
        members: expect.any(Array),
      }));
    });

    // Navigate to preferences page
    await waitFor(() => {
      fireEvent.click(screen.getByText('Set Preferences'));
    });

    // Set preferences
    await waitFor(() => {
      fireEvent.change(screen.getByLabelText('Max Price Range'), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText('Meat Preference'), { target: { value: '2' } });
      fireEvent.change(screen.getByLabelText('Religious Restrictions'), { target: { value: '1' } });
      fireEvent.change(screen.getByLabelText('Max Distance'), { target: { value: '10' } });
      fireEvent.click(screen.getByLabelText('Open Now'));
      fireEvent.click(screen.getByText('Save Preferences'));
    });

    // Verify preferences submission
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/user_preferences', expect.objectContaining({
        user_id: 1,
        max_price_range: '2',
        meat_preference: '2',
        religious_restrictions: '1',
        max_distance: '10',
        open_now: false,
        accepts_large_parties: true,
      }));
    });
  });
});
