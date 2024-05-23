import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import { useSpring, animated } from 'react-spring';

function Nav() {
  const user = useSelector((store) => store.user);

  //define custom titles
  const titles = ['Are you hungry?', "It's SupprThyme!"];
  const[spring, api] = useSpring(() =>({ title: titles[0]}));

  useEffect(() =>{
    const interval = setInterval(()=>{
      api.start({title: spring.title === titles[0] ? titles[1]: titles[0]});
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="nav">
      <Link to="/home">
        <animated.h2 className="nav-title">{spring.title}</animated.h2>
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <Link className="navLink" to="/login">
            Login / Register
          </Link>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Link className="navLink" to="/home">
              Home
            </Link>

            <Link className="navLink" to="/info">
              Info Page
            </Link>

            <LogOutButton className="navLink" />

            <Link className="navLink" to="/user">
            My Profile
            </Link>
          </>
        )}

        <Link className="navLink" to="/about">
          About
        </Link>
      </div>
    </div>
  );
}

export default Nav;
