import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { Button, TextField } from "@mui/material";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [userCity, setUserCity] = useState("");
  const [userStateLocation, setUserStateLocation] = useState("");
  const errors = useSelector((store) => store.errors);

  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch user profile from server
    if (errors.loginMessage === "Login successful") {
      fetch("/api/user/profile")
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch user profile");
          }
        })
        .then((profile) => {
          setUserCity(profile.city);
          setUserStateLocation(profile.state);
          // Rest of your code...
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, [errors.loginMessage]);
  const login = (event) => {
    event.preventDefault();
    if (username && password) {
      dispatch({
        type: "LOGIN",
        payload: {
          username: username,
          password: password,
          latitude: latitude,
          longitude: longitude,
        },
      });
  
      // Fetch user profile from server after logging in
      fetch("/api/user/profile")
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Failed to fetch user profile");
          }
        })
        .then((profile) => {
          setUserCity(profile.city);
          setUserStateLocation(profile.state);
  
          // Fetch location
          const fetchLocation = async () => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  setLatitude(position.coords.latitude);
                  setLongitude(position.coords.longitude);
                },
                async (error) => {
                  // Geolocation permission denied or other error occurred
                  fetch(
                    `/api/user/normalizeLocation?city=${userCity}&state=${userStateLocation}`
                  )
                    .then((response) => {
                      if (response.ok) {
                        return response.json();
                      } else {
                        throw new Error("Failed to normalize location");
                      }
                    })
                    .then((normalizedLocation) => {
                      setLatitude(normalizedLocation.latitude);
                      setLongitude(normalizedLocation.longitude);
                    })
                    .catch((error) => {
                      console.error("Error:", error);
                    });
                }
              );
            } else {
              // Geolocation API not available
              fetch(
                `/api/user/normalizeLocation?city=${userCity}&state=${userStateLocation}`
              )
                .then((response) => {
                  if (response.ok) {
                    return response.json();
                  } else {
                    throw new Error("Failed to normalize location");
                  }
                })
                .then((normalizedLocation) => {
                  setLatitude(normalizedLocation.latitude);
                  setLongitude(normalizedLocation.longitude);
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            }
          };
          fetchLocation(); // Call the function
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      dispatch({ type: "LOGIN_INPUT_ERROR" });
    }
  };
  return (
    <form className="formPanel" onSubmit={login}>
      <h2>Login</h2>
      {errors.loginMessage && (
        <h3 className="alert" role="alert">
          {errors.loginMessage}
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
      <Button variant="contained" type="submit">
        Log In
      </Button>
    </form>
  );
}

export default LoginForm;