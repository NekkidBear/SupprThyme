// tests/unit/components/GroupForm.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import GroupForm from '../../../src/components/GroupForm/GroupForm';

const mockStore = configureStore([]);

describe('GroupForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      user: { id: 1 },
    });
    store.dispatch = vi.fn();
  });

  test('renders group form', () => {
    render(
      <Provider store={store}>
        <GroupForm />
      </Provider>
    );

    expect(screen.getByLabelText(/group name/i)).toBeInTheDocument();
    expect(screen.getByText(/create group/i)).toBeInTheDocument();
  });

  test('creates a new group', async () => {
    const mockCreateGroup = vi.fn();
    render(
      <Provider store={store}>
        <GroupForm createGroup={mockCreateGroup} />
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/group name/i), { target: { value: 'Test Group' } });
    fireEvent.click(screen.getByText(/create group/i));

    await waitFor(() => {
      expect(mockCreateGroup).toHaveBeenCalledWith('Test Group');
    });
  });
});