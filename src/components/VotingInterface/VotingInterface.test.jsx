import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import { MemoryRouter, Route } from 'react-router-dom';
import VotingInterface from './VotingInterface';

// Mock axios
vi.mock('axios');

// Mock useParams
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: () => ({
      groupId: '1',
    }),
    useHistory: () => ({
      push: vi.fn(),
    }),
  };
});

describe('VotingInterface', () => {
  const mockRestaurants = [
    { id: 1, name: 'Restaurant 1', rating: 4.5, price_level: '$$', address: '123 Main St' },
    { id: 2, name: 'Restaurant 2', rating: 4.0, price_level: '$', address: '456 Elm St' },
  ];

  const mockVotes = [
    { restaurant_id: 1, vote_count: 3 },
    { restaurant_id: 2, vote_count: 1 },
  ];

  beforeEach(() => {
    axios.get.mockReset();
  });

  test('renders loading state initially', () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });
    axios.get.mockResolvedValueOnce({ data: mockVotes });

    render(
      <MemoryRouter>
        <VotingInterface />
      </MemoryRouter>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders restaurants and votes after loading', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });
    axios.get.mockResolvedValueOnce({ data: mockVotes });

    render(
      <MemoryRouter>
        <VotingInterface />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
      expect(screen.getByText('Restaurant 2')).toBeInTheDocument();
      expect(screen.getByText('Votes: 3')).toBeInTheDocument();
      expect(screen.getByText('Votes: 1')).toBeInTheDocument();
    });
  });

  test('handles voting', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });
    axios.get.mockResolvedValueOnce({ data: mockVotes });
    axios.post.mockResolvedValueOnce({});

    render(
      <MemoryRouter>
        <VotingInterface />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
    });

    const voteButtons = screen.getAllByText('Vote');
    fireEvent.click(voteButtons[0]);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/api/votes', { groupId: '1', restaurantId: 1 });
      expect(screen.getByText('Votes: 4')).toBeInTheDocument();
    });
  });

  test('navigates to restaurant details on click', async () => {
    axios.get.mockResolvedValueOnce({ data: mockRestaurants });
    axios.get.mockResolvedValueOnce({ data: mockVotes });

    const mockHistoryPush = vi.fn();
    vi.mock('react-router-dom', async () => {
      const actual = await vi.importActual('react-router-dom');
      return {
        ...actual,
        useParams: () => ({
          groupId: '1',
        }),
        useHistory: () => ({
          push: mockHistoryPush,
        }),
      };
    });

    render(
      <MemoryRouter>
        <VotingInterface />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Restaurant 1')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Restaurant 1'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/restaurant/1');
  });

  test('displays error message on fetch failure', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network error'));

    render(
      <MemoryRouter>
        <VotingInterface />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch data. Please try again later.')).toBeInTheDocument();
    });
  });
});
