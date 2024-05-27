import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import GroupForm from './GroupForm';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch the groups owned by the logged-in user when the component mounts
    const fetchGroups = async () => {
      const response = await axios.get('/api/groups');
      setGroups(response.data);
    };

    fetchGroups();
  }, []);

  const handleCreateGroup = () => {
    // Navigate to the GroupForm component
    history.push('/groupForm');
  };

  const handleSearchRestaurants = (groupId) => {
    // Navigate to the search results screen with the group ID
    history.push(`/searchResults/${groupId}`);
  };

  return (
    <div>
      <button onClick={handleCreateGroup}>Create a Group</button>
      {groups.map((group) => (
        <div key={group.id}>
          <h2>{group.name}</h2>
          <button onClick={() => handleSearchRestaurants(group.id)}>
            Search for Restaurants
          </button>
        </div>
      ))}
    </div>
  );
}