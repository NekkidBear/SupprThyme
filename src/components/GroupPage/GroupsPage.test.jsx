import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import axios from 'axios';
import GroupsPage from './GroupsPage';

// Mock axios
vi.mock('axios');

// Mock useHistory
const mockHistoryPush = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useHistory: () => ({
      push: mockHistoryPush,
    }),
  };
});

// Mock Redux store
const mockStore = configureStore([]);

describe('GroupsPage', () => {
  let store;

  const mockGroups = [
    { id: 1, group_name: 'Group 1', members: [{ username: 'user1' }, { username: 'user2' }] },
    { id: 2, group_name: 'Group 2', members: [{ username: 'user3' }, { username: 'user4' }] },
  ];

  beforeEach(() => {
    store = mockStore({
      user: { id: 1 },
    });
    axios.get.mockResolvedValue({ data: mockGroups });
  });

  test('renders GroupsPage component and fetches groups', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GroupsPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByText('My Groups')).toBeInTheDocument();
    expect(axios.get).toHaveBeenCalledWith('/api/groups');

    await waitFor(() => {
      expect(screen.getByText('Group 1')).toBeInTheDocument();
      expect(screen.getByText('Group 2')).toBeInTheDocument();
    });
  });

  test('handles create group button click', () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GroupsPage />
        </BrowserRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Create a Group'));
    expect(mockHistoryPush).toHaveBeenCalledWith('/groupForm');
  });

  test('handles edit group button click', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GroupsPage />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const editButtons = screen.getAllByText('Edit Group');
      fireEvent.click(editButtons[0]);
    });

    expect(mockHistoryPush).toHaveBeenCalledWith({
      pathname: '/groupForm',
      state: { group: mockGroups[0] },
    });
  });

  test('handles search restaurants button click', async () => {
    render(
      <Provider store={store}>
        <BrowserRouter>
          <GroupsPage />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const searchButtons = screen.getAllByText('Search for Restaurants');
      fireEvent.click(searchButtons[0]);
    });

    expect(mockHistoryPush).toHaveBeenCalledWith('/search-results/1');
  });

  test('handles delete group', async () => {
    axios.delete.mockResolvedValue({});

    render(
      <Provider store={store}>
        <BrowserRouter>
          <GroupsPage />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      const deleteButtons = screen.getAllByText('Delete Group');
      fireEvent.click(deleteButtons[0]);
    });

    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith('/api/groups/1');
      expect(screen.getByText('Group "Group 1" deleted successfully')).toBeInTheDocument();
    });
  });

  test('displays error message when fetching groups fails', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <Provider store={store}>
        <BrowserRouter>
          <GroupsPage />
        </BrowserRouter>
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Error: Failed to fetch groups. Please try again later.')).toBeInTheDocument();
    });
  });

  test('displays loading state', () => {
    axios.get.mockReturnValue(new Promise(() => {})); // Never resolves

    render(
      <Provider store={store}>
        <BrowserRouter>
          <GroupsPage />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });
});
