import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from 'react-redux';
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
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Box,
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
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
  },
}));

export default function GroupsPage() {
  const classes = useStyles();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const history = useHistory();
  
  // Get the user ID from the Redux store
  const userId = useSelector((state) => state.user.id);

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/groups");
      setGroups(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch groups. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGroup = () => {
    history.push("/groupForm");
  };

  const handleSearchRestaurants = (groupId) => {
    history.push(`/search-results/${groupId}`);
  };

  const editGroup = (groupId) => {
    const groupToEdit = groups.find((group) => group.id === groupId);
    history.push({
      pathname: "/groupForm",
      state: { group: groupToEdit },
    });
  };

  const openDeleteDialog = (group) => {
    setGroupToDelete(group);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setGroupToDelete(null);
  };

  const deleteGroup = async () => {
    if (!groupToDelete) return;

    try {
      await axios.delete(`/api/groups/${groupToDelete.id}`);
      setGroups(groups.filter((group) => group.id !== groupToDelete.id));
      setSnackbarMessage(`Group "${groupToDelete.group_name}" deleted successfully`);
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage(`Error deleting group: ${error.message}`);
      setSnackbarOpen(true);
    } finally {
      closeDeleteDialog();
    }
  };

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box>
      <h1>My Groups</h1>
      <Button variant="contained" color="primary" onClick={handleCreateGroup}>
        Create a Group
      </Button>
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
                    color="error"
                    onClick={() => openDeleteDialog(group)}
                  >
                    Delete Group
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={deleteDialogOpen}
        onClose={closeDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete the group "{groupToDelete?.group_name}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={deleteGroup} color="error" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
}
