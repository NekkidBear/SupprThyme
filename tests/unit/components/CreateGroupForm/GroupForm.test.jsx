// tests/unit/components/CreateGroupForm/GroupForm.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import GroupForm from '../../../../src/components/CreateGroupForm/GroupForm'; // Corrected path

const mockStore = configureStore([]);

describe('GroupForm', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      groups: [],
    });
    store.dispatch = vi.fn();
  });

  test('renders group form', () => {
    render(
      <Provider store={store}>
        <Router>
          <GroupForm />
        </Router>
      </Provider>
    );

    expect(screen.getByLabelText(/group name/i)).toBeInTheDocument();
    expect(screen.getByText(/search users/i)).toBeInTheDocument();
    expect(screen.getByText(/create group/i)).toBeInTheDocument();
  });

  test('allows adding and removing group members', async () => {
    render(
      <Provider store={store}>
        <Router>
          <GroupForm />
        </Router>
      </Provider>
    );

    // Mock the search function
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([{ id: 1, username: 'testuser' }]),
      })
    );

    fireEvent.change(screen.getByLabelText(/search users/i), { target: { value: 'test' } });
    fireEvent.click(screen.getByText(/search/i));

    await waitFor(() => {
      expect(screen.getByText('testuser')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/add to group/i));

    expect(screen.getByText('testuser')).toBeInTheDocument();

    fireEvent.click(screen.getByText(/remove/i));

    expect(screen.queryByText('testuser')).not.toBeInTheDocument();
  });

  test('dispatches CREATE_GROUP action on form submission', async () => {
    render(
      <Provider store={store}>
        <Router>
          <GroupForm />
        </Router>
      </Provider>
    );

    fireEvent.change(screen.getByLabelText(/group name/i), { target: { value: 'Test Group' } });
    fireEvent.click(screen.getByRole('button', { name: /create group/i }));

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(expect.objectContaining({
        type: 'CREATE_GROUP',
        payload: { groupName: 'Test Group' },
      }));
    });
  });

  test('displays error message when group creation fails', () => {
    store = mockStore({
      groups: [],
      errors: { createGroupMessage: 'Group creation failed' },
    });

    render(
      <Provider store={store}>
        <Router>
          <GroupForm />
        </Router>
      </Provider>
    );

    expect(screen.getByText('Group creation failed')).toBeInTheDocument();
  });
});