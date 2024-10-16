// tests/unit/components/CreateGroupForm/GroupForm.test.jsx
// tests/unit/components/CreateGroupForm/GroupForm.test.jsx
import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
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

  // Add more tests as needed
});