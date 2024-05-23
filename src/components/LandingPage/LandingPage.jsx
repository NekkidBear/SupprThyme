import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import "./LandingPage.css";

// CUSTOM COMPONENTS
import RegisterForm from "../RegisterForm/RegisterForm";

function LandingPage() {
  const [heading, setHeading] = useState("It's SupprThyme!!!");
  const history = useHistory();

  const onLogin = (event) => {
    history.push("/login");
  };

  return (
    <div className="container">
      <h2>{heading}</h2>

      <div className="grid">
        <div className="grid-col grid-col_8">
          <h3>No More Hangry Meltdowns!</h3>
          <br />
          <p>
            Are you tired of the endless debates and indecision when it comes to
            choosing a place to eat with your friends, family, or colleagues?
            Say goodbye to the hassle and hello to SupprThyme - the mobile web
            application that revolutionizes the way you dine out!
          </p>
          <p>
            SupprThyme transforms the often-frustrating experience of reaching a
            consensus on a dining destination into an enjoyable and gamified
            culinary adventure. We all have different tastes, budgets, and
            dietary needs, right? With SupprThyme, you create a profile with
            your preferences like cuisine types, price range, and any dietary
            restrictions.
          </p>
          <h4>How does it work?</h4>
          <p>
            It's simple! Someone creates a group and invites the others. Our
            innovative app then combines everyone in the group's preferences and
            searches our extensive restaurant database to suggest local dining
            options that meet your criteria.
          </p>
          <p>
            With SupprThyme, decision-making becomes a fun and interactive
            experience. Users can vote on the restaurant suggestions, engaging
            in a collaborative process that eventually leads to a unanimous
            choice.
          </p>
          <p>
            Join us on this gastronomic journey and let SupprThyme take the
            stress out of choosing where to eat. Say goodbye to indecision and
            hello to delightful dining experiences with SupprThyme!
          </p>
        </div>
        <div className="grid-col grid-col_4">
          <RegisterForm />

          <center>
            <h4>Already a Member?</h4>
            <Button variant="contained" color="primary" onClick={onLogin}>
              Login
            </Button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
