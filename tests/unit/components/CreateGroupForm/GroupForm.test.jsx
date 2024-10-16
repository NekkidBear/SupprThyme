// tests/unit/components/CreateGroupForm/GroupForm.test.jsx
import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
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
        <GroupForm />
      </Provider>
    );

    expect(screen.getByLabelText(/group name/i)).toBeInTheDocument();
  });

  test('dispatches CREATE_GROUP action on form submission', async () => {
    render(
      <Provider store={store}>
        <GroupForm />
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
      errors: { groupMessage: 'Group creation failed' },
    });

    render(
      <Provider store={store}>
        <GroupForm />
      </Provider>
    );

    expect(screen.getByText('Group creation failed')).toBeInTheDocument();
  });
});