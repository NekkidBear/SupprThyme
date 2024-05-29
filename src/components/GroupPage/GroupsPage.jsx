import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Button } from "@mui/material";
// import GroupForm from '../CreateGroupForm/GroupForm';

export default function GroupsPage() {
  const [groups, setGroups] = useState([]);
  const history = useHistory();

  useEffect(() => {
    // Fetch the groups owned by the logged-in user when the component mounts
    const fetchGroups = async () => {
      const response = await axios.get("/api/groups");
      setGroups(response.data);
    };

    fetchGroups();
    console.log("Groups is:", groups);
  }, []);

  const handleCreateGroup = () => {
    // Navigate to the GroupForm component
    history.push("/groupForm");
  };

  const handleSearchRestaurants = (groupId) => {
    // Navigate to the search results screen with the group ID
    history.push(`/searchResults/${groupId}`);
  };
  
  const editGroup=(groupId) =>{
    //todo
    console.log(`Editing group with id ${groupId}`);
  };

  const deleteGroup=(groupId, group_name) =>{
    //todo
    console.log(`Deleting group ${group_name} with id ${groupId}`);
  }
  return (
    <div>
      <h1>My Groups</h1>
      <h2>Create a group</h2>
      <button onClick={handleCreateGroup}>Create a Group</button>
      <h3>Existing Groups</h3>
      <div>
        <table>
          <thead>
            <tr>
              <th>Group Name</th>
              <th>Group Members</th>
              <th>Edit Group</th>
              <th>Search with Group</th>
              <th>Delete Group</th>
            </tr>
          </thead>
          <tbody>
          {groups.map((group) => (
            <tr key={group.id}>
              <td>{group.group_name}</td>
              <td>{group.members.join(', ')}</td>
              <td>
                <Button variant='contained' color='default' onClick={()=>editGroup(group.id)}>
                  Edit Group
                </Button>
              </td>
              <td>
              <Button variant='contained' color='secondary' onClick={() => handleSearchRestaurants(group.id)}>
                Search for Restaurants
              </Button>
              </td>
              <td>
                <Button variant='contained' color='primary' onClick={()=>deleteGroup(group.id, group.group_name)}>
                  Delete Group
                </Button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
