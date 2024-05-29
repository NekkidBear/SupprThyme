import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Button, TextField } from "@mui/material";
import SelectedUsers from "./SelectedUsers";
import axios from "axios";

function GroupNameInput({ groupName, setGroupName }) {
  return (
    <TextField
      label="Group Name"
      value={groupName}
      onChange={(e) => setGroupName(e.target.value)}
    />
  );
}

export default function GroupForm() {
  const history = useHistory();
  const location = useLocation();
  const group = location.state?.group;

  {group && console.log('group is ', group)}
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
  const handleRemoveUser = (userToRemove) => {
    setSelectedMembers(
      selectedMembers.filter((user) => user.id !== userToRemove.id)
    );
  };
  const handleSearch = async () => {
    const users = await searchUsers(searchTerm);
    console.log("Server response:", users);
    setSearchResults(users);
  };

  const handleSelectUser = (user) => {
    setSelectedMembers((prevMembers) => [
      ...prevMembers,
      { id: user.id, username: user.username },
    ]);
    setSearchResults((prevResults) =>
      prevResults.filter((u) => u.id !== user.id)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (group) {
      //update the existing group
      try {
        await axios.put(`/api/groups/${group.id}`, {
          group_name: groupName,
          members: selectedMembers.map((member) => member.id),
        });
        //redirect to groups page
        history.push("/groups");
      } catch (error) {
        console.error(`Error updating group with ID ${group.id}`, error);
      }
    } else {
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

  async function searchUsers(searchTerm) {
    const response = await fetch(`/api/user/search?search=${searchTerm}`);
    const data = await response.json();
    console.log("data:", data);
    return data.map((user) => ({ id: user.id, username: user.username }));
  }

  async function createGroup(groupName, members) {
    console.log("Creating group with members:", members); // Log the members array

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

  useEffect(() => {
    console.log("Selected members:", selectedMembers);
  }, [selectedMembers]);

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
