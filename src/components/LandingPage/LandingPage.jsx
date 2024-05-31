import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Box, Button, Typography, Paper, Container, Grid } from "@mui/material";
import { makeStyles } from "@mui/styles";
import "./LandingPage.css";

// CUSTOM COMPONENTS
import RegisterForm from "../RegisterForm/RegisterForm";

// Define your styles
const useStyles = makeStyles((theme) => ({
  landing_text: {
    padding: theme.spacing(2),
  },
  registerContainer: {
    width: "100%",
    padding: "5px",
    marginBottom: "5px",
  },
  heading: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    textAlign: "center",
  },
  body1: {
    fontSize: '1.2rem',
  },
}));

function LandingPage() {
  const [heading, setHeading] = useState("It's SupprThyme!!!");
  const history = useHistory();

  const classes = useStyles();

  const onLogin = (event) => {
    history.push("/login");
  };

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Paper elevation={3} className={classes.landing_text}>
            <Typography variant="h2" component="h1" className={classes.heading}>
              {heading}
            </Typography>
            <Typography variant="h3" component="h2">
              No More Hangry Meltdowns!
            </Typography>
            <br />
            <Typography variant="body1">
              Are you tired of the endless debates and indecision when it comes
              to choosing a place to eat with your friends, family, or
              colleagues? Say goodbye to the hassle and hello to SupprThyme -
              the mobile web application that revolutionizes the way you dine
              out!
            </Typography>
            <Typography variant="body1">
              SupprThyme transforms the often-frustrating experience of reaching
              a consensus on a dining destination into an enjoyable and gamified
              culinary adventure. We all have different tastes, budgets, and
              dietary needs, right? With SupprThyme, you create a profile with
              your preferences like cuisine types, price range, and any dietary
              restrictions.
            </Typography>
            <Typography variant="h3" component="h2">
              How does it work?
            </Typography>
            <Typography variant="body1">
              It's simple! Someone creates a group and invites the others. Our
              innovative app then combines everyone in the group's preferences
              and searches our extensive restaurant database to suggest local
              dining options that meet your criteria.
            </Typography>
            <Typography variant="body1">
              With SupprThyme, decision-making becomes a fun and interactive
              experience. Users can vote on the restaurant suggestions, engaging
              in a collaborative process that eventually leads to a unanimous
              choice.
            </Typography>
            <Typography variant="body1">
              Join us on this gastronomic journey and let SupprThyme take the
              stress out of choosing where to eat. Say goodbye to indecision and
              hello to delightful dining experiences with SupprThyme!
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={5}>
          <Paper elevation={3}>
            <RegisterForm />
            <Box display="flex" flexDirection="column" alignItems="center">
              <Typography variant="h4">Already a Member?</Typography>
              <Button variant="contained" color="primary" onClick={onLogin}>
                Login
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
export default LandingPage;
