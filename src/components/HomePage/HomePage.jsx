import React, { useEffect, useState } from 'react';
import {useSelector} from 'react-redux';
import { Button } from '@mui/material';
import MapPlaceholder from '../MapPlaceholder/MapPlaceholder';
import { useHistory } from 'react-router-dom'

function UserHomePage(props) {
  // Using hooks we're creating local state for a "heading" variable with
  // a default value of 'Functional Component'
  const [heading, setHeading] = useState('Functional Component');
  const user = useSelector((store)=>store.user)

  const handleClick=()=>{
    const history = useHistory();
    history.push('/create-group')
    //todo
  }

  useEffect(() => {
    setHeading(`Find a restaurant near ${user.home_metro}`)
  }, [])
  

  return (
    <div>
      <h2>{heading}</h2>
     <MapPlaceholder />
     <div>
        <Button variant='contained' color="primary" onClick={handleClick}>
            Create a group
        </Button> 
     </div>
    </div>
    
  );
}

export default UserHomePage;
