import React, { useEffect, useState } from 'react';
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
  const user = useSelector((store)=>store.user)

  useEffect(() => {
    setHeading(`Find a restaurant near ${user.home_metro}`)
  }, [])
  

  return (
    <div>
      <h2>{heading}</h2>
      <div className='map-placeholder'>
        <h3>Google Maps integration coming soon!</h3>
        <p>We are working on integrating a Google Maps component to enhance your experience.</p>
      </div>
    </div>
    
  );
}

export default UserHomePage;
