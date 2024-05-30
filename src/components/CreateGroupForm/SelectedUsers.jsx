// Import necessary Material UI components and makeStyles for styling
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
  // Style for the table
  table: {
    minWidth: 650,
  },
  // Style for the table header
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
  },
  // Style for the table rows
  row: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
  },
}));

// SelectedUsers component
export default function SelectedUsers({ selectedMembers, handleRemoveUser }) {
  // Generate class names for styling
  const classes = useStyles();

  // Render the component
return (
    /* Container for the table */
    <TableContainer component={Paper}>
      {/* The table itself */}
      <Table className={classes.table} aria-label="Existing Group table">
        {/* The table header */}
        <TableHead>
          <TableRow className={classes.header}>
            <TableCell>Username</TableCell>
            <TableCell>Remove</TableCell>
          </TableRow>
        </TableHead>
        {/* The table body */}
        <TableBody>
          {/* Map over the selectedMembers array to generate a row for each member */}
          {selectedMembers.map((user, index) => (
            <TableRow key={index} className={classes.row}>
             { /* The username cell */}
              <TableCell>{user.username}</TableCell>
              {/* The remove button cell */}
              <TableCell>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleRemoveUser(user)}
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}