import React, { useState } from 'react';
import {useSelector} from 'react-redux';
import { Button } from '@mui/material';

// Basic functional component structure for React with default state
// value setup. When making a new component be sure to replace the
// component name TemplateFunction with the name for the new component.
function UserHomePage(props) {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const store = useSelector((store) => store);
  const [heading, setHeading] = useState('Functional Component');

  setHeading('Find a restaurant')

  return (
    <div>
      <h2>{heading}</h2>
      <p>It's time to play the Music!</p>
    </div>
  );
}

export default UserHomePage;
