import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useSelector } from 'react-redux';
import { CircularProgress, Typography, Box, Card, CardContent } from '@mui/material';

const RestaurantMap = ({ center, zoom }) => {
  const restaurants = useSelector(state => state.restaurants);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [map, setMap] = useState(null);

  const containerStyle = {
    width: '100%',
    height: '400px',
  };

  const onLoad = useCallback((map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && restaurants.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      restaurants.forEach((restaurant) => {
        bounds.extend(new window.google.maps.LatLng(
          restaurant.geometry.location.lat,
          restaurant.geometry.location.lng
        ));
      });
      map.fitBounds(bounds);
    }
  }, [map, restaurants]);

  const handleMarkerClick = (restaurant) => {
    setSelectedRestaurant(restaurant);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
      >
        {restaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={{
              lat: restaurant.geometry.location.lat,
              lng: restaurant.geometry.location.lng,
            }}
            onClick={() => handleMarkerClick(restaurant)}
          />
        ))}

        {selectedRestaurant && (
          <InfoWindow
            position={{
              lat: selectedRestaurant.geometry.location.lat,
              lng: selectedRestaurant.geometry.location.lng,
            }}
            onCloseClick={() => setSelectedRestaurant(null)}
          >
            <Card>
              <CardContent>
                <Typography variant="h6">{selectedRestaurant.name}</Typography>
                <Typography>Rating: {selectedRestaurant.rating}</Typography>
                <Typography>Price Level: {"$".repeat(selectedRestaurant.price_level)}</Typography>
                <Typography>Address: {selectedRestaurant.location_string}</Typography>
              </CardContent>
            </Card>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default RestaurantMap;
