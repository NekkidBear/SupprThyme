import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Box, Button, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material/styles";

const useStyles = makeStyles((theme) => ({
  form: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    boxShadow: "0px 3px 6px #00000029",
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
  },
  heading: {
    backgroundColor: theme.palette.secondary.main,
    color: "white",
    padding: theme.spacing(1),
    width: "100%",
    textAlign: "center",
  },
  field: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    width: "100%",
  },
  registerButton: {
    flexGrow: 1,
    marginRight: theme.spacing(1),
  },
  cancelButton: {
    flexGrow: 0.8,
  },
}));

function RegisterForm({
  initialValues = {},
  onSubmit = () => {},
  onCancel = () => {},
  isRegistration = true,
}) {
  const [username, setUsername] = useState(initialValues.username || "");
  const [password, setPassword] = useState(initialValues.password || "");
  const [email, setEmail] = useState(initialValues.email || "");
  const [street1, setStreet1] = useState(initialValues.street1 || "");
  const [street2, setStreet2] = useState(initialValues.street2 || "");
  const [city, setCity] = useState(initialValues.city || "");
  const [state, setState] = useState(initialValues.state || "");
  const [zip, setZip] = useState(initialValues.zip || "");
  const [country, setCountry] = useState(initialValues.country || "");
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const classes = useStyles();
  const theme = useTheme();

  const registerUser = (event) => {
    event.preventDefault();
    onSubmit({
      username: username,
      password: password,
      email: email,
      address: {
        street1: street1,
        street2: street2,
        city: city,
        state: state,
        zip: zip,
        country: country,
      },
    });
  };
  return (
    <form className={classes.form} onSubmit={registerUser}>
      <Typography variant="h2" classname={classes.heading}>
        {isRegistration ? "Register User" : "User Information"}
      </Typography>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      {isRegistration && (
        <TextField
          label="Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
          className={classes.field}
        />
      )}
      {isRegistration && (
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          className={classes.field}
        />
      )}
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        className={classes.field}
      />
      <TextField
        label="Street 1"
        value={street1}
        onChange={(event) => setStreet1(event.target.value)}
        required
        className={classes.field}
      />
      <TextField
        label="Street 2"
        value={street2}
        onChange={(event) => setStreet2(event.target.value)}
        className={classes.field}
      />
      <TextField
        label="City"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        required
        className={classes.field}
      />
      <TextField
        label="State"
        value={state}
        onChange={(event) => setState(event.target.value)}
        required
        className={classes.field}
      />
      <TextField
        label="ZIP Code"
        value={zip}
        onChange={(event) => setZip(event.target.value)}
        required
        className={classes.field}
      />
      <TextField
        label="Country"
        value={country}
        onChange={(event) => setCountry(event.target.value)}
        required
        className={classes.field}
      />
      <Box className={classes.buttonContainer}>
        <Button
          variant="contained"
          color="secondary"
          onClick={onCancel}
          className={`${classes.button} ${classes.cancelButton}`}
          size="small"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className={`${classes.button} ${classes.registerButton}`}
          size="large"
        >
          Register
        </Button>
      </Box>
    </form>
  );
}

export default RegisterForm;
