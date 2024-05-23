import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [home_metro, setHomeMetro] = useState("");
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
        home_metro: home_metro,
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
        label="Home Metro"
        value={home_metro}
        onChange={(event) => setHomeMetro(event.target.value)}
        required
      />
      <Button variant="contained" type="submit">
        Register
      </Button>
    </form>
  );
}

export default RegisterForm;