import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [street1, setStreet1] = useState("");
  const [street2, setStreet2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [country, setCountry] = useState("");
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();
    dispatch({
      type: "REGISTER",
      payload: {
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
      },
    });
  };

  return (
    <form className="formPanel" onSubmit={registerUser}>
      <h2>Register User</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <TextField
        label="Username"
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
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
        Register
      </Button>
    </form>
  );
}

export default RegisterForm;