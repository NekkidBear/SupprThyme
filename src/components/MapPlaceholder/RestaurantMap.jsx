import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useSelector } from 'react-redux';


const RestaurantMap = ({center, zoom }) => {
  const restaurants = useSelector(state => state.restaurants);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };
  console.log('restaurants:', restaurants)
  console.log('center:', center)
  console.log('zoom', zoom);

  return (
    // <LoadScript googleMapsApiKey={import.meta.env.GOOGLE_MAPS_API_KEY}
    //   loadingElement={<div>Loading...</div>}>
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
    // </LoadScript>
  );
};

export default RestaurantMap;