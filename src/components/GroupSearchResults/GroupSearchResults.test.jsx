import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import GroupSearchResults from './GroupSearchResults';

// Mock axios
vi.mock('axios');

// Mock useParams and useHistory
const mockHistoryPush = vi.fn();
vi.mock('react-router-dom', () => ({
  useParams: () => ({ groupId: '123' }),
  useHistory: () => ({ push: mockHistoryPush }),
}));

describe('GroupSearchResults', () => {
  const mockResults = [
    { id: '1', name: 'Restaurant 1', rating: 4.5, price_level: '$$', address: '123 Test St' },
    { id: '2', name: 'Restaurant 2', rating: 4.0, price_level: '$', address: '456 Mock Ave' },
  ];

  beforeEach(() => {
    axios.get.mockReset();
  });

  test('renders loading state initially', () => {
    axios.get.mockReturnValue(new Promise(() => {})); // Never resolves

    render(<GroupSearchResults />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders search results after successful fetch', async () => {
    axios.get.mockResolvedValue({ data: mockResults });

    render(<GroupSearchResults />);

    await waitFor(() => {
      expect(screen.getByText('Group Search Results')).toBeInTheDocument();
      expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
      expect(screen.getByText('Restaurant 2')).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith('/api/restaurants/search?groupId=123');
  });

  test('renders error message on fetch failure', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch'));

    render(<GroupSearchResults />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch search results. Please try again.')).toBeInTheDocument();
    });
  });

  test('navigates to restaurant details on restaurant click', async () => {
    axios.get.mockResolvedValue({ data: mockResults });

    render(<GroupSearchResults />);

    await waitFor(() => {
      expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Restaurant 1'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/restaurant/1');
  });

  test('navigates to voting page on "Start Voting" button click', async () => {
    axios.get.mockResolvedValue({ data: mockResults });

    render(<GroupSearchResults />);

    await waitFor(() => {
      expect(screen.getByText('Start Voting')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Start Voting'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/voting/123');
  });

  test('does not render "Start Voting" button when no results', async () => {
    axios.get.mockResolvedValue({ data: [] });

    render(<GroupSearchResults />);

    await waitFor(() => {
      expect(screen.queryByText('Start Voting')).not.toBeInTheDocument();
    });
  });
});
