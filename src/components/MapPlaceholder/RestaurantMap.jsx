import React from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const RestaurantMap = ({ restaurants, center, zoom }) => {
  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  return (
    <LoadScript googleMapsApiKey={import.meta.env.GOOGLE_MAPS_API_KEY}
      loadingElement={<div>Loading...</div>}>
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={zoom}>
        {Array.isArray(restaurants) && restaurants.length > 0 ? (
          restaurants.map((restaurant) => (
            <Marker
              key={restaurant.id}
              position={{
                lat: restaurant.latitude,
                lng: restaurant.longitude,
              }}
            />
          ))
        ) : (
          <></>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default RestaurantMap;