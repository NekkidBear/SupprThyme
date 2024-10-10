import React, { useEffect, useState} from "react";
import { Link as RouterLink } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import { useSelector } from "react-redux";
import { useSpring, animated } from "react-spring";
import { AppBar, Toolbar, Typography, Button, Link } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useTheme } from "@mui/material";

// Define styles
const useStyles = makeStyles((theme) => ({
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: '0 0 30px',
    backgroundColor: '#00acb0',
    overflow: 'hidden',
  },

  title: {
    flexGrow: 1,
    fontSize: '24px',
    fontWeight: '700',
    color: theme.palette.common.white,
    paddingLeft: '10px',
    margin: '0',
  },
   link: {
    textDecoration: 'none',
    display: 'inline-block',
    color: theme.palette.common.white,
    backgroundColor: theme.palette.primary.main,
    textAlign: 'center',
    padding: '24px 10px',
    fontSize: '15px',
    border: 'none',
    cursor: 'pointer',
    outline: '0',
    '&:hover': {
      backgroundColor: '#008183',
    },
  },
  favicon: {
    marginLeft: theme.spacing(1),
    height: "24px", 
  },
  logoutButton: {
    boxShadow: '0px 3px 5px 2px rgba(0, 0, 0, .3)', // Add a drop shadow
    },
}));

function Nav() {
  const theme = useTheme();
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
        <Typography variant="h6" className={classes.title} style={{color: theme.palette.common.white}}>
          <Link component={RouterLink} to="/home" className={classes.link} style={{color: theme.palette.common.white}}>
            {title}
            {title === "It's SupprThyme!" && (
              <img src={favicon} alt="favicon" className={classes.favicon} />
            )}
          </Link>
        </Typography>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Button style={{color: theme.palette.common.white}}>
            <Link component={RouterLink} to="/login" className={classes.link} style={{color: theme.palette.common.white}}>
              Login / Register
            </Link>
          </Button>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Button style={{color: theme.palette.common.white}}>
              <Link component={RouterLink} to="/home" className={classes.link} style={{color: theme.palette.common.white}}>
                Home
              </Link>
            </Button>

            <Button style={{color: theme.palette.common.white}}>
              <Link
                component={RouterLink}
                to="/groups"
                className={classes.link}
                style={{color: theme.palette.common.white}}
              >
                Groups
              </Link>
            </Button>

            <Button style={{color: theme.palette.common.white}}>
              <Link
                component={RouterLink}
                to="/user-preferences"
                className={classes.link}
                style={{color: theme.palette.common.white}}
              >
                Preferences
              </Link>
            </Button>

            <Button style={{color: theme.palette.common.white}}>
              <Link component={RouterLink} to="/user" className={classes.link} style={{color: theme.palette.common.white}}>
                My Profile
              </Link>
            </Button>

            <LogOutButton className={`${classes.link} ${classes.logoutButton}`} />
          </>
        )}

      </Toolbar>
    </AppBar>
  );
}

export default Nav;
