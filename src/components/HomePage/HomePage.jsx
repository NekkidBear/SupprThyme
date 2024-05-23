import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Button } from '@mui/material';
import MapPlaceholder from '../MapPlaceholder/MapPlaceholder';

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
     <MapPlaceholder />
     <div>
        <Button />
     </div>
    </div>
    
  );
}

export default UserHomePage;
