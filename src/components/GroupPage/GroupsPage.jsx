import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
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

  const editGroup = (groupId) => {
    console.log(`Editing group with id ${groupId}`);
      // Find the group with the given ID
      const groupToEdit = groups.find(group => group.id === groupId);
    
      // Navigate to the GroupForm component and pass the group data
      history.push({
        pathname: '/groupForm',
        state: { group: groupToEdit }
      });
    };

  const deleteGroup = (groupId, group_name) => {
    //todo
    console.log(`Deleting group ${group_name} with id ${groupId}`);
  };
  return (
    <div>
      <h1>My Groups</h1>
      <h2>Create a group</h2>
      <button onClick={handleCreateGroup}>Create a Group</button>
      <h3>Existing Groups</h3>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Group Name</TableCell>
              <TableCell>Group Members</TableCell>
              <TableCell>Edit Group</TableCell>
              <TableCell>Search with Group</TableCell>
              <TableCell>Delete Group</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {groups.map((group) => (
              <TableRow key={group.id}>
                <TableCell>{group.group_name}</TableCell>
                <TableCell>{group.members.join(", ")}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => editGroup(group.id)}
                  >
                    Edit Group
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={() => handleSearchRestaurants(group.id)}
                  >
                    Search for Restaurants
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => deleteGroup(group.id, group.group_name)}
                  >
                    Delete Group
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
