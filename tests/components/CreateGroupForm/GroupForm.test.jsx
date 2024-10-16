import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import GroupForm from '../../../src/components/CreateGroupForm/GroupForm';

// Mock the modules
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    useLocation: () => ({ state: undefined }),
  };
});

vi.mock('axios');

describe('GroupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders group form', () => {
    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    expect(screen.getByText('New Group')).toBeInTheDocument();
    expect(screen.getByLabelText('Group Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Search Users')).toBeInTheDocument();
    expect(screen.getByText('Create Group')).toBeInTheDocument();
  });

  test('searches for users', async () => {
    const mockSearchResults = [
      { id: 1, username: 'user1' },
      { id: 2, username: 'user2' },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockSearchResults),
      })
    );

    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Search Users'), { target: { value: 'user' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('user1')).toBeInTheDocument();
      expect(screen.getByText('user2')).toBeInTheDocument();
    });
  });

  test('creates a new group', async () => {
    axios.post.mockResolvedValue({ data: { group: { id: 1, name: 'Test Group' } } });

    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText('Group Name'), { target: { value: 'Test Group' } });
    fireEvent.click(screen.getByText('Create Group'));

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/groups', {
        name: 'Test Group',
        members: [],
      });
    });
  });

  test('updates an existing group', async () => {
    const mockGroup = {
      id: 1,
      group_name: 'Existing Group',
      members: [{ id: 1, username: 'user1' }],
    };

    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useNavigate: () => vi.fn(),
        useLocation: () => ({ state: { group: mockGroup } }),
      };
    });

    axios.put.mockResolvedValue({ data: { group: mockGroup } });

    render(
      <MemoryRouter>
        <GroupForm />
      </MemoryRouter>
    );

    expect(screen.getByDisplayValue('Existing Group')).toBeInTheDocument();
    expect(screen.getByText('user1')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith('/api/groups/1', {
        group_name: 'Existing Group',
        members: [1],
      });
    });
  });
});
