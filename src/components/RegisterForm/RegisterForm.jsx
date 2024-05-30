import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";

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
    <form className="formPanel" onSubmit={registerUser}>
      <h2>{isRegistration? "Register User" : "User Information"}</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      {isRegistration && <TextField
        label="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />}
      {isRegistration && <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />}
      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <TextField
        label="Street 1"
        value={street1}
        onChange={(event) => setStreet1(event.target.value)}
        required
      />
      <TextField
        label="Street 2"
        value={street2}
        onChange={(event) => setStreet2(event.target.value)}
      />
      <TextField
        label="City"
        value={city}
        onChange={(event) => setCity(event.target.value)}
        required
      />
      <TextField
        label="State"
        value={state}
        onChange={(event) => setState(event.target.value)}
        required
      />
      <TextField
        label="ZIP Code"
        value={zip}
        onChange={(event) => setZip(event.target.value)}
        required
      />
      <TextField
        label="Country"
        value={country}
        onChange={(event) => setCountry(event.target.value)}
        required
      />
      <Button variant="contained" type="submit">
        {isRegistration ? "Register": "Save Changes"}
      </Button>
      <Button variant="contained" onClick={onCancel} color="secondary">
        Cancel
      </Button>
    </form>
  );
}

export default RegisterForm;
