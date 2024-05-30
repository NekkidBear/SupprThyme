// Import necessary dependencies
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import { makeStyles } from "@mui/styles";
import SelectedUsers from "./SelectedUsers";
import axios from "axios";

// Component for group name input
function GroupNameInput({ groupName, setGroupName }) {
  return (
    <TextField
      label="Group Name"
      value={groupName}
      onChange={(e) => setGroupName(e.target.value)} // Update group name on change
    />
  );
}

// Define styles
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

// Main component for group form
export default function GroupForm() {
  const history = useHistory();
  const classes = useStyles();
  const location = useLocation();
  const group = location.state?.group; // Get group from location state

  // State variables
  const [groupName, setGroupName] = useState(group?.group_name || "");
  const [groupMembers, setGroupMembers] = useState(
    group?.members.map((member) => ({
      id: member.id,
      username: member.username,
    })) || []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState(
    group?.members.map((member) => ({
      id: member.id,
      username: member.username,
    })) || []
  );

  // Function to remove user from selected members
  const handleRemoveUser = (userToRemove) => {
    setSelectedMembers(
      selectedMembers.filter((user) => user.id !== userToRemove.id)
    );
  };

  // Function to search users
  const handleSearch = async () => {
    const users = await searchUsers(searchTerm);
    setSearchResults(users);
  };

  // Function to select user
  const handleSelectUser = (user) => {
    setSelectedMembers((prevMembers) => [
      ...prevMembers,
      { id: user.id, username: user.username },
    ]);
    setSearchResults((prevResults) =>
      prevResults.filter((u) => u.id !== user.id)
    );
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (group) {
      // Update the existing group
      try {
        await axios.put(`/api/groups/${group.id}`, {
          group_name: groupName,
          members: selectedMembers.map((member) => member.id),
        });
        // Redirect to groups page
        history.push("/groups");
      } catch (error) {
        console.error(`Error updating group with ID ${group.id}`, error);
      }
    } else {
      // Create a new group
      try {
        await createGroup(groupName, selectedMembers);
        setGroupName("");
        setSelectedMembers([]);
        history.push("/groups");
      } catch (error) {
        console.error("Error creating group:", error);
      }
    }
  };

  // Function to search users
  async function searchUsers(searchTerm) {
    const response = await fetch(`/api/user/search?search=${searchTerm}`);
    const data = await response.json();
    return data.map((user) => ({ id: user.id, username: user.username }));
  }

  // Function to create group
  async function createGroup(groupName, members) {
    const response = await fetch("/api/groups", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: groupName,
        members: members.map((member) => member.id),
      }),
    });
    const data = await response.json();
    return data.group;
  }

  // Effect to log selected members
  useEffect(() => {
    console.log("Selected members:", selectedMembers);
  }, [selectedMembers]);

  // Render the form
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>New Group</h1>
        <h2>Group Name</h2>
        <GroupNameInput groupName={groupName} setGroupName={setGroupName} />
        <h2>Search</h2>
        <TextField
          label="Search Users"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleSearch}>
          Search
        </Button>
        <h3>Search Results</h3>
        {Array.isArray(searchResults) &&
          searchResults.map((user, index) => (
            <div key={index}>
              <p>{user.username}</p>
              <Button
                variant="contained"
                color="primary"
                onClick={() => handleSelectUser(user)}
              >
                Add to group
              </Button>
            </div>
          ))}
        <h2>Group Members</h2>
        <SelectedUsers
          selectedMembers={selectedMembers}
          handleRemoveUser={handleRemoveUser}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={(e) => handleSubmit(e)}
        >
          {group ? "Save Changes" : "Create Group"}
        </Button>
      </form>
    </div>
  );
}