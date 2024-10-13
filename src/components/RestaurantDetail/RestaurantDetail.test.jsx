import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import axios from 'axios';
import RestaurantDetail from './RestaurantDetail';

// Mock axios
vi.mock('axios');

// Mock useParams
vi.mock('react-router-dom', () => ({
  useParams: () => ({ restaurantId: '123' }),
}));

describe('RestaurantDetail', () => {
  const mockRestaurant = {
    id: '123',
    name: 'Test Restaurant',
    rating: 4.5,
    price_level: '$$',
    address: '123 Test St, Test City',
    phone: '(123) 456-7890',
    website: 'https://testrestaurant.com',
    image_url: 'https://testrestaurant.com/image.jpg',
    cuisine_types: ['Italian', 'Pizza'],
    hours: ['Monday: 9AM-9PM', 'Tuesday: 9AM-9PM'],
  };

  beforeEach(() => {
    axios.get.mockReset();
  });

  test('renders loading state initially', () => {
    axios.get.mockReturnValue(new Promise(() => {})); // Never resolves

    render(<RestaurantDetail />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders restaurant details after successful fetch', async () => {
    axios.get.mockResolvedValue({ data: mockRestaurant });

    render(<RestaurantDetail />);

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
      expect(screen.getByText('Rating: 4.5 / 5')).toBeInTheDocument();
      expect(screen.getByText('Price: $$')).toBeInTheDocument();
      expect(screen.getByText('Address: 123 Test St, Test City')).toBeInTheDocument();
      expect(screen.getByText('Phone: (123) 456-7890')).toBeInTheDocument();
      expect(screen.getByText('Website:')).toBeInTheDocument();
      expect(screen.getByText('https://testrestaurant.com')).toHaveAttribute('href', 'https://testrestaurant.com');
      expect(screen.getByText('Italian')).toBeInTheDocument();
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('Monday: 9AM-9PM')).toBeInTheDocument();
      expect(screen.getByText('Tuesday: 9AM-9PM')).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith('/api/restaurants/123');
  });

  test('renders error message on fetch failure', async () => {
    axios.get.mockRejectedValue(new Error('Failed to fetch'));

    render(<RestaurantDetail />);

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch restaurant details. Please try again.')).toBeInTheDocument();
    });
  });

  test('renders "Restaurant not found" when no restaurant data', async () => {
    axios.get.mockResolvedValue({ data: null });

    render(<RestaurantDetail />);

    await waitFor(() => {
      expect(screen.getByText('Restaurant not found.')).toBeInTheDocument();
    });
  });

  test('renders restaurant details without optional fields', async () => {
    const partialRestaurant = {
      id: '123',
      name: 'Test Restaurant',
      rating: 4.5,
      price_level: '$$',
      address: '123 Test St, Test City',
    };

    axios.get.mockResolvedValue({ data: partialRestaurant });

    render(<RestaurantDetail />);

    await waitFor(() => {
      expect(screen.getByText('Test Restaurant')).toBeInTheDocument();
      expect(screen.getByText('Rating: 4.5 / 5')).toBeInTheDocument();
      expect(screen.getByText('Price: $$')).toBeInTheDocument();
      expect(screen.getByText('Address: 123 Test St, Test City')).toBeInTheDocument();
      expect(screen.queryByText('Phone:')).not.toBeInTheDocument();
      expect(screen.queryByText('Website:')).not.toBeInTheDocument();
      expect(screen.queryByText('Cuisine Types:')).not.toBeInTheDocument();
      expect(screen.queryByText('Hours:')).not.toBeInTheDocument();
    });
  });
});
