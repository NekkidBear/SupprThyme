import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useSelector } from 'react-redux';


const RestaurantMap = ({center, zoom}) => {
  const restaurants = useSelector(state => state.restaurants);
  console.log('restaurants',restaurants);
  
  const containerStyle = {
    width: '100%',
    height: '400px',
  };
  console.log('restaurants:', restaurants)
  console.log('center:', center)
  console.log('zoom', zoom);

  return (
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
        {Array.isArray(restaurants) && restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{
                lat: Number(restaurant.latitude),
                lng: Number(restaurant.longitude),
              }}
            />
          ))
        ) : (
          <></>
        )}
      </GoogleMap>
  );
};

export default RestaurantMap;