import React, { useEffect, useState} from "react";
import { Link as RouterLink } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import { AppBar, Toolbar, Typography, Button, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";

// Define styles
const useStyles = makeStyles((theme) => ({
  title: {
    flexGrow: 1,
  },
  link: {
    color: theme.palette.common.white,
    marginRight: theme.spacing(2),
  },
  favicon: {
    marginLeft: theme.spacing(1),
    height: "24px", // Adjust as needed
  },
}));

function Nav() {
  const classes = useStyles();
  const user = useSelector((store) => store.user);

  // Define titles and favicon
  const titles = ["Are you hungry?", "It's SupprThyme!"];
  const favicon = "/favicon.ico";

  // Set initial title
  const [title, setTitle] = useState(titles[0]);

  useEffect(() => {
    // Change title every second
    const interval = setInterval(() => {
      setTitle((prevTitle) =>
        prevTitle === titles[0] ? titles[1] : titles[0]
      );
    }, 1000);

    // Fix title on "It's SupprThyme!" after 10 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setTitle(titles[1]);
    }, 10000);

    // Clear interval and timeout on component unmount
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title}>
          <Link component={RouterLink} to="/home" className={classes.link}>
            {title}
            {title === "It's SupprThyme!" && (
              <img src={favicon} alt="favicon" className={classes.favicon} />
            )}{" "}
          </Link>
        </Typography>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Button color="inherit">
            <Link component={RouterLink} to="/login" className={classes.link}>
              Login / Register
            </Link>
          </Button>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Button color="inherit">
              <Link component={RouterLink} to="/home" className={classes.link}>
                Home
              </Link>
            </Button>

            <Button color="inherit">
              <Link
                component={RouterLink}
                to="/groups"
                className={classes.link}
              >
                Groups
              </Link>
            </Button>

            <LogOutButton className={classes.link} />

            <Button color="inherit">
              <Link component={RouterLink} to="/user" className={classes.link}>
                My Profile
              </Link>
            </Button>
          </>
        )}

        <Button color="inherit">
          <Link component={RouterLink} to="/about" className={classes.link}>
            About
          </Link>
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Nav;
