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
import { makeStyles } from "@mui/styles";

// Define styles
const useStyles = makeStyles((theme) => ({
  table: {
    minWidth: 650,
  },
  header: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    textAlign: 'center',
  },
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
  cell: {
    borderLeft: '1px solid gray',
    borderRight: '1px solid gray',
    textAlign: 'center'
  },
}));

export default function GroupsPage() {
  const classes = useStyles();
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
    const groupToEdit = groups.find((group) => group.id === groupId);

    // Navigate to the GroupForm component and pass the group data
    history.push({
      pathname: "/groupForm",
      state: { group: groupToEdit },
    });
  };

  const deleteGroup = async (groupId, group_name) => {
    console.log(`Deleting group ${group_name} with id ${groupId}`);
    try {
      await axios.delete(`/api/groups/${groupId}`);
      setGroups(groups.filter((group) => group.id != groupId));
    } catch (error) {
      console.error(`Error deleting group: ${error}`);
    }
  };
  return (
    <div>
    <h1>My Groups</h1>
    <h2>Create a group</h2>
    <button onClick={handleCreateGroup}>Create a Group</button>
    <h3>Existing Groups</h3>
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="Existing Groups table">
        <TableHead>
          <TableRow className={classes.header}>
            <TableCell className={`${classes.header} ${classes.cell}`}>Group Name</TableCell>
            <TableCell className={`${classes.header} ${classes.cell}`}>Group Members</TableCell>
            <TableCell className={`${classes.header} ${classes.cell}`}>Edit Group</TableCell>
            <TableCell className={`${classes.header} ${classes.cell}`}>Search with Group</TableCell>
            <TableCell className={`${classes.header} ${classes.cell}`}>Delete Group</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {groups.map((group) => (
            <TableRow key={group.id} className={classes.row}>
              <TableCell className={classes.cell}>{group.group_name}</TableCell>
              <TableCell className={classes.cell}>
                {group.members.map((member) => member.username).join(", ")}
              </TableCell>
              <TableCell className={classes.cell}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => editGroup(group.id)}
                >
                  Edit Group
                </Button>
              </TableCell>
              <TableCell className={classes.cell}>
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
