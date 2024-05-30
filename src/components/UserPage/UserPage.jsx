import React, { useEffect, useState } from "react";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import axios from "axios";
import UserPreferencesForm from "../PreferencesForm/PreferencesForm";
import RegisterForm from "../RegisterForm/RegisterForm";

function UserPage() {
  const user = useSelector((store) => store.user);
  const history = useHistory();
  const [userPrefSummary, setUserPrefSummary] = useState([]);
  const [userAddress, setUserAddress] = useState([]);
  const [isAcctInfoFormVisible, setIsAcctInfoFormVisible] = useState(false);
  const [isPrefsFormVisible, setIsPrefsFormVisible] = useState(false);
  const [acctInfoForm, setAcctInfoForm] = useState({
    username: user.username || "",
    email: user.email || "",
  });
  const [prefsForm, setPrefsForm] = useState({ ...userPrefSummary });

  const updatePrefs = () => {
    setIsPrefsFormVisible(!isPrefsFormVisible);
  };

  const updateAcctInfo = () => {
    setIsAcctInfoFormVisible(!isAcctInfoFormVisible);
  };

  const getPrefInfo = async () => {
    axios
      .get(`/api/user_preferences/${user.id}`)
      .then((response) => {
        setUserPrefSummary(response.data);
      })
      .catch((error) => {
        console.error("Error Fetching user preferences", error);
      });
  };

  const getAddressInfo = async () => {
    axios
      .get(`/api/user/${user.id}`)
      .then((response) => {
        console.log("Address response:", response.data);
        setUserAddress(response.data);
        setAcctInfoForm((prevState) => ({
          ...prevState,
          ...response.data,
        }));
      })
      .catch((error) => {
        console.error("Error fetching Address Information:", error);
      });
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
    axios
      .put(`/api/user/${user.id}`, acctInfoForm)
      .then((response) => {
        console.log(response.data);
        setUserAddress(response.data);
        setIsAcctInfoFormVisible(false);
      })
      .catch((error) =>
        console.error(`Error updating account information: ${error}`)
      );
  };

  const submitPrefsUpdate = () => {
    axios
      .put(`/api/user_preferences/${user.id}`, prefsForm)
      .then((response) => {
        console.log(response.data);
        setUserPrefSummary(response.data);
        setIsPrefsFormVisible(false);
      })
      .catch((error) => console.error(`Error updating preferences: ${error}`));
  };

  //get user information
  useEffect(() => {
    if (user.id) {
      getPrefInfo();
      getAddressInfo();
    }
  }, [user.id]);

  //set up the Account Info form
  useEffect(() => {
    setAcctInfoForm({ ...userAddress });
  }, [userAddress]);

  //Set up the preferences form
  useEffect(() => {
    setPrefsForm({ ...userPrefSummary });
  }, [userPrefSummary]);

  return (
    <div className="container">
      <h2>Welcome, {user.username}!</h2>
      <h3>Account Information</h3>
      {!isAcctInfoFormVisible && Object.keys(userAddress).length > 0 && (
        <>
          <p>Your ID is: {user.id}</p>
          <p>Email: {user.email}</p>
          <p>Street Address:{userAddress.street1}</p>
          <p>Apt, Suite, Building Number, etc: {userAddress.street2}</p>
          <p>City: {userAddress.city}</p>
          <p>State: {userAddress.state}</p>
          <p>Postal Code:{userAddress.zip}</p>
          <p>Country: {userAddress.country}</p>
          <Button variant="contained" color="primary" onClick={updateAcctInfo}>
            Update Account Information
          </Button>
        </>
      )}
      {isAcctInfoFormVisible && (
        <>
          {console.log(acctInfoForm)}
          <RegisterForm
            initialValues={acctInfoForm}
            onSubmit={submitAcctInfoUpdate}
            onCancel={() => setIsAcctInfoFormVisible(false)}
            isRegistration={false}
          />
        </>
      )}

      <h3>Preferences Summary</h3>
      {!isPrefsFormVisible &&
        userPrefSummary &&
        Object.keys(userPrefSummary).length > 0 && (
          <div>
            {console.log(userPrefSummary)}
            <p>Max Price Range: {userPrefSummary?.max_price_range}</p>
            <p>Meat Preference: {userPrefSummary?.meat_preference}</p>
            <p>
              Religious Restrictions: {userPrefSummary?.religious_restrictions}
            </p>
            <p>
              Cuisine Types:{" "}
              {userPrefSummary?.cuisineTypes
                ?.map((cuisineType) => cuisineType.type)
                .join(", ")}
            </p>
            <p>
              Allergens:{" "}
              {userPrefSummary?.allergens
                ?.map((allergen) => allergen.allergen)
                .join(", ")}
            </p>
            <p>Open Now: {userPrefSummary?.open_now ? "Yes" : "No"}</p>
            <p>
              Accepts Large Parties:{" "}
              {userPrefSummary?.accepts_large_parties ? "Yes" : "No"}
            </p>
            <Button variant="contained" color="primary" onClick={updatePrefs}>
              Update Preferences
            </Button>
          </div>
        )}
      {isPrefsFormVisible && (
        <UserPreferencesForm
          initialValues={prefsForm}
          onSubmit={() => submitPrefsUpdate()}
          onCancel={() => setIsPrefsFormVisible(false)}
          editMode={isPrefsFormVisible}
        />
      )}
    </div>
  );
}

// this allows us to use <App /> in index.js
export default UserPage;
