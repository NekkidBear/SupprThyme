import React, { useEffect, useState } from "react";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector, useDispatch } from "react-redux";
import { Button, Container, Paper, Typography, Box } from "@mui/material";
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserPreferencesForm from "../PreferencesForm/PreferencesForm";
import RegisterForm from "../RegisterForm/RegisterForm";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material";

import {
  fetchUserProfile,
  updateUserAddressRequest,
  toggleAcctInfoForm,
  togglePrefsForm,
  fetchUserPreferencesRequest,
  updateUserPreferencesRequest,
} from "../../redux/reducers/user.actions.js";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
  },
  paper: {
    padding: theme.spacing(2),
    textAlign: "center",
    color: theme.palette.text.secondary,
    backgroundColor: "#f5f5f5", // change this to your preferred color
    padding: theme.spacing(2),
    margin: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
  },
  text: { marginBottom: theme.spacing(1) },
  button: {
    marginTop: theme.spacing(2),
    padding: "5px",
  },
  box: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: theme.spacing(1),
    width: "100%",
  },
  section_box: {
    margin: "auto",
    width: "auto",
    padding: "5px",
  },
  section_headings: {
    backgroundColor: theme.palette.secondary.main,
    padding: "5px",
  },
}));

function UserPage() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const classes = useStyles();
  const user = useSelector((store) => store.user);
  const history = useHistory();
  const userPrefSummary = useSelector((store) => store.userPreferences);
  const isAcctInfoFormVisible = useSelector(
    (store) => store.isAcctInfoFormVisible
  );
  const isPrefsFormVisible = useSelector((store) => store.isPrefsFormVisible);
  const [acctInfoForm, setAcctInfoForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [prefsForm, setPrefsForm] = useState({});
  const userAddress = user?.address ||{};
  // const [isLoading, setIsLoading] = useState(false);
  // const error = useSelector((store) => store.userPreferences.error);

  const updatePrefs = () => {
    dispatch(togglePrefsForm());
  };

  const updateAcctInfo = () => {
    dispatch(toggleAcctInfoForm());
  };

  const getPrefInfo = () => {
    dispatch(fetchUserPreferencesRequest(user.id));
  };

  const handleAcctInfoChange = (event) => {
    setAcctInfoForm({
      ...acctInfoForm,
      [event.target.name]: event.target.value,
    });
  };

  const handlePrefsChange = (event) => {
    setPrefsForm({
      ...prefsForm,
      [event.target.name]: event.target.value,
    });
  };

  const submitAcctInfoUpdate = (event) => {
    event.preventDefault();
    dispatch(updateUserAddressRequest(acctInfoForm));
  };

  const submitPrefsUpdate = () => {
    dispatch(updateUserPreferencesRequest(prefsForm));
  };

  //get user information
  useEffect(() => {
    if (user.id) {
      getPrefInfo();
    }
  }, [user.id]);

  //set up the Account Info form
  useEffect(() => {
    if (userAddress) {
      setAcctInfoForm({ ...userAddress });
    }
  }, [JSON.stringify(userAddress)]);

  //Set up the preferences form
  useEffect(() => {
    setPrefsForm({ ...userPrefSummary });
  }, [JSON.stringify(userPrefSummary)]);

  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Typography variant="h2" component="h1" className={classes.text}>
          Welcome, {user.username}!
        </Typography>
        <Typography
          variant="h3"
          component="h2"
          className={classes.section_headings}
        >
          Account Information
        </Typography>
        {!isAcctInfoFormVisible &&
          Object.keys(userAddress).length > 0 && (
            <Box className={classes.section_box}>
              <Box className={classes.box}>
                <Typography>
                  <strong>Your ID is:</strong>
                </Typography>
                <Typography>{user.id}</Typography>
              </Box>
              <Box className={classes.box}>
                <Typography>
                  <strong>Email: </strong>
                </Typography>
                <Typography>{user.email}</Typography>
              </Box>
              <Box className={classes.box}>
                <Typography>
                  <strong>Street Address</strong>:
                </Typography>
                <Typography>{userAddress.street1}</Typography>
              </Box>
              <Box className={classes.box}>
                <Typography>
                  <strong>Apt, Suite, Building Number, etc:</strong>
                </Typography>
                <Typography>{userAddress.street2}</Typography>
              </Box>
              <Box className={classes.box}>
                <Typography>
                  <strong>City: </strong>
                </Typography>
                <Typography>{userAddress.city}</Typography>
              </Box>
              <Box className={classes.box}>
                <Typography>
                  <strong>State: </strong>
                </Typography>
                <Typography>{userAddress.state}</Typography>
              </Box>
              <Box className={classes.box}>
                <Typography>
                  <strong>Postal Code:</strong>
                </Typography>
                <Typography>{userAddress.zip}</Typography>
              </Box>
              <Box className={classes.box}>
                <Typography>
                  <strong>Country: </strong>
                </Typography>
                <Typography>{userAddress.country}</Typography>
              </Box>
              <Button
                variant="contained"
                color="primary"
                onClick={updateAcctInfo}
                className={classes.button}
              >
                Update Account Information
              </Button>
            </Box>
          )}

        {isAcctInfoFormVisible && (
          <>
            {console.log(acctInfoForm)}
            <RegisterForm
              initialValues={acctInfoForm}
              onSubmit={submitAcctInfoUpdate}
              onCancel={() => dispatch(togglePrefsForm())}
              isRegistration={false}
            />
          </>
        )}
        <Box className={classes.section_box}>
          <div className={classes.preferencesSummary}>
            <Typography
              variant="h3"
              component="h2"
              className={classes.section_headings}
            >
              Preferences Summary
            </Typography>
            {!isPrefsFormVisible &&
              userPrefSummary &&
              Object.keys(userPrefSummary).length > 0 && (
                <>
                  <Box className={classes.box}>
                    <Typography className={classes.preferencesText}>
                      <strong>Max Price Range: </strong>
                    </Typography>
                    <Typography>{userPrefSummary?.max_price_range}</Typography>
                  </Box>
                  <Box className={classes.box}>
                    <Typography className={classes.preferencesText}>
                      <strong>Meat Preference: </strong>
                    </Typography>
                    <Typography>{userPrefSummary?.meat_preference}</Typography>
                  </Box>
                  <Box className={classes.box}>
                    <Typography className={classes.preferencesText}>
                      <strong>Religious Restrictions</strong>:
                    </Typography>
                    <Typography>
                      {userPrefSummary?.religious_restrictions}
                    </Typography>
                  </Box>
                  <Box className={classes.box}>
                    <Typography className={classes.preferencesText}>
                      <strong>Cuisine Types:</strong>
                    </Typography>
                    <Typography>
                      {userPrefSummary?.cuisineTypes
                        ?.map((cuisineType) => cuisineType.type)
                        .join(", ")}
                    </Typography>
                  </Box>
                  <Box className={classes.box}>
                    <Typography className={classes.preferencesText}>
                      <strong>Allergens:</strong>
                    </Typography>
                    <Typography>
                      {userPrefSummary?.allergens
                        ?.map((allergen) => allergen.allergen)
                        .join(", ")}
                    </Typography>
                  </Box>
                  <Box className={classes.box}>
                    <Typography className={classes.preferencesText}>
                      <strong>Open Now:</strong>
                    </Typography>
                    <Typography>
                      {userPrefSummary?.open_now ? "Yes" : "No"}
                    </Typography>
                  </Box>
                  <Box className={classes.box}>
                    <Typography className={classes.preferencesText}>
                      <strong>Accepts Large Parties:</strong>
                    </Typography>
                    <Typography>
                      {userPrefSummary?.accepts_large_parties ? "Yes" : "No"}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={updatePrefs}
                    className={classes.button}
                  >
                    Update Preferences
                  </Button>
                </>
              )}
          </div>
          {isPrefsFormVisible && (
            <UserPreferencesForm
              initialValues={prefsForm}
              onSubmit={() => submitPrefsUpdate()}
              onCancel={() => dispatch(toggleAcctInfoForm())}
              editMode={isPrefsFormVisible}
            />
          )}
        </Box>
      </Paper>
    </Container>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
