import React, { useState } from "react";
import { useHistory } from 'react-router-dom';
import {Button, TextField} from '@mui/material';

function GroupNameInput({ groupName, setGroupName }) {
    return (
        <TextField
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
        />
    );
}

function SelectedUsers({ selectedMembers }) {
    return (
        <div>
            {selectedMembers.map((member, index) => (
                <p key={index}>{member.username}</p>
            ))}
        </div>
    );
}

export default function GroupForm() {
    const [groupName, setGroupName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [selectedMembers, setSelectedMembers] = useState([]);
    const history = useHistory();

    const handleSearch = async () => {
        const users = await searchUsers(searchTerm);
        console.log('Server response:', users);
        setSearchResults(users);
    };

    const handleSelectUser = (user) => {
        setSelectedMembers((prevMembers) => [...prevMembers, user]);
        setSearchResults((prevResults) => prevResults.filter((u) => u.id !== user.id));
    };

    const handleSubmit = async () => {
        try{
        await createGroup(groupName, selectedMembers);
        setGroupName("");
        setSelectedMembers([]);
        history.push('/groups');}
        catch(error){
            console.error('Error creating group:', error)
        }
    };

    async function searchUsers(searchTerm) {
        const response = await fetch(`/api/user/search?search=${searchTerm}`);
        const data = await response.json();
        console.log('data:', data);
        return data.map(user =>({id: user.id, username: user.username}));
    }
    
    async function createGroup(groupName, members) {
        console.log('Creating group with members:', members); // Log the members array

        const response = await fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: groupName,
                members: members.map((member) => member.id),
            }),
        });
        const data = await response.json();
        return data.group;
    }

    return (
        <div>
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
            {Array.isArray(searchResults) && searchResults.map((user, index) => (
                <div key={index}>
                    <p>{user.username}</p>
                    <Button variant="contained" color="primary" onClick={() => handleSelectUser(user)}>
                        Add to group
                    </Button>
                </div>
            ))}
            <h2>Group Members</h2>
            <SelectedUsers selectedMembers={selectedMembers} />
            <Button variant="contained" color="primary" onClick={handleSubmit}>
                Create Group
            </Button>
        </div>
    );
}