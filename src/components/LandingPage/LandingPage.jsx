import React, { useState } from "react";
import { useHistory } from "react-router-dom";
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
          <h3>Welcome to SupprThyme - Your Culinary Adventure Awaits!</h3>
          <br />
          <p>
            Are you tired of the endless debates and indecision when it comes to
            choosing a place to eat with your friends, family, or colleagues?
            Say goodbye to the hassle and hello to SupprThyme - the mobile web
            application that revolutionizes the way you dine out!
          </p>
          <br />
          <p>
            SupprThyme is your go-to solution for simplifying the process of
            deciding where to eat. Our app transforms the often-frustrating
            experience of reaching a consensus on a dining destination into an
            enjoyable and gamified culinary adventure.
          </p>
          <br />
          <p>
            <span>How does it work?</span> It's simple! Each user creates a
            personalized profile with their dining preferences, including price
            range, cuisine choices, dietary restrictions, and more. Our
            innovative app then aggregates these preferences and leverages our
            extensive restaurant database and API to suggest local dining
            options that meet your criteria.
          </p>
          <br />
          <p>
            But that's not all! With SupprThyme, decision-making becomes a fun
            and interactive experience. Users can vote on the restaurant
            suggestions, engaging in a collaborative process that eventually
            leads to a unanimous choice.
          </p>
          <br />
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
            <button className="btn btn_sizeSm" onClick={onLogin}>
              Login
            </button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
