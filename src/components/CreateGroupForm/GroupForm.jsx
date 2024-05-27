import React, { useState } from "react";

export default function GroupForm() {
    const [groupName, setGroupName] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [members, setMembers] = useState([]);

    const handleSearch = async () => {
        const users = await searchUsers(searchTerm);
        setMembers(users);
    };

    const handleSubmit = async () => {
        await createGroup(groupName, members);
        setGroupName("");
        setMembers([]);
    };

    async function searchUsers(searchTerm) {
        const response = await fetch(`/api/users/search?search=${searchTerm}`);
        const data = await response.json();
        return data.users;
    }
    
    async function createGroup(groupName, members) {
        const response = await fetch('/api/groups', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: groupName,
                members: members,
            }),
        });
        const data = await response.json();
        return data.group;
    }

    return (
        <div>
            <h1>New Group</h1>
            <input
                type="text"
                placeholder="Group Name"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Search Users"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button onClick={handleSearch}>Search</button>
            <h2>Group Members</h2>
            {members.map((member, index) => (
                <p key={index}>{member.name}</p>
            ))}
            <button onClick={handleSubmit}>Create Group</button>
        </div>
    );
}